export default class Player {
    constructor(name, position) {
        this.name = name
        this.position = position
        this.cards = [] // cards in hand 
        this.playedCards = [] // arrey of played cards
        this.taken = [] // arrey that store the tached card in form of [[takerCard][token cards]]
    }

    receiveCard (card) {
        this.cards.push(card)
    }

    orderCard () {
        this.cards.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 :0))
    }

    storePlayedCard (card) {
        let cardToStore = { value: card.value, suit: card.suit }
        this.playedCards.push(cardToStore)
    }
}
