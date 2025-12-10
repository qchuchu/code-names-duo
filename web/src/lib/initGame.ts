import type { Board, Game, KeyCard } from "./types";
import { encrypt } from "./crypto";

const MOCK_INIT_BOARD: Board = [
  [
    { word: "ocean", status: "hidden", row: 0, column: 0 },
    { word: "mountain", status: "hidden", row: 0, column: 1 },
    { word: "cloud", status: "hidden", row: 0, column: 2 },
    { word: "forest", status: "hidden", row: 0, column: 3 },
    { word: "river", status: "hidden", row: 0, column: 4 },
  ],
  [
    { word: "desert", status: "hidden", row: 1, column: 0 },
    { word: "island", status: "hidden", row: 1, column: 1 },
    { word: "valley", status: "hidden", row: 1, column: 2 },
    { word: "volcano", status: "hidden", row: 1, column: 3 },
    { word: "canyon", status: "hidden", row: 1, column: 4 },
  ],
  [
    { word: "city", status: "hidden", row: 2, column: 0 },
    { word: "village", status: "hidden", row: 2, column: 1 },
    { word: "castle", status: "hidden", row: 2, column: 2 },
    { word: "bridge", status: "hidden", row: 2, column: 3 },
    { word: "road", status: "hidden", row: 2, column: 4 },
  ],
  [
    { word: "window", status: "hidden", row: 3, column: 0 },
    { word: "garden", status: "hidden", row: 3, column: 1 },
    { word: "museum", status: "hidden", row: 3, column: 2 },
    { word: "library", status: "hidden", row: 3, column: 3 },
    { word: "theater", status: "hidden", row: 3, column: 4 },
  ],
  [
    { word: "robot", status: "hidden", row: 4, column: 0 },
    { word: "piano", status: "hidden", row: 4, column: 1 },
    { word: "rocket", status: "hidden", row: 4, column: 2 },
    { word: "bicycle", status: "hidden", row: 4, column: 3 },
    { word: "compass", status: "hidden", row: 4, column: 4 },
  ],
];

const MOCK_USER_KEY_CARD: KeyCard = [
  ["assassin", "innocent", "innocent", "innocent", "innocent"],
  ["innocent", "word_to_guess", "word_to_guess", "word_to_guess", "word_to_guess"],
  ["word_to_guess", "word_to_guess", "word_to_guess", "word_to_guess", "word_to_guess"],
  ["innocent", "assassin", "innocent", "innocent", "innocent"],
  ["innocent", "innocent", "innocent", "innocent", "assassin"],
];

const MOCK_AGENT_KEY_CARD: KeyCard = [
  ["word_to_guess", "word_to_guess", "word_to_guess", "word_to_guess", "word_to_guess"],
  ["word_to_guess", "word_to_guess", "word_to_guess", "word_to_guess", "innocent"],
  ["innocent", "innocent", "innocent", "innocent", "assassin"],
  ["assassin", "assassin", "innocent", "innocent", "innocent"],
  ["innocent", "innocent", "innocent", "innocent", "innocent"],
];

const COMMENT_FOR_AI = `
Structure of the game board data: 
- Board is a 5x5 grid of cells containing words and their status.
- Status can be "hidden", "innocent_user", "innocent_ai", "revealed", "assassin".

- KeyCards are 5x5 grids (mapping to the board) containing what categories (either for AI or user) the words belong to.
YOUR KEY CARD IS THE ONE FOR THE AI.
YOU SHOULD NOT REVEAL THE KEY CARD TO THE USER.
- Categories can be "word_to_guess" (the one you need to make guess to the user),  "innocent" (the one you don't want to be guessed by the user), "assassin" (if the user guesses this word, the game is over).

ONLY GIVE ONE CLUE PER TURN. IF THE USER ASK FOR A NEW CLUE, DO NOT GIVE IT.
`;

export const initGame = (): Game => {
  return {
    board: MOCK_INIT_BOARD,
    keyCards: {
      user: encrypt(MOCK_USER_KEY_CARD),
      ai: MOCK_AGENT_KEY_CARD,
    },
    commentForAI: COMMENT_FOR_AI,
    whoIsSpyMaster: "user",
    currentClue: null,
  };
};
