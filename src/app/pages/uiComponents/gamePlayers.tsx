import Image from "next/image"

export default function GamePlayers({players, currentPlayerIndex, gameStarted, askForDiscard, allPlayers, totalPlayed, handleCallLie, isTurn}: 
    {players: string[], currentPlayerIndex: number, gameStarted: boolean, askForDiscard: boolean, allPlayers: {name: string, count: number}[], totalPlayed: number, handleCallLie: (index: number) => void, isTurn: boolean}) {
    const cardBackSrc = "/cards/nicubunu_Card_backs_grid_red.svg";

    return (
        <div className="flex justify-around items-center mt-20">
        {players.map((player, index) => (
            <div key={index} className="text-center items-center flex flex-col">
            {/*player names and card counts*/}
            <div className="flex items-center gap-4">
                <div 
                className={`flex flex-col items-center font-bold text-2xl transition-all duration-300 
                    ${(index === currentPlayerIndex && gameStarted && !askForDiscard) ? "text-yellow-500 scale-110 underline" : "text-white"}`} >
                <p className="mt-2">{player}</p>
                </div>
                <div className="relative inline-block ml-4">
                <Image src={cardBackSrc} alt="Card Back" width={125} height={125 }style={{ margin: "5px" }} />
                {gameStarted && (<span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-black text-6xl font-extrabold">{allPlayers[index].count}</span>)}
                </div>
            </div>

            {/* call lie, only visible for current player during turn */}
            {totalPlayed > 0 && (!isTurn || index === currentPlayerIndex) && (
                <button 
                    className="rounded-full border border-solid border-blue-500 text-white px-4 py-2 text-center" 
                    onClick={() => handleCallLie(index)}
                >
                    Call Lie
                </button>
            )}
            

            </div>
        ))}
        </div>
    )
}