'use strict';

class Table {
    constructor () {
        this.cards = [];
        this.cardTakePosition = [];
    }

    reciveCard (card) {
        this.cards.push(card);
    }
}

class Player {
    constructor(name, position) {
        this.name = name;
        this.position = position;
        this.cards = []; // cards in hand 
        this.playedCards = []; // arrey of played cards
        this.taken = []; // arrey that store the tached card in form of [[takerCard][token cards]]
    }

    receiveCard (card) {
        this.cards.push(card);
    }

    orderCard () {
        this.cards.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 :0));
    }

    storePlayedCard (card) {
        let cardToStore = { value: card.value, suit: card.suit };
        this.playedCards.push(cardToStore);
    }
}

// funzioni di supporto per gestire i casi particolari


/**
 *  check if the given card can take some card from the table
 *  return an array with inside an arrey with all possible take
 *
 *  queste funzioni sono troppo incasinate, devo riscrivere tutto
 *  ma intanto mi è servito per capire come risolvere il problema
 *
 * ci sono troppe operazioni fatte in giro, devo creare delle funzioni
 * per evitare di ripere il solito codice più volte
 * ma intanto cerchiamo di capire come elaborare bene l'array
 *
 */

function checkTrick (card, arr) {
    // const possibleSum = {
    //     2: [[2]],
    //     3: [[3]],
    //     4: [[4]],
    //     5: [[5], [3, 2]],
    //     6: [[6], [4, 2]],
    //     7: [[7], [5, 2], [3, 4]],
    //     8: [[8], [5, 3], [6, 2]],
    //     9: [[9], [7, 2], [6, 3], [5, 4], [4, 3, 2]],
    //     10: [[10], [8, 2], [7, 3], [6, 4], [5, 3, 2]],
    //     11: [[11]],
    //     12: [[12]],
    //     13: [[13]]
    // }

    let prese = [];
    // let arrMax = 12 // max element in arr numero massimo di carte sul tavolo
    let n = arr.length;
    let cardN = 1; // max combination number
    if ( card.value > 4 && card.value < 9 ) { cardN = 2; }
    if ( card.value == 9 || card.value == 10 ) { cardN = 3; }
    if ( card.value == 1 ) { cardN = 0; }

    /*
     * caso piu semplice, cardN = 0 significa che la carta è un asso
     * prende tutte le carte sul tavolo quindi restituiamo un arrei con
     * un solo elemento, un arrei con tutti gli indici delle carte da 0 a n-1
     */
    if ( cardN == 0 ) {
        prese[0] = [];
        for ( let x = 0; x < n; x++ ) {
            prese[0].push(x);
        }
    }

    /* 
     * Caso in cui cardN è uguale a 1 significa che si deve cercare solo la
     * corrispondenza 1:1 anche in questo caso restituiamo un arrei con un solo
     * elemento, un arrei che contiene l'indice della carta che si puo prendere
     * se non c'è nussuna corrispondenza prese sarà un arrei vuoto
     */
    if ( cardN == 1 ) {
        for ( let x = 0; x < n; x++ ) {
            if ( card.value == arr[x].value ) {
                prese[0] = [];
                prese[0].push(x);
            }
        }
    }

    /**
     * Caso in cui cardN = 2, per le carte [5, 6, 7, 8] in questo coso dobbiamo, 
     * prima cercare fra le corrispondenze 1:1
     * poi fra tutte le possibili combinazioni di somme di 2
     * numeri. A differenza dei casi precedenti il valore restituito della variabile
     * prese potrà essere: un array vuoto se non c'è nessuna corrispondenza oppure
     * un arrei con uno o piu elementi, ogni elemento è un array che contiene gli
     * indici delle carte che si possono prendere.
     * In funzione del fatto che sul tavolo possono trovarsi massimo 12 carte
     * caso molto improbabile, dalla 2 alla 13(rè) se la carta è un 9 o un 10 il
     * massimo numero di prese possiili è 5 il minimo è 0 array vuoto.
     */
    if ( cardN == 2 ) {
        // prima cechiamo tra le corrispondenze 1:1 che potrà essere massimo una
        for ( let x = 0; x < n; x++ ) {
            if ( card.value == arr[x].value ) {
                prese[0] = [];
                prese[0].push(x);
            }
        }
        // adesso viene la parte difficile dobbiamo cercare tra tutte le possibili
        // somme fra tutti gli elementi dell'array di carte
        // se le carte sul tavolo sono solo due il problema si semplifica, basta
        // controllare la somma delle due
        if ( n == 2 ) {
            if ( (arr[0].value + arr[1].value) == card.value ) {
                prese.push([0, 1]); // soluzione poco elegante ma che funziona
            }
        }
        // per tutti i casi con n > 2 bisogna iterare fra tutte le combinazioni
        if ( n > 2 ) {
            for ( let x = 0; x < n; x++ ) {
                for ( let j = 1; j < ( n - x ); j++ ) {
                    if ( ( arr[x].value + arr[x + j].value ) == card.value ) {
                        prese.push([]);
                        prese[prese.length - 1].push(x);
                        prese[prese.length - 1].push(x+j);
                    }
                }
            }
        } // testo e funziona !!! grande soddisfazione
    }

    /**
     * Ultimo caso se cardN = 3 per le carte 9 e 10 in questo caso olte a prevare
     * la somma di due carte dobbiamo cercare anche la possibile somma di 3 carte
     * quindi cobbiamo cercare i tre casi:
     * corrispondenza 1:1
     * somma di due carte
     * somma di tre carte
     * 
     */
    if ( cardN == 3 ) {
        // anche in questo caso
        // prima cechiamo tra le corrispondenze 1:1 che potrà essere massimo una
        for ( let x = 0; x < n; x++ ) {
            if ( card.value == arr[x].value ) {
                prese[0] = [];
                prese[0].push(x);
            }
        }
        // anche in questo caso dobbiamo verificare il caso in cui ci siano due
        // carte sul tavolo
        if ( n == 2 ) {
            if ( (arr[0].value + arr[1].value) == card.value ) {
                prese.push([0, 1]); // soluzione poco elegante ma che funziona
            }
        }
        
        // bisogna come nel caso precedente cercare prima le possibili somme di 
        // due numeri perchè anche questo caso può essere presente insieme al 
        // caso di somma di tre carte.
        if ( n > 2 ) {
            for ( let x = 0; x < n; x++ ) {
                for ( let j = 1; j < ( n - x ); j++ ) {
                    if ( ( arr[x].value + arr[x + j].value ) == card.value ) {
                        prese.push([]);
                        prese[prese.length - 1].push(x);
                        prese[prese.length - 1].push(x+j);
                    }
                }
            }
        } // testo e funziona !!! grande soddisfazione


        // e adesso tutti i casi in cui le carte sono più di due cercando anche 
        // la somma di 3 carte, aggiungiamo un alteriore ciclo for al ciclo di 
        // prima per la ricerca di somma di due carte
        if ( n > 2 ) {
            for ( let x = 0; x < n; x++ ) {
                for ( let j = 1; j < ( n - x ); j++ ) {
                    for ( let z = j+1; z < ( n - x ); z++ ){
                        if ( ( arr[x].value + arr[x + j].value + arr[x + z].value) == card.value ) {
                            prese.push([]);
                            prese[prese.length - 1].push(x);
                            prese[prese.length - 1].push(x+j);
                            prese[prese.length - 1].push(x+z);
                        }
                    }
                }
            }
        } // sono proprio contento!! funziona tutto 
    }

/*
 * vogliamo restituire un arrei che contenga tanti arrei quante le possibili prese
 *
 */
    return prese
}

// la base è fatta
// resta da gestire larray clickedCardIndex
// per evidenziare o de evidenziare la carta selezionata
// strutturare il sistema che controlla se la carta è
// prendibile e poi andare avanti

// l'oggetto ricevuto come parametro è fotto in questo modo:
// let takeCardData = {
//     players: players,
//     table: table,
//     canvas: canvas,
//     ctx: ctx
// }


function takeCard(takeCardData) {
    takeCardData.canvas.addEventListener('click', clickCard);
    const cards = takeCardData.table.cards;
    const ctx = takeCardData.ctx;
    const player = takeCardData.players[0];
    let mainCard = takeCardData.table.cardTakePosition[0];
    let clickedCardIndex = [];
    let rectToDraw = [];


    function clickCard(ev) {
        const cRect = takeCardData.canvas.getBoundingClientRect();
        let x = ev.clientX - cRect.left;
        let y = ev.clientY - cRect.top;
        
        for ( let j = 0; j < cards.length; j++ ) {
            if ( isInside(x, y, cards[j]) ) {
                // richiamo della funzione che controlla lacarta
                // questa funzione riceve come parametro l'indice della carta
                // nell'array di carte e un oggetto rettangolo che ne definisce
                // la posizione nel canvas

                checkClickedCard(j, isInside(x, y, cards[j]));
                
                // dopo di che si puo uscire la ciclo for non serve concluderlo
                // quindi richiamo break
                break
            }

        }
        // dopo ogni click lancio la funzione che disegna le carte
        drawRepit();
    }
    
    // questa funzione viene richiamata quando si clicca su una carta da prendere
    // nel tavolo. Adesso devo fare le seguenti operazioni:
    // se l'indice della carta non è gia presente all'interno del array clickedCardIndex
    // la vado ad aggiungere
    // ma se è gia presente la devo togliere perchè se uno clicca una seconda volta 
    // su una carta se0lezionata la carta si deve deselezionare
    //
    function checkClickedCard(index, rect) {
        
        if (clickedCardIndex.indexOf(index) > -1) {
            clickedCardIndex.splice(clickedCardIndex.indexOf(index), 1);
            rectToDraw = [];
            clickedCardIndex = [];

        } else {
            // per selezionare in modo corretto devo fare due controlli:
            // 1) che la carta sia selezionabile cioè sia fra quelle prendibili
            //      questo controllo va fatto prima della aggiunta della carta
            //      nell arrray
            // 2) devo controllare che la selezione completi la lista delle carte
            //      della presa per poi eseguire la presa. questo controllo va fatto
            //      dopo la presa, la carta viene selezionata, se completa la 
            //      prese, bisogna eseguire la presa
           
            // definisco l'indice della carta che deve prendere
            let prese = checkTrick(mainCard, cards);
            if ( isIndexInside(index, prese) ) {
                clickedCardIndex.push(index);
                rectToDraw.push(rect);
                // dopo di questo controllo va verificato se con l'ultima presa
                // si è raggiunto il numero di carte massimo prendibili, se si
                // si deve chiamare la funzione prendi carte
                // per parlo richiamiamo la funzione isTakeFull() che restituisce
                // vero o falso
                //
                // anche questo funzione adesso possiamo lanciare la funzione
                // PRENDI CARTE, finalmente :)
                if ( isTakeFull(clickedCardIndex, prese) ) {
                    doTakeCards();
                }
            }
        }

    }

    // funzione che prende le carte....
    /**
     * Questa funzione deve prendere le carte e realizzare l'animazione che mostra
     * la prese delle carte, dopo deve salvare la presa nel giocatore
     *
     *
     */
    function doTakeCards () {
        console.log('presa delle carte');
        const fpoint = takeCardData.players[0].position;
        // creo un arrei con tette le info delle carte da spostare
        let cardsToMove = [];
        let takeCardToMove; // carta che prende da muovere
        // elemento array: {
        //  index: indice della carta da spostare
        //  dx:
        //  dy:
        //  delta:
        //  directionX:
        //  directionY:
        //  ys:
        //  xs:
        // }
        
        let pixs = 300;
        let lst = Date.now();
        let step = pixs / 60;

        clickedCardIndex.forEach(index => {
            let dx = cards[index].x - fpoint.x;     
            let dy = cards[index].y - fpoint.y; 
            let delta = Math.abs(dx / dy); 
            let directionX = dx > 0 ? -1 : 1;
            let directionY = dy > 0 ? -1 : 1;
            let ys = step * directionY;
            let xs = step * delta * directionX;
            cardsToMove.push({
                index: index,
                ys: ys,
                xs: xs
            });
        }); 
        takeCardToMove = {
            ys: step * (mainCard.y - fpoint.y) > 0 ? -1 : 1,
            xs: step * Math.abs((mainCard.x - fpoint.x) / 
                    (mainCard.y - fpoint.y)) * 
                    (mainCard.x - fpoint.x) > 0 ? -1 : 1
        };

        // funzione che eseguen il loop di aggiornamanto delle carte
        function updatePosition() {
            let dif = Date.now() - lst;
            lst = Date.now();
            step = pixs * dif / 1000;
            cardsToMove.forEach(el => {
                cards[el.index].x += el.xs * step;
                cards[el.index].y += el.ys * step;
            });
            mainCard.x += takeCardToMove.xs * step;
            mainCard.y += takeCardToMove.ys * step;
            let mov = window.requestAnimationFrame(updatePosition);

            if ( cards[cardsToMove[0].index].y > fpoint.y ) {
                window.cancelAnimationFrame(mov);
                rectToDraw = [];
                let takenToGive = {
                    takenCard: null,
                    takedCards: []
                };
                clickedCardIndex.forEach(index => {
                        cards[index].state = 'taked';
                    });
                takenToGive.takedCards = cards.filter(el =>{
                    return el.state == 'taked'
                });
                table.cards = table.cards.filter(el => {
                    return el.state == 'table'
                });
                takenToGive.takenCard = table.cardTakePosition.splice(0, 1)[0];

                // passo la presa al giocatore
                player.taken.push(takenToGive);
                console.log(player);
            }
        }

        // lancio del loop del movimento delle carte
        updatePosition();
    }

    
    // funzione che controlla se l'insieme delle carte solezionate contenute nel
    // array clickedCardIndex è sufficente a eseguire la presa questa funzione 
    // restituisce vero o falso
    function isTakeFull(clickedCardIndex, prese) {
        let result = false;
        prese.forEach(presa => {
            let target = presa.length;
            let base = 0;
            presa.forEach( preso => {
                clickedCardIndex.forEach(clikedIndex => {
                    if ( preso == clikedIndex ) {
                        base += 1;
                    }
                });
                if ( target == base ) {
                    result = true;
                }
            } );
        });
        return result
    }

    // function check is a given index is inside of an arrey of arrey
    function isIndexInside(index, arr) {
        let result = false;
        arr.forEach(inArr => {
            inArr.forEach(target => {
                if ( index == target ) {
                    result = true;
                } 
            });
        });
        return result
    }

    // function to check if cllick position is inside a card in the play area
    function isInside(x, y, card) {
        let w = card.image.width;
        let h = card.image.height;
        let cx = card.x;
        let cy = card.y;

        if ( x > cx && x < ( cx + w ) && y > cy && y < ( cy + h ) 
                && card.state == 'table') {
            return {w: w, h: h, cx: cx, cy: cy}
        } else {
            return false
        }
    }

    // function to draw an hightlight rect arond clicked card
    function drawRectCard (rect) {
        let offset = 3;
        let color = '#f54263';
        let w = rect.w;
        let h = rect.h;
        let cx = rect.cx - offset;
        let cy = rect.cy - offset;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(cx, cy, w, h);
        ctx.closePath();

    }
    
    // function that iterate all rectToDraw and if there are rect to draw loop
    // drawing with request animation frame
    // this function is drigger from the click over a card
    function drawRepit() {
        if ( rectToDraw.length > 0 ) {
            for ( let z = 0; z < rectToDraw.length; z++ ) {
                drawRectCard(rectToDraw[z]);
            }

            window.requestAnimationFrame(drawRepit);
        }
    }

}

// this file is for moving the card if release out of the area

function drawingCardBack(card, player, x0, y0) {
    
    let dx = Math.floor(card.x - x0);
    let dy = Math.floor(card.y - y0);
    let delta = Math.abs(dx / dy);    
    let state = true;

    // definizione della direzione
    // var elvisLives = Math.PI > 4 ? "Yep" : "Nope";
    let directionX = dx > 0 ? -1 : 1;
    let directionY = dy > 0 ? -1 : 1;

    // definizione dello spostamento in base alla direzione, la base è 3
    let ys = 20 * directionY;
    let xs = 20 * delta * directionX;
    let mov;

    function updatePosition () {
        if (state) {
            card.x += xs;
            card.y += ys;
            mov = window.requestAnimationFrame(updatePosition);
        }
        if ( card.y >= y0 ) {
            state = false;
            card.x = x0;
            card.y = y0;
            window.cancelAnimationFrame(mov);
            card.state = 'base';
            player.orderCard();
        }
    }

    if ( state ) {
        mov = window.requestAnimationFrame(updatePosition);
    } 

}

//function to draw the rectangle where to put the card when we whant to
//make a trick
function drawTakeRect(ctx, rect) {
    ctx.beginPath();
    ctx.strokeStyle = '#6d9ce8';
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.closePath();
}

// function to draw the takeRect hightlight when we move over the card
function drawHTakeRect(ctx, rect) {
    ctx.beginPath();
    ctx.strokeStyle = '#082452';
    ctx.lineWidth = 5;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.closePath();
}

// function to draw an hightlight rect to indicate the play area when you move
// a card aver
function drawHighlightPlayRect(ctx, HLRECT) {
    ctx.beginPath();
    ctx.strokeStyle = '#388c42';
    ctx.lineWidth = 5;
    ctx.strokeRect(HLRECT.x, HLRECT.y, HLRECT.w, HLRECT.h);
    ctx.closePath();
}

// drawing a play area rectangle that indicate where is possible to relase the card
function drawPlayRect(ctx, HLRECT) {
        ctx.beginPath();
        ctx.strokeStyle = '#1c6625';
        ctx.lineWidth = 2;
        ctx.strokeRect(HLRECT.x, HLRECT.y, HLRECT.w, HLRECT.h);
        ctx.closePath();

}

// function to draw the players's number
function drawPlayersNumber(ctx, PLAYER_POSITIONS) {
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('1', PLAYER_POSITIONS.P1.x, PLAYER_POSITIONS.P1.y);
    ctx.fillText('2', PLAYER_POSITIONS.P2.x, PLAYER_POSITIONS.P2.y);
    ctx.fillText('3', PLAYER_POSITIONS.P3.x, PLAYER_POSITIONS.P3.y);
    ctx.fillText('4', PLAYER_POSITIONS.P4.x, PLAYER_POSITIONS.P4.y);
}

class Card {
    /**
     * @param {int} value
     * @param {string} suit
     *
     */
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
        this.x = 0;
        this.y = 0;
        this.image = null;
        this.state = 'base';
    }
}

/**
 * Desk class
 * this class nedd the Card class to be imported
 *
 */

class Deck {
    /**
     * @param {int array} values
     * @param {string array} suits
     *
     */
    constructor (values, suits, cb) {
        this.values = values;
        this.suits = suits;
        this.cards = [];
        this.callBackLoadingImage = cb;

        // creation of the cards imeges
        let jarOfPromise = [];
        this.values.forEach(value => {
            this.suits.forEach(suit => {
                this.cards.push(new Card(value, suit));
                jarOfPromise.push(
                    new Promise(resolve => {
                        let l = this.cards.length;
                        this.cards[l-1].image = new Image();
                        this.cards[l-1].image.src = `./img/${value}${suit[0]}.jpg`;
                        this.cards[l-1].image.addEventListener('load', ()=> {
                            resolve(true);
                        });
                    })
                );
            });
        });

        // at the end of the images loading weiting
        Promise.all(jarOfPromise).then( _ => {
            this.endLoading();
        });
    }
    
    // function called when all the images are loaded
    endLoading() {
        // shuffle of the cards
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let t = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = t;
        }
        console.log('end loading');
        this.callBackLoadingImage();
    }
}

// setup socket.io
const socket = io('http://localhost:3000');
socket.on('init', handleInit);

function handleInit(msg) {
    console.log(msg);
}


console.log('start');
const APP = (function(){
    // definition of the canvas geometry
    const W = 600; // width of the canvas
    const H = 600; // height of the casnvas
    const PADDING_PLAYER = Math.floor(W / 30);
    const PLAYER_POSITIONS = {
        P1: {x: W / 2, y: H - PADDING_PLAYER},
        P2: {x: W - PADDING_PLAYER, y: H / 2},
        P3: {x: W / 2, y: 0 + PADDING_PLAYER},
        P4: {x: 0 + PADDING_PLAYER, y: H / 2},
    };
    const IMG_H = H / 5;
    const IMG_W = IMG_H / 2.5;
    const TACKERECT = {
        x: PADDING_PLAYER * 2,
        y: H - PADDING_PLAYER * 4 - IMG_H * 2,
        w: IMG_W * 1.5,
        h: IMG_H * 1.3
    };
    const PLAYERS_NAME = ['Eugenio', 'Gian', 'Nazza', 'Bamby'];
    const NUMBER_OF_PLAYER = 4;
    const canvas = document.querySelector('.canvas');
    canvas.height = H;
    canvas.width = W;
    const ctx = canvas.getContext('2d');
    const HLRECT = {
        x: W * 0.2,
        y: H * 0.2,
        w: W * 0.6,
        h: H * 0.5
    };
    const output = document.querySelector('.output');
    
    // game LOGIC parameters
    const table = new Table();
    // only for debug
    window.table = table;
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const suits = ['BASTONI', 'COPPE', 'SPADE', 'DENARI'];
    let deck = null;
    const players = [];
    let hightlightRect = false;
    let hightlightRectTake = false;

    // function that draw all the contest in the canvas
    const draw = () => {
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#32a852';
        ctx.fill();
        ctx.closePath();
        
        // drawing players number
        drawPlayersNumber(ctx, PLAYER_POSITIONS);

        // if the player move a card over the are for release the cartd
        // area is hightlighted with strong rectangle
        if (hightlightRect) {
            drawHighlightPlayRect(ctx, HLRECT);
        }

        // drawing a thin rectangle indicated card release area
        drawPlayRect(ctx, HLRECT);
        
        // drawing table's cards
        table.cards.forEach(card =>{
            ctx.drawImage(card.image, card.x, card.y, IMG_W, IMG_H);
        });

        // drawing table's cards take position
        table.cardTakePosition.forEach(card =>{
            ctx.drawImage(card.image, card.x, card.y, IMG_W, IMG_H);
        });

        // drawing hightlightAreaTake
        if( hightlightRectTake ) { 
            drawHTakeRect(ctx, TACKERECT);
        }
        // drawing tacke rect
        drawTakeRect(ctx, TACKERECT);       

        // drawing player's cards
        posingCards(players[0]);
        players[0].cards.forEach(card =>{
            ctx.drawImage(card.image, card.x, card.y, IMG_W, IMG_H);
        });

        window.requestAnimationFrame(draw);
    };

    // method to pass like callback
    // this method start the game it is lounch from the promise of images loading
    //
    //
    const callBackLoadingImage = () => {
        console.log('callBackLoadingImage on');
        createPlayers();
        canvas.addEventListener('mousedown', mouseDownHandler);

        window.requestAnimationFrame(draw);
    };
// ---------------------------------------------------------------------------//
    // event endler ------------------
    const mouseDownHandler = (ev) => {
        let cRect = canvas.getBoundingClientRect();
        let x = ev.clientX - cRect.left;
        let y = ev.clientY - cRect.top;

        players[0].cards.forEach((card) => {
            let delta = clickIsInside(x, y, card);
            if (delta) {
                card.state = 'drag';
                cardDrag = card;
                deltaCardDrag = delta;
                canvas.addEventListener('mousemove', cardDragHandler);
                canvas.addEventListener('mouseup', mouseUpHandler);
            }
        });
    };

    // purtroppo ho dovuto creare queste due variabili "globali" percke altrimenti
    // non so come fare vorrei trovare un modo per gestire meglio questa parte 
    let cardDrag = null;
    let deltaCardDrag = null;

    // function that move the clicked card.
    const cardDragHandler = (ev) => {
        let cRect = canvas.getBoundingClientRect();
        let x = ev.clientX - cRect.left - deltaCardDrag.dx;
        let y = ev.clientY - cRect.top - deltaCardDrag.dy;
        cardDrag.x = x;
        cardDrag.y = y;
        hightlightArea(ev);
        hightlightAreaTake(ev);
    };

    // function to stop drag the card when mouse button is release
    const mouseUpHandler = () => {
        canvas.removeEventListener('mousemove', cardDragHandler);
        let prese = checkTrick(cardDrag, table.cards);
        let isOn = isCardAlredyOnTheTable(cardDrag, table.cards, prese); 

        // gestione del caso in qui la carta viene rilasciata nella posizione take
        if ( cardDrag.x > TACKERECT.x && (cardDrag.x + IMG_W ) < (TACKERECT.x + TACKERECT.w ) &&
                cardDrag.y > TACKERECT.y && (cardDrag.y + IMG_H ) < (TACKERECT.y + TACKERECT.h) &&
                prese.length > 0) { 
                // check alse is in the play are there are 
                // possible taken card only in that case the card is release on 
                // the tackerect

            let posToRemove = players[0].cards.indexOf(cardDrag);
            cardDrag.state = 'take';
            table.cardTakePosition.push(players[0].cards.splice(posToRemove, 1)[0]);
            canvas.removeEventListener('mouseup', mouseUpHandler);
            canvas.removeEventListener('mousedown', mouseDownHandler);
            posToRemove = null;
            cardDrag = null;
            deltaCardDrag = null;
            hightlightRect = false;
            hightlightRectTake = false;

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
            };

            takeCard(takeCardData);
            canvas.addEventListener('mousedown', mouseDownHandler);

            return
        }

        // se la carta è fuori dal quadrato giusto deve tornare alla 
        // e anche se una carta con stesso valore è già presente nel tavolo
        // base senza essere rimossa dal giocatore
        else if ((cardDrag.x > HLRECT.x + HLRECT.w || cardDrag.x < HLRECT.x ||
            cardDrag.y < HLRECT.y || cardDrag.y + IMG_W > HLRECT.x + HLRECT.h) || isOn)  {
            drawingCardBack(cardDrag, players[0], PLAYER_POSITIONS.P1.x, PLAYER_POSITIONS.P1.y);
            canvas.removeEventListener('mouseup', mouseUpHandler);
            return
        } else if ( isOn || cardDrag.value == 1 ){
            drawingCardBack(cardDrag, players[0], PLAYER_POSITIONS.P1.x, PLAYER_POSITIONS.P1.y);
            canvas.removeEventListener('mouseup', mouseUpHandler);
            return
        }

        let posToRemove = players[0].cards.indexOf(cardDrag);
        // table recive the removing card from the player
        table.reciveCard(players[0].cards.splice(posToRemove, 1)[0]);
        players[0].storePlayedCard(cardDrag);
        canvas.removeEventListener('mouseup', mouseUpHandler);
        cardDrag.state = 'table';
        // update output information
        output.innerHTML += `Giocatore 1: ${cardDrag.value} - ${cardDrag.suit} <br>`;
        output.innerHTML += `Rimangono: ${players[0].cards.length} carte <br> ... <br>`;

        posToRemove = null;
        cardDrag = null;
        deltaCardDrag = null;
        hightlightRect = false;
        hightlightRectTake = false;
    };


    // questa funzione controlla se la carta che che stiamo 
    // per rilasciare ne ha una uguale nel tavolo oppure se
    // esiste una presa possibile nel tavo
    // in entrambi i casi la carta non può essere 
    // rilasaciata nel tavolo la funzione restituisce true o false
    function isCardAlredyOnTheTable(card, arrTable, prese) {
        let result = false;
        arrTable.forEach(el => {
            if ( el.value == card.value ) {
                result = true;
            }  
        });

        prese.forEach(presa => {
            let tot = 0;
            presa.forEach(el => {
                tot += arrTable[el].value;
            });
            if ( tot == card.value ) {
                result = true;
            }
        });

        return result
    }

    // function to hightlight are where to release the card
    const hightlightArea = (ev) => {
        let pos = getMousePos(ev, canvas);
        if (pos.x > (HLRECT.x) && pos.x < (HLRECT.x + HLRECT.w) 
            && pos.y > (HLRECT.y) && pos.y < (HLRECT.y + HLRECT.h)) {
            hightlightRect = true;
        }else {hightlightRect = false;}
    };
    // funzione per evidenziare rettangolo di deposito
    // quando la carta è sopra
    const hightlightAreaTake = (ev) => {
        let pos = getMousePos(ev, canvas);
        if (pos.x > (TACKERECT.x) && pos.x < (TACKERECT.x + TACKERECT.w) 
            && pos.y > (TACKERECT.y) && pos.y < (TACKERECT.y + TACKERECT.h)) {
            hightlightRectTake = true;
        }else {hightlightRectTake = false;}
    };

    // utility function that return the mouse position
    const getMousePos = (ev, canvas) => {
        let cRect = canvas.getBoundingClientRect();
        let x = ev.clientX - cRect.left - deltaCardDrag.dx;
        let y = ev.clientY - cRect.top - deltaCardDrag.dy;
        return {x: x, y: y}
    };
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
    };
    
    // funzione da sistemare per adattarla a seconda della posizione del player
    // function that set the card.x posizione of the player in oder to be
    // drawed properly
    const posingCards = (player) => {
        if (player.cards.length === 0) {return}
        let y1 = H - PADDING_PLAYER * 2 - IMG_H;
        let step = (W / (player.cards.length + 2));
        let x1 = (W - step * player.cards.length) / 2;

        for (let i = 0; i < player.cards.length; i++) {
            if (player.cards[i].state == 'base') {
                player.cards[i].x = x1;
                player.cards[i].y = y1;
                x1 += step;
            }
        }
    };

    // create the player given them the cards from a shuffle deck\
    const createPlayers = () => {
        let cardsForPlayer = values.length;
        let start = 0;
        for (let i = 0; i < NUMBER_OF_PLAYER; i++) {
            players.push(new Player(PLAYERS_NAME[i], PLAYER_POSITIONS.P1));
            for (let j = 0; j < cardsForPlayer; j++) {
                players[i].receiveCard(deck.cards[j+start]);
                players[i].orderCard();
            }
            start += cardsForPlayer - 1;
        }
        posingCards(players[0]);
        // only for debug
        window.player = players[0];
    };
    
    // create the deck of cards and start the game loop 
    // with callBackLoadingImage function
    const createDeck = () => {
        deck = new Deck(values, suits, callBackLoadingImage);
    };

    // The function createDeck is call and when all che cards are loaded
    // The callBackLoadingImage function is colled.
    // The colled of the callBackLoadingImage function start the game loop
    //
    createDeck();
    // return only for debug
    return { deck, players, table}

})();
