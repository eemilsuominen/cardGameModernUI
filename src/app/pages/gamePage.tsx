"use client"
import Player from "../gameComponents/player";
import cardGame from "../gameComponents/cardGame";

import GameBoardCenter from "./uiComponents/gameBoardCenter";
import ClaimPopUp from "./uiComponents/claimPopUp";
import PickupDeck from "./uiComponents/pickupDeck";
import GamePlayers from "./uiComponents/gamePlayers";

import { useState, useEffect } from 'react';
import PlayerCards from "./uiComponents/playerCards";

export default function GamePage({usernames, setCreateLobby}: {usernames: string[], setCreateLobby:() => void}) {

  const players = usernames.filter(player => player !== "");

  const [claimedRank, setClaimedRank] = useState<string>("");
  const [chosenCardIndexes, setChosenCardIndexes] = useState<number[]>([]);

  const [gameStarted, setGameStarted] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const [playedCardCount, setPlayedCardCount] = useState<number>(0);
  const [totalPlayed, setTotalPlayed]  = useState<number>(0);
  const [askForDiscard, setAskForDiscard] = useState(false)

  const [isTurn, setIsTurn] = useState(false)

  const [currentPlayer, setCurrentPlayer] = useState<Player>(new Player("", ""))
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [callLie, setCallLie] = useState(false);
  const [lieCaller, setLieCaller] = useState("");
  const [cardPicker, setCardPicker] = useState("");
  const [lastClaim, setLastClaim] = useState(false);

  const [gameOver, setGameOver] = useState(false)
  const [gameWinner, setGameWinner] = useState("");
  
  const [deckSize,setDeckSize] = useState<number>(0)
  
  const [gameInstance] = useState(new cardGame(players));
  const [allPlayers, setAllPlayers] = useState<{ name: string; count: number }[]>([]);

  
  const handleGameStart = () => {
    setGameStarted(true);
    const gameState = gameInstance.getGameState();
    setCurrentPlayerIndex(gameState.turn)
    setCurrentPlayer(gameState.currentPlayer)
    setDeckSize(gameState.deckSize)
    setAllPlayers(gameState.players)
    setLastClaim(gameState.lastClaim)
    
  }

  const handlePlayTurn = (rank: string) => {
    // hide cards
    setIsTurn(false)
    //play cards and make claim
    gameInstance.playTurn(currentPlayerIndex, chosenCardIndexes, rank)
    setIsPopupVisible(false);

    setPlayedCardCount(chosenCardIndexes.length);

    if (claimedRank === rank) {
      setTotalPlayed(chosenCardIndexes.length + totalPlayed)
    }
    else {
      setTotalPlayed(chosenCardIndexes.length)
    }

    if (rank == "10" || rank == "A" || (totalPlayed + chosenCardIndexes.length > 3 && claimedRank === rank) || chosenCardIndexes.length === 4 ) {
      setAskForDiscard(true)
    }

    //reset chosen card, update game state
    setChosenCardIndexes([]);
    setClaimedRank(rank)
    const updatedGameState = gameInstance.getGameState()

    setCurrentPlayerIndex(updatedGameState.turn)
    setCurrentPlayer(updatedGameState.currentPlayer)
    setDeckSize(updatedGameState.deckSize)
    setAllPlayers(updatedGameState.players)
    setLastClaim(updatedGameState.lastClaim)
    
  }
  
  const handleDiscard = () => {
    setClaimedRank("")
    setTotalPlayed(0);
    setPlayedCardCount(0);
    setAskForDiscard(false)

    gameInstance.throwAwayPlayedCards()
    gameInstance.keepTurn()
    
    const updatedGameState = gameInstance.getGameState()

    setCurrentPlayerIndex(updatedGameState.turn)
    setCurrentPlayer(updatedGameState.currentPlayer)
    setDeckSize(updatedGameState.deckSize)
    setAllPlayers(updatedGameState.players)
    setLastClaim(updatedGameState.lastClaim)
  }

  const handleCallLie = (caller: number) => {
    setCallLie(true)
    setLieCaller(players[caller])
    
    //this is only for gameboard display
    if (lastClaim) {
      setCardPicker(players[caller])
    }
    else {
      setCardPicker(players[(currentPlayerIndex - 1 + players.length) % players.length])
      setGameWinner("")
    }
    gameInstance.callLie(caller)
    const updatedGameState = gameInstance.getGameState()

    setCurrentPlayerIndex(updatedGameState.turn)
    setCurrentPlayer(updatedGameState.currentPlayer)
    setDeckSize(updatedGameState.deckSize)
    setAllPlayers(updatedGameState.players)
    setLastClaim(updatedGameState.lastClaim)
    setAskForDiscard(false)
    setPlayedCardCount(0)
    setTotalPlayed(0)
    setClaimedRank("")

    //check if lie was called during turn
    if (isTurn) {
      setIsTurn(false)
    }
  }

  useEffect(() => {
    if (deckSize === 0) {
      const winner = allPlayers.filter(player => player.count === 0)
      if (winner.length !== 0) {
        setGameWinner(winner[0].name)
      }
    }
  }, [deckSize, allPlayers])

  const handleNextTurn = () => {
    if (gameWinner !== "") {
      setGameOver(true)
    }
    else {
      setIsTurn(true)
      setCallLie(false)
    }
  }

  return ( 
    <div>
      {/*visible before the game starts*/}
      {!gameStarted && (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl text-center font-extrabold mt-20 mb-4">Shit pant :D (Card Game)</h1>
          <button 
          className="rounded-full border border-solid border-blue-500 text-white px-4 py-2 text-center"
          onClick={handleGameStart}
          >Start the game</button>
        </div>
      )}
      
      {/*all of the players in the lobby, and their card count, and the option for each player to call for a lie*/}
      <GamePlayers 
      players={players}
      currentPlayerIndex={currentPlayerIndex}
      gameStarted={gameStarted}
      askForDiscard={askForDiscard}
      allPlayers={allPlayers}
      totalPlayed={totalPlayed}
      handleCallLie={handleCallLie}
      isTurn={isTurn}
      />

      {/* current player's cards at the bottom, card choosing mechanism */}
      {gameStarted && isTurn && (<PlayerCards
      isPopupVisible={isPopupVisible}
      setIsPopupVisible={setIsPopupVisible}
      setChosenCardIndexes={setChosenCardIndexes}
      chosenCardIndexes={chosenCardIndexes}
      currentPlayer={currentPlayer}
      gameStarted={gameStarted}
      />
      )}
      
      {/*render the stack of cards in the middle and other game information*/}
      {gameStarted && <GameBoardCenter 
      count={playedCardCount} 
      claim={claimedRank} 
      total={totalPlayed} 
      askForDiscard={askForDiscard} 
      onDiscard={handleDiscard} 
      onContinue={handleNextTurn}
      nextPlayer={players[currentPlayerIndex]}
      isTurn={isTurn}
      lieCalled={callLie}
      lieCaller={lieCaller}
      cardPicker={cardPicker}
      trueClaim={lastClaim}
      winner={gameWinner}
      gameOver={gameOver}
      onEnd={setCreateLobby}
      />}

      {/*Pop up for choosing the "claimed" card */}
      {isPopupVisible && <ClaimPopUp 
      onClose={() => setIsPopupVisible(false)} 
      chosenCards={chosenCardIndexes.map(index => currentPlayer.getCards()[index].getImage())}  
      handlePlayTurn={handlePlayTurn}
      previousClaim={claimedRank}
      />}

      {/* cosmetic pickup deck + number of cards in deck */}
      {gameStarted && (<PickupDeck deckSize={deckSize} />
      )}
    </div>
  )
}