import { useEffect } from "react";
import { initGame } from "@/lib/initGame";
import { useWidgetState } from "@/utils";
import type { Game, KeyCard } from "@/lib/types";
import { KeyCardComponent } from "@/components/KeyCard";
import { BoardComponent } from "@/components/Board";
import { decrypt } from "@/lib/crypto";

export const NEW_GAME_PROMPT = `
Game started ! For the first turn, you are the Spy Master (you the AI - not the user). 
Give your first clue & number of words to guess. 
Be concise, just say : "Game started ! Here my first clue & number of words to guess : <clue> <number of words>".
`;

export const GamePage = () => {
  const [game, setGame] = useWidgetState<Game>();
  useEffect(() => {
    const game = initGame();
    setGame(game);
  }, []);

  const handleResetGame = () => {
    setGame(initGame());
    window.openai.requestDisplayMode({ mode: "pip" });
    window.openai.sendFollowUpMessage({
      prompt: NEW_GAME_PROMPT,
    });
  };

  if (!game) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-codenames-green-dark relative">
      <div className="absolute top-4 right-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
            game.whoIsSpyMaster === "ai"
              ? "bg-codenames-purple text-codenames-cream"
              : "bg-codenames-yellow text-codenames-black"
          }`}
        >
          {game.whoIsSpyMaster === "ai" ? "🤖 ChatGPT Spymaster" : "👤 User Spymaster"}
        </span>
      </div>
      <div className="text-center">
        <h1 className="font-title text-4xl text-codenames-cream mb-4">Game Board</h1>
        <div className="flex gap-8 justify-center">
          <BoardComponent />
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-codenames-cream/80 mb-2 font-bold">Key Card</p>
            <KeyCardComponent keyCard={decrypt<KeyCard>(game.keyCards.user)} />
            <button
              className="bg-codenames-yellow hover:bg-codenames-yellow/90 text-codenames-black font-bold px-4 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 font-title tracking-wide cursor-pointer"
              onClick={handleResetGame}
            >
              Reset Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
