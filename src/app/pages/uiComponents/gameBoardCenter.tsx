import Image from "next/image";
import { useEffect } from "react";
import {Link} from "react-router-dom"

export default function GameBoardCenter({ count, claim, total, askForDiscard, onDiscard, onContinue, isTurn, nextPlayer, lieCalled, lieCaller, cardPicker, trueClaim, winner, gameOver }: 
  { count: number, claim: string, total: number, askForDiscard: boolean, onDiscard: () => void, onContinue: () => void, isTurn: boolean, nextPlayer: string, lieCalled: boolean, lieCaller: string, cardPicker: string, trueClaim: boolean, winner: string, gameOver: boolean }) {
  const cardBackSrc = "/cards/nicubunu_Card_backs_grid_red.svg";
  const cardNames: {[key: string]: string} = {"A": "Ace", "J": "Jack", "Q": "Queen", "K": "King"}
  const displayName = cardNames[claim] || claim;

  useEffect(() => {
      if (!isTurn) {
        const handleKeyDown = (event: KeyboardEvent) => {
          event.preventDefault()
          if (event.key === "Enter") {
            if (askForDiscard) {
              onDiscard();
            }
            else {
              onContinue();
            }
          }
        };
      
        window.addEventListener("keydown", handleKeyDown);
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
      };
    }, [askForDiscard, onDiscard, onContinue, isTurn]);
  
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
      <div className="flex gap-2 relative" style={{ width: '125px', height: '125px' }}>
        {Array.from({ length: (count > 5 ? 5 : count) }).map((_, index) => (
          <Image key={index} src={cardBackSrc} alt="Played Card" width={100} height={140} style={{ position: "absolute", top: "0px", right: `${index * 4}px` }} />
        ))}
      </div>
      <div className="flex flex-col"> 
        {total > 0 && !gameOver && (
          <div>
            <span className="text-white text-xl font-bold">Claim: </span>
            <span className="text-white text-xl font-bold">{count} x {displayName}{count > 1 ? "s": ""} {(!(total === count) && total > 0) ? `, total: ${total}` : ""}</span>
          </div>
        )}
        {askForDiscard && (
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold mb-2">Discard played cards?</span>
            <button className="mb-4 rounded-full border border-solid border-blue-500 text-white px-4 py-2 text-center" onClick={onDiscard}>Discard (Enter)</button>
          </div>
        )}
        {!isTurn && !askForDiscard && !gameOver && (
          <div className="flex flex-col">
            {lieCalled && (<span className="text-white text-xl font-bold mb-4">{lieCaller} called for a lie, the claim was {trueClaim ? "true" : "a lie"}</span>)}
            {lieCalled && (<span className="text-white text-xl font-bold mb-4">{cardPicker} picks up the cards</span>)}
            <span className="text-white text-xl font-bold mb-4">Next in turn: {nextPlayer}</span>
            <button className="mb-4 rounded-full border border-solid border-blue-500 text-white px-4 py-2 text-center" onClick={onContinue}>{(winner !== "") ? "Game over?" : "Begin turn (Enter)"}</button>
          </div>
        )}
        {gameOver && (
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold mb-2">{winner} wins!</span>
            <Link 
            to={"/"}
            className={`rounded-full border border-solid border-blue-500 text-white px-4 py-2 text-center hover:bg-blue-600'`}>
            Back to front page
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}