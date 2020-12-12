# Analisi delle possibili prese

## Le prese possono essere come le combinazioni seguenti

  - Asso -> prende tutto
  - 2 -> 2
  - 3 -> 3
  - 4 -> 4
  - 5 -> 5, (3 + 2)
  - 6 -> 6, (4 + 2)
  - 7 -> 7, (5 + 2)
  - 8 -> 8, (6 + 2), (5 + 3)
  - 9 -> 9, (7 + 2), (6 + 3), (5 + 4), (3 + 2 + 4)
  - 10 -> 10, (8 + 2), (7 + 3), (6 + 4), (5 + 3 + 2)
  - Fante -> Fante
  - Cavallo -> Cavallo
  - Rè -> Rè

Da questa informazione possimo semplificare il problema perchè si puo ridurre il
campo di ricerca. Possiamo dire che:

  * se la carta è fra le seguenti: 2, 3, 4, Fante, Cavallo e Rè
  possimo cercare una corrispondenza 1 : 1 senza cercare tra le somme
  * se la carta e fra le seguenti: 5, 6, 7 e 8
  possiamo cercare una corrispondenza 1:1 e solo la somma fra 2 carte (tutte le 
  possibili combinazioni)
  * se la carta è 9 o 10
  dobbiamo cercare fra la corrispondenza 1:1 e la somma fra 2 e la somma fra 3 carte
  (tutte le possibili combinazioni)
  * il caso dell' Asso è un caso particolare perchè prende tutte le carte del tavolo
  possiamo chiamarlo 'caso 0'

Quindi possiamo immaginare di creare una funzione che riceva come argomento il numero
massimo di "numeri sommebili" chiamiamo questo paramentro cardN

```javascript
function cercaPrese (cardN) {
    ......
}
```

# Grstione informazioni scambiate via socket.io

## Definizione del processo della gestione della partita

Il primo punto da definire è come creare il tavolo e la posizione dei giocatori

schema semplice:
-> Tavolo 1
    + giocatore 1
    + giocatore 2
    + giocatore 3
    + giocatore 4
-> Tavolo 2
    .... eccetera

