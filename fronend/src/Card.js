export default class Card {
    /**
     * @param {int} value
     * @param {string} suit
     *
     */
    constructor(value, suit) {
        this.value = value
        this.suit = suit
        this.x = 0
        this.y = 0
        this.image = null
        this.state = 'base'
    }
}
