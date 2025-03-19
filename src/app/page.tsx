'use client'
import { useState } from 'react';
import GamePage from './pages/gamePage';

export default function Home() {

  const [usernames, setUsernames] = useState(['', '', '', '']);
  const [createLobby, setCreateLobby] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newUsernames = [...usernames];
    newUsernames[index] = e.target.value; 
    setUsernames(newUsernames); 
  };

  const handleEndGame = () => {
    setCreateLobby(false)
  }

  return (
    <div>
      {!createLobby && (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
    
          <h1 className="text-7xl font-extrabold text-center mt-20">
          Shit Pant :D (Card Game)
          </h1>
          
          <div className= "p-6 shadow-x1 w-96 bg-[#121a2b] rounded">
            <h1 className="font-bold text-center mb-4">Enter at least 2 players</h1>
            <div className="flex flex-col row-start-2  space-y-4">
            {usernames.map((inputValue, index) => (
              <input
                key={index}
                className="p-2.5 border rounded border-gray-500 bg-[#1c2a3e] text-white text-sm"
                placeholder={`Player ${index + 1}`}
                value={inputValue}
                onChange={(e) => handleInputChange(e, index)}
              />
            ))}
              <button 
              onClick={() => setCreateLobby(true)}
              className={`rounded-full border border-solid border-blue-500 text-white px-4 py-2 text-center ${usernames.filter(username => username !== "").length >= 2 ? 'hover:bg-blue-600' : 'opacity-to pointer-events-none'}`}>
              Create Game
              </button>
            </div>
          </div>
        </div>
      )}
      {createLobby && (<GamePage usernames={usernames} setCreateLobby={handleEndGame}/>)}
    </div>
  );
}
