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
    let newGameStatus: Game["status"] | undefined;
    let newWhoIsSpyMaster: Game["whoIsSpyMaster"] | undefined;
    if (keyCardCell === "word_to_guess") {
      newStatus = "revealed";
    } else if (keyCardCell === "assassin") {
      window.openai.sendFollowUpMessage({
        prompt: `The user has guessed the word ${keyCardCell}. It was the assassin. Game over. Explain him the words you wanted him to guess.`,
      });
      newGameStatus = "gameOver";
      newStatus = "assassin";
    } else {
      newStatus = "innocent_user";
      newWhoIsSpyMaster = "user";
    }

    game.board[cell.row][cell.column].status = newStatus;
    if (newGameStatus) {
      game.status = newGameStatus;
    }
    if (newWhoIsSpyMaster) {
      game.whoIsSpyMaster = newWhoIsSpyMaster;
    }
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
