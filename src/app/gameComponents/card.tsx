
class Card {
    private suit: string;
    private rank: string;
    private filename: string;
    name: string;

    constructor(suit: string, rank: string, filename: string) {
        this.suit = suit;
        this.rank = rank;
        this.filename = filename;
        this.name = `${rank} of ${suit}`
    }

    getImage() {
        return this.filename;
    }
    getRank() {
        return this.rank;
    }

}

export default Card;