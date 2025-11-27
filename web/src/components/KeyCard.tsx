import type { KeyCard, KeyCardCell } from "@/lib/types";

type KeyCardProps = {
  keyCard: KeyCard;
};

const CellIcon = ({ type }: { type: KeyCardCell }) => {
  if (type === "word_to_guess") {
    return (
      <svg viewBox="0 0 24 24" className="w-3 h-3">
        <path
          d="M12 2L15 9L12 12L9 9L12 2Z M12 22L9 15L12 12L15 15L12 22Z M2 12L9 9L12 12L9 15L2 12Z M22 12L15 15L12 12L15 9L22 12Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "assassin") {
    return (
      <svg viewBox="0 0 24 24" className="w-3 h-3">
        <path
          d="M6 6L18 18M6 18L18 6"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return null;
};

const KeyCardCellComponent = ({ type }: { type: KeyCardCell }) => {
  const baseClasses = "w-6 h-6 rounded-sm flex items-center justify-center";

  if (type === "word_to_guess") {
    return (
      <div className={`${baseClasses} bg-codenames-green text-codenames-green-dark`}>
        <CellIcon type={type} />
      </div>
    );
  }

  if (type === "assassin") {
    return (
      <div className={`${baseClasses} bg-codenames-black text-codenames-cream`}>
        <CellIcon type={type} />
      </div>
    );
  }

  return <div className={`${baseClasses} bg-codenames-cream`} />;
};

export const KeyCardComponent = ({ keyCard }: KeyCardProps) => {
  return (
    <div className="bg-[#6b5b4f] p-2 rounded-lg inline-block">
      <div className="bg-codenames-black p-1.5 rounded-md">
        <div className="grid grid-cols-5 gap-1">
          {keyCard.flat().map((cell, index) => (
            <KeyCardCellComponent key={index} type={cell} />
          ))}
        </div>
      </div>
    </div>
  );
};
