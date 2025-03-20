import {useState, useEffect} from 'react'
import Player from '@/app/gameComponents/player';

export default function PlayerCards({isPopupVisible, setIsPopupVisible, setChosenCardIndexes, chosenCardIndexes, currentPlayer, gameStarted}: {  
    isPopupVisible: boolean;
    setIsPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setChosenCardIndexes: React.Dispatch<React.SetStateAction<number[]>>;
    chosenCardIndexes: number[];
    currentPlayer: Player; 
    gameStarted: boolean;}) {

    const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);

    useEffect(() => {
        if (!isPopupVisible) {
          const handleKeyDown = (event: KeyboardEvent) => {
            event.preventDefault()
            if (!isPopupVisible) {
              if (event.key === "ArrowLeft") {
                setSelectedCardIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : currentPlayer.getCards().length - 1));
              } else if (event.key === "ArrowRight") {
                setSelectedCardIndex((prevIndex) => (prevIndex < currentPlayer.getCards().length - 1 ? prevIndex + 1 : 0));
              } else if (event.key === "Enter") {
                setChosenCardIndexes((prevIndexes) => {
                  if (prevIndexes.includes(selectedCardIndex)) {
                return prevIndexes.filter(index => index !== selectedCardIndex);
                  } else if (prevIndexes.length < 4) {
                return [...prevIndexes, selectedCardIndex];
                  } else {
                return prevIndexes;
                  }
                });
              }
              else if (event.key === "c"  && chosenCardIndexes.length > 0) {
                setIsPopupVisible(true);
              }
            }
          };
        
          window.addEventListener("keydown", handleKeyDown);
          return () => {
            window.removeEventListener("keydown", handleKeyDown);
          };
        };
      }, [gameStarted, chosenCardIndexes, selectedCardIndex, isPopupVisible, currentPlayer, setChosenCardIndexes, setIsPopupVisible]);

      const handleCardClick = (index: number) => {
        setChosenCardIndexes((prevIndexes) => {
          if (prevIndexes.includes(index)) {
            return prevIndexes.filter(i => i !== index);
          } else if (prevIndexes.length < 4) {
            return [...prevIndexes, index];
              } else {
            return prevIndexes;
              }
        });
      };

    return (
        <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center p-4">
            {chosenCardIndexes.length > 0 && 
            <button
                className="mb-4 rounded-full border border-solid border-blue-500 text-white px-4 py-2 text-center"
                onClick={() => setIsPopupVisible(true)}
            >
                Claim (C)
            </button>
            }

            <div 
                className="flex justify-center items-center"
                style={{gridTemplateColumns: `repeat(${currentPlayer.getCards().length}, minmax(0, 1fr))`,}}>
              {currentPlayer.getCards().map((card, index) => (
                  <button
                  key={index}
                  className={`relative inline-block ml-4`}
                  onClick={() => handleCardClick(index)}
                  >
                  <img src={card.getImage()} alt={card.name} width={currentPlayer.getCards().length > 8 ? 100 : 125} height={100} style={{ margin: "5px" }} 
                  className={`border-s-rounded ${index === selectedCardIndex ? "shadow-lg shadow-blue-500/50" : ""} hover:shadow-lg hover:shadow-blue-500/50 ${chosenCardIndexes.includes(index) ? "border-4 border-yellow-500" : ""}`} />
                  </button>
              ))}
            </div>
        </div>
    )
}