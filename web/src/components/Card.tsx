import type { BoardCell } from "@/lib/types";

type CardProps = {
  cell: BoardCell;
  onClick?: () => void;
};

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <path
      d="M12 2L15 9L12 12L9 9L12 2Z M12 22L9 15L12 12L15 15L12 22Z M2 12L9 9L12 12L9 15L2 12Z M22 12L15 15L12 12L15 9L22 12Z"
      fill="currentColor"
    />
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const TimerPill = () => (
  <div className="absolute -top-1 -right-1 bg-codenames-yellow rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-codenames-black">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

export const Card = ({ cell, onClick }: CardProps) => {
  if (cell.status === "revealed") {
    return (
      <div className="w-20 h-14 bg-codenames-green rounded-md shadow-md flex items-center justify-center text-codenames-green-dark">
        <StarIcon />
      </div>
    );
  }

  if (cell.status === "assassin") {
    return (
      <div className="w-20 h-14 bg-codenames-black rounded-md shadow-md flex items-center justify-center text-codenames-cream">
        <CrossIcon />
      </div>
    );
  }

  if (cell.status === "innocent_user") {
    return (
      <div className="relative w-20 h-14 bg-codenames-cream rounded-md shadow-md flex items-center justify-center border border-codenames-cream/50">
        <TimerPill />
        <span className="font-body font-bold text-xs text-codenames-black uppercase tracking-wide">{cell.word}</span>
      </div>
    );
  }

  return (
    <div
      className="w-20 h-14 bg-codenames-cream rounded-md shadow-md flex items-center justify-center border border-codenames-cream/50 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <span className="font-body font-bold text-xs text-codenames-black uppercase tracking-wide">{cell.word}</span>
    </div>
  );
};
