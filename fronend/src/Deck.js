import Card from './Card.js'
/**
 * Desk class
 * this class nedd the Card class to be imported
 *
 */

export default class Deck {
    /**
     * @param {int array} values
     * @param {string array} suits
     *
     */
    constructor (values, suits, cb) {
        this.values = values
        this.suits = suits
        this.cards = []
        this.callBackLoadingImage = cb

        // creation of the cards imeges
        let jarOfPromise = []
        this.values.forEach(value => {
            this.suits.forEach(suit => {
                this.cards.push(new Card(value, suit))
                jarOfPromise.push(
                    new Promise(resolve => {
                        let l = this.cards.length
                        this.cards[l-1].image = new Image()
                        this.cards[l-1].image.src = `./img/${value}${suit[0]}.jpg`
                        this.cards[l-1].image.addEventListener('load', ()=> {
                            resolve(true)
                        })
                    })
                )
            })
        })

        // at the end of the images loading weiting
        Promise.all(jarOfPromise).then( _ => {
            this.endLoading()
        })
    }
    
    // function called when all the images are loaded
    endLoading() {
        // shuffle of the cards
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let t = this.cards[i]
            this.cards[i] = this.cards[j]
            this.cards[j] = t
        }
        console.log('end loading')
        this.callBackLoadingImage()
    }
}
