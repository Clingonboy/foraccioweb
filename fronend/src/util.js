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

export default function checkTrick (card, arr) {
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

    let prese = []
    // let arrMax = 12 // max element in arr numero massimo di carte sul tavolo
    let n = arr.length
    let cardN = 1 // max combination number
    if ( card.value > 4 && card.value < 9 ) { cardN = 2 }
    if ( card.value == 9 || card.value == 10 ) { cardN = 3 }
    if ( card.value == 1 ) { cardN = 0 }

    /*
     * caso piu semplice, cardN = 0 significa che la carta è un asso
     * prende tutte le carte sul tavolo quindi restituiamo un arrei con
     * un solo elemento, un arrei con tutti gli indici delle carte da 0 a n-1
     */
    if ( cardN == 0 ) {
        prese[0] = []
        for ( let x = 0; x < n; x++ ) {
            prese[0].push(x)
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
                prese[0] = []
                prese[0].push(x)
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
                prese[0] = []
                prese[0].push(x)
            }
        }
        // adesso viene la parte difficile dobbiamo cercare tra tutte le possibili
        // somme fra tutti gli elementi dell'array di carte
        // se le carte sul tavolo sono solo due il problema si semplifica, basta
        // controllare la somma delle due
        if ( n == 2 ) {
            if ( (arr[0].value + arr[1].value) == card.value ) {
                prese.push([0, 1]) // soluzione poco elegante ma che funziona
            }
        }
        // per tutti i casi con n > 2 bisogna iterare fra tutte le combinazioni
        if ( n > 2 ) {
            for ( let x = 0; x < n; x++ ) {
                for ( let j = 1; j < ( n - x ); j++ ) {
                    if ( ( arr[x].value + arr[x + j].value ) == card.value ) {
                        prese.push([])
                        prese[prese.length - 1].push(x)
                        prese[prese.length - 1].push(x+j)
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
                prese[0] = []
                prese[0].push(x)
            }
        }
        // anche in questo caso dobbiamo verificare il caso in cui ci siano due
        // carte sul tavolo
        if ( n == 2 ) {
            if ( (arr[0].value + arr[1].value) == card.value ) {
                prese.push([0, 1]) // soluzione poco elegante ma che funziona
            }
        }
        
        // bisogna come nel caso precedente cercare prima le possibili somme di 
        // due numeri perchè anche questo caso può essere presente insieme al 
        // caso di somma di tre carte.
        if ( n > 2 ) {
            for ( let x = 0; x < n; x++ ) {
                for ( let j = 1; j < ( n - x ); j++ ) {
                    if ( ( arr[x].value + arr[x + j].value ) == card.value ) {
                        prese.push([])
                        prese[prese.length - 1].push(x)
                        prese[prese.length - 1].push(x+j)
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
                            prese.push([])
                            prese[prese.length - 1].push(x)
                            prese[prese.length - 1].push(x+j)
                            prese[prese.length - 1].push(x+z)
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



