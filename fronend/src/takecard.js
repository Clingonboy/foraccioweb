import checkTrick from './util.js'
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


export default function takeCard(takeCardData) {
    takeCardData.canvas.addEventListener('click', clickCard)
    const cards = takeCardData.table.cards
    const ctx = takeCardData.ctx
    const player = takeCardData.players[0]
    let mainCard = takeCardData.table.cardTakePosition[0]
    let clickedCardIndex = []
    let rectToDraw = []


    function clickCard(ev) {
        const cRect = takeCardData.canvas.getBoundingClientRect()
        let x = ev.clientX - cRect.left
        let y = ev.clientY - cRect.top
        
        for ( let j = 0; j < cards.length; j++ ) {
            if ( isInside(x, y, cards[j]) ) {
                // richiamo della funzione che controlla lacarta
                // questa funzione riceve come parametro l'indice della carta
                // nell'array di carte e un oggetto rettangolo che ne definisce
                // la posizione nel canvas

                checkClickedCard(j, isInside(x, y, cards[j]))
                
                // dopo di che si puo uscire la ciclo for non serve concluderlo
                // quindi richiamo break
                break
            }

        }
        // dopo ogni click lancio la funzione che disegna le carte
        drawRepit()
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
            clickedCardIndex.splice(clickedCardIndex.indexOf(index), 1)
            rectToDraw = []
            clickedCardIndex = []

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
            let prese = checkTrick(mainCard, cards)
            if ( isIndexInside(index, prese) ) {
                clickedCardIndex.push(index)
                rectToDraw.push(rect)
                // dopo di questo controllo va verificato se con l'ultima presa
                // si è raggiunto il numero di carte massimo prendibili, se si
                // si deve chiamare la funzione prendi carte
                // per parlo richiamiamo la funzione isTakeFull() che restituisce
                // vero o falso
                //
                // anche questo funzione adesso possiamo lanciare la funzione
                // PRENDI CARTE, finalmente :)
                if ( isTakeFull(clickedCardIndex, prese) ) {
                    doTakeCards()
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
        console.log('presa delle carte')
        const fpoint = takeCardData.players[0].position
        // creo un arrei con tette le info delle carte da spostare
        let cardsToMove = []
        let takeCardToMove // carta che prende da muovere
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
        
        let pixs = 300
        let lst = Date.now()
        let step = pixs / 60

        clickedCardIndex.forEach(index => {
            let dx = cards[index].x - fpoint.x     
            let dy = cards[index].y - fpoint.y 
            let delta = Math.abs(dx / dy) 
            let directionX = dx > 0 ? -1 : 1
            let directionY = dy > 0 ? -1 : 1
            let ys = step * directionY
            let xs = step * delta * directionX
            cardsToMove.push({
                index: index,
                ys: ys,
                xs: xs
            })
        }) 
        takeCardToMove = {
            ys: step * (mainCard.y - fpoint.y) > 0 ? -1 : 1,
            xs: step * Math.abs((mainCard.x - fpoint.x) / 
                    (mainCard.y - fpoint.y)) * 
                    (mainCard.x - fpoint.x) > 0 ? -1 : 1
        }

        // funzione che eseguen il loop di aggiornamanto delle carte
        function updatePosition() {
            let dif = Date.now() - lst
            lst = Date.now()
            step = pixs * dif / 1000
            cardsToMove.forEach(el => {
                cards[el.index].x += el.xs * step
                cards[el.index].y += el.ys * step
            })
            mainCard.x += takeCardToMove.xs * step
            mainCard.y += takeCardToMove.ys * step
            let mov = window.requestAnimationFrame(updatePosition)

            if ( cards[cardsToMove[0].index].y > fpoint.y ) {
                window.cancelAnimationFrame(mov)
                rectToDraw = []
                let takenToGive = {
                    takenCard: null,
                    takedCards: []
                }
                clickedCardIndex.forEach(index => {
                        cards[index].state = 'taked'
                    })
                takenToGive.takedCards = cards.filter(el =>{
                    return el.state == 'taked'
                })
                table.cards = table.cards.filter(el => {
                    return el.state == 'table'
                })
                takenToGive.takenCard = table.cardTakePosition.splice(0, 1)[0]

                // passo la presa al giocatore
                player.taken.push(takenToGive)
                console.log(player)
            }
        }

        // lancio del loop del movimento delle carte
        updatePosition()
    }

    
    // funzione che controlla se l'insieme delle carte solezionate contenute nel
    // array clickedCardIndex è sufficente a eseguire la presa questa funzione 
    // restituisce vero o falso
    function isTakeFull(clickedCardIndex, prese) {
        let result = false
        prese.forEach(presa => {
            let target = presa.length
            let base = 0
            presa.forEach( preso => {
                clickedCardIndex.forEach(clikedIndex => {
                    if ( preso == clikedIndex ) {
                        base += 1
                    }
                })
                if ( target == base ) {
                    result = true
                }
            } )
        })
        return result
    }

    // function check is a given index is inside of an arrey of arrey
    function isIndexInside(index, arr) {
        let result = false
        arr.forEach(inArr => {
            inArr.forEach(target => {
                if ( index == target ) {
                    result = true
                } 
            })
        })
        return result
    }

    // function to check if cllick position is inside a card in the play area
    function isInside(x, y, card) {
        let w = card.image.width
        let h = card.image.height
        let cx = card.x
        let cy = card.y

        if ( x > cx && x < ( cx + w ) && y > cy && y < ( cy + h ) 
                && card.state == 'table') {
            return {w: w, h: h, cx: cx, cy: cy}
        } else {
            return false
        }
    }

    // function to draw an hightlight rect arond clicked card
    function drawRectCard (rect) {
        let offset = 3
        let color = '#f54263'
        let w = rect.w
        let h = rect.h
        let cx = rect.cx - offset
        let cy = rect.cy - offset

        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.strokeRect(cx, cy, w, h)
        ctx.closePath()

    }
    
    // function that iterate all rectToDraw and if there are rect to draw loop
    // drawing with request animation frame
    // this function is drigger from the click over a card
    function drawRepit() {
        if ( rectToDraw.length > 0 ) {
            for ( let z = 0; z < rectToDraw.length; z++ ) {
                drawRectCard(rectToDraw[z])
            }

            window.requestAnimationFrame(drawRepit)
        }
    }

}
