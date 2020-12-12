// this file is for moving the card if release out of the area

export function drawingCardBack(card, player, x0, y0) {
    
    let dx = Math.floor(card.x - x0)
    let dy = Math.floor(card.y - y0)
    let delta = Math.abs(dx / dy)    
    let state = true

    // definizione della direzione
    // var elvisLives = Math.PI > 4 ? "Yep" : "Nope";
    let directionX = dx > 0 ? -1 : 1
    let directionY = dy > 0 ? -1 : 1

    // definizione dello spostamento in base alla direzione, la base è 3
    let ys = 20 * directionY
    let xs = 20 * delta * directionX
    let mov

    function updatePosition () {
        if (state) {
            card.x += xs
            card.y += ys
            mov = window.requestAnimationFrame(updatePosition)
        }
        if ( card.y >= y0 ) {
            state = false
            card.x = x0
            card.y = y0
            window.cancelAnimationFrame(mov)
            card.state = 'base'
            player.orderCard()
        }
    }

    if ( state ) {
        mov = window.requestAnimationFrame(updatePosition)
    } 

}

//function to draw the rectangle where to put the card when we whant to
//make a trick
export function drawTakeRect(ctx, rect) {
    ctx.beginPath()
    ctx.strokeStyle = '#6d9ce8'
    ctx.lineWidth = 2
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
    ctx.closePath()
}

// function to draw the takeRect hightlight when we move over the card
export function drawHTakeRect(ctx, rect) {
    ctx.beginPath()
    ctx.strokeStyle = '#082452'
    ctx.lineWidth = 5
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
    ctx.closePath()
}

// function to draw an hightlight rect to indicate the play area when you move
// a card aver
export function drawHighlightPlayRect(ctx, HLRECT) {
    ctx.beginPath()
    ctx.strokeStyle = '#388c42'
    ctx.lineWidth = 5
    ctx.strokeRect(HLRECT.x, HLRECT.y, HLRECT.w, HLRECT.h)
    ctx.closePath()
}

// drawing a play area rectangle that indicate where is possible to relase the card
export function drawPlayRect(ctx, HLRECT) {
        ctx.beginPath()
        ctx.strokeStyle = '#1c6625'
        ctx.lineWidth = 2
        ctx.strokeRect(HLRECT.x, HLRECT.y, HLRECT.w, HLRECT.h)
        ctx.closePath()

}

// function to draw the players's number
export function drawPlayersNumber(ctx, PLAYER_POSITIONS) {
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('1', PLAYER_POSITIONS.P1.x, PLAYER_POSITIONS.P1.y)
    ctx.fillText('2', PLAYER_POSITIONS.P2.x, PLAYER_POSITIONS.P2.y)
    ctx.fillText('3', PLAYER_POSITIONS.P3.x, PLAYER_POSITIONS.P3.y)
    ctx.fillText('4', PLAYER_POSITIONS.P4.x, PLAYER_POSITIONS.P4.y)
}

