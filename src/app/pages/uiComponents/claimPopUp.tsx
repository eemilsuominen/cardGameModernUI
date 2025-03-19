import { useState, useEffect } from "react";
import Image from "next/image";

function ClaimPopUp({ onClose, chosenCards, handlePlayTurn, previousClaim }: { onClose: () => void, chosenCards: string[], handlePlayTurn: (rank:string) => void, previousClaim: string  }) {
  const cardBackSrc = "/cards/nicubunu_Card_backs_grid_red.svg";
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);

  const cardRanks = ["3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2"];
  const rankHierarchy: {[key:string]: number} = {
    "3": 0, "4": 1, "5": 2, "6": 3, "7": 4, "8": 5, "9": 6, "10": 7, "J": 8, "Q": 9, "K": 10, "A": 11, "2": 12,
  };
  if (!previousClaim) {
    previousClaim = "3";
  }
  const visibleRanks = cardRanks.filter(rank => rankHierarchy[rank] >= rankHierarchy[previousClaim]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault()
      if (event.key === "ArrowLeft") {
        setSelectedCardIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : visibleRanks.length - 1));
      } else if (event.key === "ArrowRight") {
        setSelectedCardIndex((prevIndex) => (prevIndex < visibleRanks.length - 1 ? prevIndex + 1 : 0));
      }
      else if (event.key === "Enter") {
        handlePlayTurn(visibleRanks[selectedCardIndex]);
        onClose();
      }
      else if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCardIndex, visibleRanks, handlePlayTurn, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-4 rounded-lg border border-solid border-blue-500 bg-black">
        <h2 className="text-2xl mb-4 text-center">Claim a rank (Enter):</h2>
        <div className="grid grid-cols-7 gap-4">
          {visibleRanks.map((rank, index) => (
            <div key={index} className="relative">
              <Image src={cardBackSrc} alt="Card Back" width={75} height={75} style={{ margin: "5px" }} />
              <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-black text-4xl font-extrabold">{rank}</span>

              <button
                onClick={() => {
                    handlePlayTurn(visibleRanks[index]);
                    onClose();
                }} 
                className={`absolute top-0 left-0 w-full h-full hover:shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300 ${selectedCardIndex === index ? "border-4 border-yellow-500" : ""}`}
              />
            </div>
          ))}
        </div>

        <h3 className="text-xl mt-4 text-center">Claimed cards:</h3>
        <div className="flex justify-center items-center">
          {chosenCards.map((cardSource, index) => (
            <Image key={index} src={cardSource} alt={`Chosen card ${index}`} width={75} height={75} style={{ margin: "5px" }} />
          ))}
        </div>

        <button
          className="mt-4 rounded-full border border-solid border-blue-500 text-white px-4 py-2 text-center"
          onClick={onClose}
        >
          Close (Esc)
        </button>
      </div>
    </div>
  );
}

export default ClaimPopUp;
