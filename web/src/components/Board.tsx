import type { Board } from "@/lib/types";
import { Card } from "./Card";

type BoardProps = {
  board: Board;
};

export const BoardComponent = ({ board }: BoardProps) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {board.flat().map((cell, index) => (
        <Card key={index} cell={cell} />
      ))}
    </div>
  );
};
