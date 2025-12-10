type BoardCell = {
  word: string;
  status: "hidden" | "innocent_user" | "innocent_ai" | "revealed" | "assassin";
  row: number;
  column: number;
};
type BoardRow = [BoardCell, BoardCell, BoardCell, BoardCell, BoardCell];
type Board = [BoardRow, BoardRow, BoardRow, BoardRow, BoardRow];

type KeyCardCell = "word_to_guess" | "innocent" | "assassin";
type KeyCardRow = [KeyCardCell, KeyCardCell, KeyCardCell, KeyCardCell, KeyCardCell];
type KeyCard = [KeyCardRow, KeyCardRow, KeyCardRow, KeyCardRow, KeyCardRow];
type Clue = {
  word: string;
  number: number;
};

type Game = {
  board: Board;
  keyCards: {
    user: string; // encrypted KeyCard
    ai: KeyCard;
  };
  commentForAI: string;
  whoIsSpyMaster: "user" | "ai";
  status: "running" | "gameOver";
};

export type { Board, BoardCell, BoardRow, KeyCard, KeyCardCell, KeyCardRow, Game, Clue };
