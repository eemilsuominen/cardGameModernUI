import Image from "next/image"

export default function PickupDeck({deckSize}: {deckSize: number}) {

    const cardBackSource = "/cards/nicubunu_Card_backs_grid_red.svg";
    return (
        <div className="fixed right-10 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-12">
            <div className="relative" style={{ width: '125px', height: '125px' }}>
                {Array.from({ length: (deckSize > 5 ? 5 : deckSize) }).map((_, index) => (
                <Image
                    key={index}
                    src={cardBackSource}
                    alt="Card Deck"
                    width={125}
                    height={125}
                    style={{ position: "absolute", top: "0px", right: `${index * 4}px` }}
                />
                ))}
            </div>
            <p className="mt-2 text-white">Pickup Deck ({deckSize} cards)</p>
        </div>
    )
}