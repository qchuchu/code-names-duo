import { useEffect } from "react";
import { initGame } from "@/lib/initGame";
import { useWidgetState } from "@/utils";
import type { Game, KeyCard } from "@/lib/types";
import { KeyCardComponent } from "@/components/KeyCard";
import { BoardComponent } from "@/components/Board";
import { decrypt } from "@/lib/crypto";
import { useOpenAiGlobal } from "skybridge/web";

export const NEW_GAME_PROMPT = `
Game started ! For the first turn, you are the Spy Master (you the AI - not the user). 
Give your first clue & number of words to guess. 
Be concise, just say : "Game started ! Here my first clue & number of words to guess : <clue> <number of words>".
`;

export const GamePage = () => {
  const [game, setGame] = useWidgetState<Game>();
  const displayMode = useOpenAiGlobal("displayMode");
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

  const handleEndTurn = () => {
    game.whoIsSpyMaster = "user";
    setGame({ ...game });
    window.openai.sendFollowUpMessage({
      prompt: `The user has ended their turn. It's now your turn to guess words. Wait for the user to give you a clue & number of words to guess. Don't give him examples of clues, just wait for the user to give you a clue & number of words to guess.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-codenames-green-dark p-4">
      <div className="flex justify-between items-center mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
            game.whoIsSpyMaster === "ai"
              ? "bg-codenames-purple text-codenames-cream"
              : "bg-codenames-yellow text-codenames-black"
          }`}
        >
          {game.whoIsSpyMaster === "ai" ? "🤖 ChatGPT Spymaster" : "👤 User Spymaster"}
        </span>
        <h1 className="font-title text-4xl text-codenames-cream">Game Board</h1>
        <div className="flex items-center gap-2">
          <button
            className="bg-codenames-yellow hover:bg-codenames-yellow/90 text-codenames-black font-bold px-4 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 font-title tracking-wide cursor-pointer"
            onClick={handleResetGame}
          >
            Reset Game
          </button>
          {displayMode === "inline" && (
            <button
              className="bg-codenames-cream hover:bg-codenames-cream/90 text-codenames-black font-bold px-3 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => window.openai.requestDisplayMode({ mode: "pip" })}
              title="Pin widget"
            >
              📌
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-8">
          <BoardComponent />
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <p className="text-codenames-cream/80 font-bold">Key Card</p>
              <KeyCardComponent keyCard={decrypt<KeyCard>(game.keyCards.user)} />
            </div>
            {game.whoIsSpyMaster === "ai" && (
              <button
                className="bg-codenames-purple hover:bg-codenames-purple-dark text-codenames-cream font-bold px-4 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 font-title tracking-wide cursor-pointer"
                onClick={handleEndTurn}
              >
                End Turn
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
