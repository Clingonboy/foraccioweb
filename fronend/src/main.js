import Table from './Table.js'
import Player from './Player.js'
import checkTrick from './util.js'
import takeCard from './takecard.js'
import { drawHighlightPlayRect, drawPlayRect, drawPlayersNumber, 
        drawingCardBack, drawTakeRect, drawHTakeRect } from './drawing.js'
import Deck from './Deck.js'

// setup socket.io
const socket = io('http://localhost:3000')
socket.on('init', handleInit)

function handleInit(msg) {
    console.log(msg)
}


console.log('start')
const APP = (function(){
    // definition of the canvas geometry
    const W = 600 // width of the canvas
    const H = 600 // height of the casnvas
    const PADDING_PLAYER = Math.floor(W / 30)
    const PLAYER_POSITIONS = {
        P1: {x: W / 2, y: H - PADDING_PLAYER},
        P2: {x: W - PADDING_PLAYER, y: H / 2},
        P3: {x: W / 2, y: 0 + PADDING_PLAYER},
        P4: {x: 0 + PADDING_PLAYER, y: H / 2},
    }
    const IMG_H = H / 5
    const IMG_W = IMG_H / 2.5
    const TACKERECT = {
        x: PADDING_PLAYER * 2,
        y: H - PADDING_PLAYER * 4 - IMG_H * 2,
        w: IMG_W * 1.5,
        h: IMG_H * 1.3
    }
    const PLAYERS_NAME = ['Eugenio', 'Gian', 'Nazza', 'Bamby']
    const NUMBER_OF_PLAYER = 4
    const canvas = document.querySelector('.canvas')
    canvas.height = H
    canvas.width = W
    const ctx = canvas.getContext('2d')
    const HLRECT = {
        x: W * 0.2,
        y: H * 0.2,
        w: W * 0.6,
        h: H * 0.5
    }
    const output = document.querySelector('.output')
    
    // game LOGIC parameters
    const table = new Table()
    // only for debug
    window.table = table
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    const suits = ['BASTONI', 'COPPE', 'SPADE', 'DENARI']
    let deck = null
    const players = []
    let hightlightRect = false
    let hightlightRectTake = false

    // function that draw all the contest in the canvas
    const draw = () => {
        ctx.beginPath()
        ctx.rect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#32a852'
        ctx.fill()
        ctx.closePath()
        
        // drawing players number
        drawPlayersNumber(ctx, PLAYER_POSITIONS)

        // if the player move a card over the are for release the cartd
        // area is hightlighted with strong rectangle
        if (hightlightRect) {
            drawHighlightPlayRect(ctx, HLRECT)
        }

        // drawing a thin rectangle indicated card release area
        drawPlayRect(ctx, HLRECT)
        
        // drawing table's cards
        table.cards.forEach(card =>{
            ctx.drawImage(card.image, card.x, card.y, IMG_W, IMG_H)
        })

        // drawing table's cards take position
        table.cardTakePosition.forEach(card =>{
            ctx.drawImage(card.image, card.x, card.y, IMG_W, IMG_H)
        })

        // drawing hightlightAreaTake
        if( hightlightRectTake ) { 
            drawHTakeRect(ctx, TACKERECT)
        }
        // drawing tacke rect
        drawTakeRect(ctx, TACKERECT)       

        // drawing player's cards
        posingCards(players[0])
        players[0].cards.forEach(card =>{
            ctx.drawImage(card.image, card.x, card.y, IMG_W, IMG_H)
        })

        window.requestAnimationFrame(draw)
    }

    // method to pass like callback
    // this method start the game it is lounch from the promise of images loading
    //
    //
    const callBackLoadingImage = () => {
        console.log('callBackLoadingImage on')
        createPlayers()
        canvas.addEventListener('mousedown', mouseDownHandler)

        window.requestAnimationFrame(draw)
    }
// ---------------------------------------------------------------------------//
    // event endler ------------------
    const mouseDownHandler = (ev) => {
        let cRect = canvas.getBoundingClientRect()
        let x = ev.clientX - cRect.left
        let y = ev.clientY - cRect.top

        players[0].cards.forEach((card) => {
            let delta = clickIsInside(x, y, card)
            if (delta) {
                card.state = 'drag'
                cardDrag = card
                deltaCardDrag = delta
                canvas.addEventListener('mousemove', cardDragHandler)
                canvas.addEventListener('mouseup', mouseUpHandler)
            }
        })
    }

    // purtroppo ho dovuto creare queste due variabili "globali" percke altrimenti
    // non so come fare vorrei trovare un modo per gestire meglio questa parte 
    let cardDrag = null
    let deltaCardDrag = null

    // function that move the clicked card.
    const cardDragHandler = (ev) => {
        let cRect = canvas.getBoundingClientRect()
        let x = ev.clientX - cRect.left - deltaCardDrag.dx
        let y = ev.clientY - cRect.top - deltaCardDrag.dy
        cardDrag.x = x
        cardDrag.y = y
        hightlightArea(ev)
        hightlightAreaTake(ev)
    }

    // function to stop drag the card when mouse button is release
    const mouseUpHandler = () => {
        canvas.removeEventListener('mousemove', cardDragHandler)
        let prese = checkTrick(cardDrag, table.cards)
        let isOn = isCardAlredyOnTheTable(cardDrag, table.cards, prese) 

        // gestione del caso in qui la carta viene rilasciata nella posizione take
        if ( cardDrag.x > TACKERECT.x && (cardDrag.x + IMG_W ) < (TACKERECT.x + TACKERECT.w ) &&
                cardDrag.y > TACKERECT.y && (cardDrag.y + IMG_H ) < (TACKERECT.y + TACKERECT.h) &&
                prese.length > 0) { 
                // check alse is in the play are there are 
                // possible taken card only in that case the card is release on 
                // the tackerect

            let posToRemove = players[0].cards.indexOf(cardDrag)
            cardDrag.state = 'take'
            table.cardTakePosition.push(players[0].cards.splice(posToRemove, 1)[0])
            canvas.removeEventListener('mouseup', mouseUpHandler)
            canvas.removeEventListener('mousedown', mouseDownHandler)
            posToRemove = null
            cardDrag = null
            deltaCardDrag = null
            hightlightRect = false
            hightlightRectTake = false

            // here is neccesary to call a method that permit to the player to
            // take cards from the table based on the card placed on takerect
            // is necessary to handle a clieck over available card and move away 
            // the taken cards all this staff is make on takecard.js file
            
            // in order the give accessibility to the necessary information to 
            // this external function we prepare an object with all necessary 
            // information inside to pass as parameter to the call of this function
            
            let takeCardData = {
                players: players,
                table: table,
                canvas: canvas,
                ctx: ctx
            }

            takeCard(takeCardData)
            canvas.addEventListener('mousedown', mouseDownHandler)

            return
        }

        // se la carta è fuori dal quadrato giusto deve tornare alla 
        // e anche se una carta con stesso valore è già presente nel tavolo
        // base senza essere rimossa dal giocatore
        else if ((cardDrag.x > HLRECT.x + HLRECT.w || cardDrag.x < HLRECT.x ||
            cardDrag.y < HLRECT.y || cardDrag.y + IMG_W > HLRECT.x + HLRECT.h) || isOn)  {
            drawingCardBack(cardDrag, players[0], PLAYER_POSITIONS.P1.x, PLAYER_POSITIONS.P1.y)
            canvas.removeEventListener('mouseup', mouseUpHandler)
            return
        } else if ( isOn || cardDrag.value == 1 ){
            drawingCardBack(cardDrag, players[0], PLAYER_POSITIONS.P1.x, PLAYER_POSITIONS.P1.y)
            canvas.removeEventListener('mouseup', mouseUpHandler)
            return
        }

        let posToRemove = players[0].cards.indexOf(cardDrag)
        // table recive the removing card from the player
        table.reciveCard(players[0].cards.splice(posToRemove, 1)[0])
        players[0].storePlayedCard(cardDrag)
        canvas.removeEventListener('mouseup', mouseUpHandler)
        cardDrag.state = 'table'
        // update output information
        output.innerHTML += `Giocatore 1: ${cardDrag.value} - ${cardDrag.suit} <br>`
        output.innerHTML += `Rimangono: ${players[0].cards.length} carte <br> ... <br>`

        posToRemove = null
        cardDrag = null
        deltaCardDrag = null
        hightlightRect = false
        hightlightRectTake = false
    }


    // questa funzione controlla se la carta che che stiamo 
    // per rilasciare ne ha una uguale nel tavolo oppure se
    // esiste una presa possibile nel tavo
    // in entrambi i casi la carta non può essere 
    // rilasaciata nel tavolo la funzione restituisce true o false
    function isCardAlredyOnTheTable(card, arrTable, prese) {
        let result = false
        arrTable.forEach(el => {
            if ( el.value == card.value ) {
                result = true
            }  
        })

        prese.forEach(presa => {
            let tot = 0
            presa.forEach(el => {
                tot += arrTable[el].value
            })
            if ( tot == card.value ) {
                result = true
            }
        })

        return result
    }

    // function to hightlight are where to release the card
    const hightlightArea = (ev) => {
        let pos = getMousePos(ev, canvas)
        if (pos.x > (HLRECT.x) && pos.x < (HLRECT.x + HLRECT.w) 
            && pos.y > (HLRECT.y) && pos.y < (HLRECT.y + HLRECT.h)) {
            hightlightRect = true
        }else {hightlightRect = false}
    }
    // funzione per evidenziare rettangolo di deposito
    // quando la carta è sopra
    const hightlightAreaTake = (ev) => {
        let pos = getMousePos(ev, canvas)
        if (pos.x > (TACKERECT.x) && pos.x < (TACKERECT.x + TACKERECT.w) 
            && pos.y > (TACKERECT.y) && pos.y < (TACKERECT.y + TACKERECT.h)) {
            hightlightRectTake = true
        }else {hightlightRectTake = false}
    }

    // utility function that return the mouse position
    const getMousePos = (ev, canvas) => {
        let cRect = canvas.getBoundingClientRect()
        let x = ev.clientX - cRect.left - deltaCardDrag.dx
        let y = ev.clientY - cRect.top - deltaCardDrag.dy
        return {x: x, y: y}
    }
// -------------------------------------------------------------------------- //
    /*
     * function clickIsInside
     * check if clicked point is inside of a card
     * return false or the distance from the cliched point to the
     * reference point of the card
     */
    const clickIsInside = (x, y, card) => {
        if (x > card.x && x < card.x + IMG_W && y > card.y && y < card.y + IMG_H) {
            return {dx: x - card.x, dy: y - card.y }
        } else { return false }
    }
    
    // funzione da sistemare per adattarla a seconda della posizione del player
    // function that set the card.x posizione of the player in oder to be
    // drawed properly
    const posingCards = (player) => {
        if (player.cards.length === 0) {return}
        let y1 = H - PADDING_PLAYER * 2 - IMG_H
        let step = (W / (player.cards.length + 2))
        let x1 = (W - step * player.cards.length) / 2

        for (let i = 0; i < player.cards.length; i++) {
            if (player.cards[i].state == 'base') {
                player.cards[i].x = x1
                player.cards[i].y = y1
                x1 += step
            }
        }
    }

    // create the player given them the cards from a shuffle deck\
    const createPlayers = () => {
        let cardsForPlayer = values.length
        let start = 0
        for (let i = 0; i < NUMBER_OF_PLAYER; i++) {
            players.push(new Player(PLAYERS_NAME[i], PLAYER_POSITIONS.P1))
            for (let j = 0; j < cardsForPlayer; j++) {
                players[i].receiveCard(deck.cards[j+start])
                players[i].orderCard()
            }
            start += cardsForPlayer - 1
        }
        posingCards(players[0])
        // only for debug
        window.player = players[0]
    }
    
    // create the deck of cards and start the game loop 
    // with callBackLoadingImage function
    const createDeck = () => {
        deck = new Deck(values, suits, callBackLoadingImage)
    }

    // The function createDeck is call and when all che cards are loaded
    // The callBackLoadingImage function is colled.
    // The colled of the callBackLoadingImage function start the game loop
    //
    createDeck()
    // return only for debug
    return { deck, players, table}

})()

