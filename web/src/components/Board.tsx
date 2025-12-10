import type { Game, BoardCell } from "@/lib/types";
import { useWidgetState } from "@/utils";
import { Card } from "./Card";

export const BoardComponent = () => {
  const [game, setGame] = useWidgetState<Game>();

  if (!game) return null;

  const handleCardClick = (cell: BoardCell) => {
    if (!(cell.status === "hidden" || cell.status === "innocent_ai")) return;

    const keyCardCell = game.keyCards.ai[cell.row][cell.column];

    let newStatus: BoardCell["status"];
    if (keyCardCell === "word_to_guess") {
      newStatus = "revealed";
    } else if (keyCardCell === "assassin") {
      window.openai.sendFollowUpMessage({
        prompt: `The user has guessed the word ${keyCardCell}. It was the assassin. Game over.`,
      });
      setGame({ ...game, status: "gameOver" });
      newStatus = "assassin";
    } else {
      newStatus = "innocent_user";
      window.openai.sendFollowUpMessage({
        prompt: `The user has guessed the word ${keyCardCell}. It was an innocent word. It's your turn to guess a word.`,
      });
      setGame({ ...game, whoIsSpyMaster: "user" });
    }

    game.board[cell.row][cell.column].status = newStatus;
    setGame({ ...game });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-5 gap-2">
        {game.board.flat().map((cell, index) => (
          <Card key={index} cell={cell} onClick={() => handleCardClick(cell)} />
        ))}
      </div>
    </div>
  );
};
