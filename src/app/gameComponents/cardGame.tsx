import Card from "./card";
import Deck from "./deck";
import Player from "./player";

export default class cardGame {
    private deck = new Deck();
    private players: Player[] = [];
    private playedCards: Card[] = [];
    private thrownAwayCards: Card[] = [];
    private currentPlayer: number = 0;
    private lastClaim: [string, boolean, number] = ["", true, 0];

    constructor(players: string[]) {
        this.players = players.map((player, index) => new Player(player, index.toString()));
        
        for (let i = 0; i < 5; i++) {
            this.players.forEach(player => {
                player.addCard(this.deck.pickup());
            })
        }
        
        this.currentPlayer = Math.floor(Math.random() * this.players.length);
    }


    private playCard(player: Player, cards: Card[]) {
        this.playedCards.push(...cards);
        player.removeCards(cards);

        while ((this.deck.size > 0) && (player.getCards().length < 5)) {
            player.addCard(this.deck.pickup());
        }
    }

    public throwAwayPlayedCards() {
        this.thrownAwayCards = this.thrownAwayCards.concat(this.playedCards);
        this.playedCards = [];
    }

    private pickupPlayedCards(player: number) {
        this.players[player].addCards(this.playedCards);
        this.playedCards = [];
    
    }

    private claimCards(player: number, cards: Card[], claimedRank: string): boolean {
        if (player === this.currentPlayer) {
            const matchCards = cards.filter(card => card.getRank() === claimedRank);
            this.lastClaim = [claimedRank, (matchCards.length === cards.length), player];
        }
        return false;
    }

    private getPlayers() {
        return this.players.map(player => ({
            name: player.name,
            count: player.getCards().length
        }))
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayer]
    }
    getGameState() {
        return {
            players: this.getPlayers(),
            currentPlayer:  this.getCurrentPlayer(),
            playedCards: this.playedCards.length,
            lastClaim: this.lastClaim[1],
            deckSize: this.deck.size,
            turn: this.currentPlayer,
            deck: this.deck,
        }
    }

    public keepTurn() {
        this.currentPlayer = (this.currentPlayer - 1 + this.players.length) % this.players.length;
    }

    public playTurn(playerIndex: number, cards: number[], claimedRank: string) {
        if (playerIndex !== this.currentPlayer) return false;

        const player = this.players[playerIndex];
        const playedCards = cards.map(index => player.getCards()[index])

        this.claimCards(playerIndex, playedCards, claimedRank);
        this.playCard(player, playedCards)

        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    }

    public callLie(playerIndex: number) {
        if (this.lastClaim[1]) {
            this.pickupPlayedCards(playerIndex)
            this.currentPlayer = (this.currentPlayer - 1 + this.players.length) % this.players.length;
            return false;
        }
        else {
            this.pickupPlayedCards(this.lastClaim[2])
        }
    }
}