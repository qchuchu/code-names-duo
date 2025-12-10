import { useEffect, useRef } from "react";
import { isEqual } from "lodash";
import { initGame } from "@/lib/initGame";
import { useWidgetState } from "@/utils";
import type { Board, BoardCell, BoardRow, Game, KeyCard } from "@/lib/types";
import { KeyCardComponent } from "@/components/KeyCard";
import { BoardComponent } from "@/components/Board";
import { decrypt } from "@/lib/crypto";
import { useOpenAiGlobal, useToolInfo } from "skybridge/web";
import { NEW_GAME_PROMPT } from "./constants";

type ToolOutput = { action: "startGame" } | { action: "guessWord"; wordToGuess: string };

export const GamePage = () => {
  const [game, setGame] = useWidgetState<Game>();
  const { output } = useToolInfo<{ output: ToolOutput }>();
  const displayMode = useOpenAiGlobal("displayMode");
  const processedOutputRef = useRef<ToolOutput | undefined>(undefined);

  const handleGuessCorrectWord = (wordToGuess: string) => {
    window.openai.sendFollowUpMessage({
      prompt: `The word "${wordToGuess}" was a correct word! The AI can continue guessing, or end the turn (by speaking in the chat - do not try to use the tool with the parameter END TURN. IF YOU ARE CONFIDENT THAT YOU CAN GUESS ANOTHER WORD, GO AHEAD AND GUESS IT).`,
    });
    return {};
  };

  const handleGuessIncorrectWord = (wordToGuess: string): Partial<Game> => {
    window.openai.sendFollowUpMessage({
      prompt: `The word "${wordToGuess}" was an incorrect word. Turn ends.`,
    });
    return { status: "gameOver" };
  };

  const handleInnocentWord = (wordToGuess: string): Partial<Game> => {
    window.openai.sendFollowUpMessage({
      prompt: `The word "${wordToGuess}" was an innocent word. Turn ends. It's now your turn to make the user guess words.`,
    });
    return { whoIsSpyMaster: "user", status: "running" };
  };

  useEffect(() => {
    if (output === undefined) return;
    if (isEqual(output, processedOutputRef.current)) return;
    processedOutputRef.current = output;

    if (output.action === "guessWord") {
      setGame((prevGame) => {
        if (!prevGame) return prevGame;
        const userKeyCard = decrypt<KeyCard>(prevGame.keyCards.user);
        let guessResult: "correct" | "innocent" | "assassin" = "correct";

        const updatedBoard = prevGame.board.map(
          (row, rowIndex) =>
            row.map((cell, colIndex) => {
              if (cell.word === output.wordToGuess) {
                const keyCardCell = userKeyCard[rowIndex][colIndex];
                let newStatus: BoardCell["status"];
                if (keyCardCell === "word_to_guess") {
                  newStatus = "revealed";
                  guessResult = "correct";
                } else if (keyCardCell === "assassin") {
                  newStatus = "assassin";
                  guessResult = "assassin";
                } else {
                  newStatus = "innocent_user";
                  guessResult = "innocent";
                }
                return { ...cell, status: newStatus };
              }
              return cell;
            }) as BoardRow,
        ) as Board;

        let gameUpdates: Partial<Game> = {};
        if (guessResult === "correct") {
          gameUpdates = handleGuessCorrectWord(output.wordToGuess);
        } else if (guessResult === "assassin") {
          gameUpdates = handleGuessIncorrectWord(output.wordToGuess);
        } else {
          gameUpdates = handleInnocentWord(output.wordToGuess);
        }

        return { ...prevGame, board: updatedBoard, ...gameUpdates };
      });
    }
  }, [output]);

  const handleResetGame = () => {
    setGame(initGame());
    window.openai.requestDisplayMode({ mode: "fullscreen" });
    window.openai.sendFollowUpMessage({
      prompt: NEW_GAME_PROMPT,
    });
  };

  if (!game) return null;

  const handleEndTurn = () => {
    if (game.whoIsSpyMaster === "user") {
      game.whoIsSpyMaster = "ai";
      setGame({ ...game });
      window.openai.sendFollowUpMessage({
        prompt: `It's now your turn to make the user guess words. Give him clues and the number of words to guess.`,
      });
      return;
    }
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
              onClick={() => window.openai.requestDisplayMode({ mode: "fullscreen" })}
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
            <button
              className="bg-codenames-purple hover:bg-codenames-purple-dark text-codenames-cream font-bold px-4 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 font-title tracking-wide cursor-pointer"
              onClick={handleEndTurn}
            >
              End Turn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
