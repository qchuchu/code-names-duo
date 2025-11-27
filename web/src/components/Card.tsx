import type { BoardCell } from "@/lib/types";

type CardProps = {
  cell: BoardCell;
};

export const Card = ({ cell }: CardProps) => {
  return (
    <div className="w-20 h-14 bg-codenames-cream rounded-md shadow-md flex items-center justify-center border border-codenames-cream/50 hover:shadow-lg transition-shadow cursor-pointer">
      <span className="font-body font-bold text-xs text-codenames-black uppercase tracking-wide">
        {cell.word}
      </span>
    </div>
  );
};
