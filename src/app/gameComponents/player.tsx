import Card from "./card";

export default class Player {
    private cards: Card[];
    public name: string;
    public id: string;

    constructor(name: string, id: string) {
        this.cards = [];
        this.name = name;        
        this.id = id;
    }

    public addCard(card: Card) {
        this.cards.push(card);
    }
    public removeCardbyIndex(card: number) {
        this.cards.splice(card, 1);
    }
    public removeCards(cards: Card[]){
        this.cards = this.cards.filter(card => 
            !cards.some(cardToRemove => cardToRemove === card)
        )
    }

    public getCards() {
        return this.cards;
    }

    public addCards(cards: Card[]) {
        this.cards = this.cards.concat(cards);
    }    

}