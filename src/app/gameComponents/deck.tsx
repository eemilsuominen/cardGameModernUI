import Card from "./card"

class Deck {
    cards: Card[]
    size: number

    constructor() {
        const suits = ["hearts", "diamonds", "clubs", "spades"]
        const ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"]

        this.cards = [];
        suits.forEach(suit => {
            ranks.forEach(rank => {
                const filename = `/cards/nicubunu_Ornamental_deck_${rank}_of_${suit}.svg`;
                this.cards.push(new Card(suit, rank, filename))
                   
            })
        
        })

        this.shuffle(this.cards) 
        this.size = this.cards.length       

    }

    pickup() {
        const size = this.cards.length;
        const card = this.cards[size - 1];
        this.cards.pop();
        this.size = this.cards.length
        return card;
    }

    private shuffle = (deck: Card[]) => {
        for (let size = deck.length - 1; size > 0; size--) {
            const index = Math.floor(Math.random() * deck.length)
            const x = deck[size]
            deck[size] = deck[index]
            deck[index] = x
        }

        const y = deck[0]
        const z = Math.floor(Math.random() * 51)
        deck[0] = deck[z];
        deck[z] = y
    
        this.cards = deck;
    }

}

export default Deck