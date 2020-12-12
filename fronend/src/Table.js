export default class Table {
    constructor () {
        this.cards = []
        this.cardTakePosition = []
    }

    reciveCard (card) {
        this.cards.push(card)
    }
}
