import type { Board, BoardRow, Game, KeyCard, KeyCardCell, KeyCardRow } from "./types";
import { encrypt } from "./crypto";

const WORD_LIST = [
  "Ace", "Alaska", "Anchor", "Ant", "Anthem", "Apron", "Armor", "Army", "Ash", "Astronaut",
  "Attic", "Avalanche", "Axe", "Baby", "Bacon", "Balloon", "Banana", "Barbecue", "Bass", "Bath",
  "Battle", "Battleship", "Bay", "Beam", "Bean", "Beard", "Bee", "Beer", "Bench", "Bicycle",
  "Big bang", "Big ben", "Bikini", "Biscuit", "Blacksmith", "Blade", "Blind", "Blizzard", "Blues", "Boil",
  "Bonsai", "Book", "Boss", "Bowl", "Bowler", "Boxer", "Brain", "Brass", "Brazil", "Bread",
  "Break", "Brick", "Bride", "Brother", "Bubble", "Bucket", "Bulb", "Bunk", "Butter", "Butterfly",
  "Cable", "Caesar", "Cake", "Camp", "Cane", "Captain", "Castle", "Cave", "Chain", "Chalk",
  "Cheese", "Cherry", "Chip", "Christmas", "Cleopatra", "Clock", "Cloud", "Coach", "Coast", "Coffee",
  "Collar", "Columbus", "Comb", "Comet", "Computer", "Cone", "Country", "Cow", "Cowboy", "Crab",
  "Craft", "Crow", "Crusader", "Crystal", "Cuckoo", "Curry", "Dash", "Delta", "Dentist", "Desk",
  "Director", "Disk", "Doll", "Dollar", "Door", "Drawing", "Dream", "Dressing", "Driver", "Drone",
  "Drum", "Dryer", "Dust", "Dwarf", "Ear", "Earth", "Earthquake", "Easter", "Eden", "Egg",
  "Einstein", "Elephant", "Farm", "Fever", "Fiddle", "Flag", "Flat", "Flood", "Floor", "Foam",
  "Fog", "Frog", "Frost", "Fuel", "Gangster", "Garden", "Gear", "Genie", "Glacier", "Glasses",
  "Goat", "Goldilocks", "Golf", "Governor", "Greenhouse", "Groom", "Guitar", "Gum", "Gymnast", "Hair",
  "Halloween", "Hamburger", "Hammer", "Hawaii", "Helmet", "Hercules", "Hide", "Hit", "Homer", "Hose",
  "House", "Ice age", "Iceland", "Igloo", "Ink", "Jail", "Jellyfish", "Jeweler", "Joan of arc", "Jockey",
  "Joker", "Judge", "Jumper", "Kick", "Kilt", "King arthur", "Kiss", "Kitchen", "Knot", "Kung fu",
  "Lace", "Ladder", "Laundry", "Leaf", "Leather", "Lemonade", "Letter", "Lightning", "Lip", "Locust",
  "Love", "Lumberjack", "Lunch", "Magazine", "Magician", "Makeup", "Manicure", "Map", "Maracas", "Marathon",
  "Mark", "Medic", "Memory", "Mess", "Meter", "Microwave", "Mile", "Milk", "Mill", "Minotaur",
  "Minute", "Mirror", "Miss", "Mohawk", "Mona lisa", "Monkey", "Moses", "Mosquito", "Mother", "Mountie",
  "Mud", "Mummy", "Musketeer", "Mustard", "Napoleon", "Nerve", "Newton", "Noah", "Nose", "Notre dame",
  "Nylon", "Oasis", "Onion", "Pacific", "Pad", "Paddle", "Page", "Paint", "Parade", "Parrot",
  "Patient", "Pea", "Peach", "Peanut", "Pearl", "Pen", "Penny", "Pentagon", "Pepper", "Pew",
  "Pig", "Pillow", "Pine", "Pitcher", "Pizza", "Pocket", "Polish", "Polo", "Pop", "Popcorn",
  "Potato", "Potter", "Powder", "Puppet", "Purse", "Quack", "Quarter", "Radio", "Rail", "Rainbow",
  "Ram", "Ranch", "Rat", "Razor", "Record", "Reindeer", "Rice", "Rifle", "Rip", "River",
  "Road", "Rodeo", "Roll", "Rope", "Rubber", "Russia", "Rust", "Sack", "Saddle", "Sahara",
  "Sail", "Salad", "Saloon", "Salsa", "Salt", "Sand", "Santa", "Saw", "Scarecrow", "Scratch",
  "Scroll", "Second", "Shampoo", "Shed", "Sheet", "Shell", "Sherlock", "Sherwood", "Shoot", "Shorts",
  "Shoulder", "Shower", "Sign", "Silk", "Sister", "Skates", "Ski", "Skull", "Sled", "Sleep",
  "Sling", "Slipper", "Sloth", "Smell", "Smoke", "Smoothie", "Snake", "Snap", "Soap", "Soup",
  "Sphinx", "Spirit", "Spoon", "Spray", "Spurs", "Squash", "Squirrel", "St.patrick", "Stable", "Stamp",
  "Steam", "Steel", "Step", "Stethoscope", "Sticker", "Storm", "Story", "Street", "Sugar", "Sumo",
  "Sun", "Swamp", "Sweat", "Sword", "Tank", "Taste", "Tattoo", "Tea", "Team", "Tear",
  "Texas", "Thunder", "Tiger", "Tin", "Tip", "Tipi", "Toast", "Tornado", "Trick", "Troll",
  "Tunnel", "Turtle", "Tutu", "Tuxedo", "University", "Valentine", "Vampire", "Venus", "Viking", "Violet",
  "Virus", "Volcano", "Volume", "Wagon", "Waitress", "Walrus", "Wedding", "Werewolf", "Wheel", "Wheelchair",
  "Whistle", "Window", "Wing", "Wish", "Wizard", "Wonderland", "Wood", "Wool", "Yellowstone", "Zombie",
];

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateRandomBoard = (): Board => {
  const shuffledWords = shuffleArray(WORD_LIST).slice(0, 25);
  const board: Board = [] as unknown as Board;

  for (let row = 0; row < 5; row++) {
    const boardRow: BoardRow = [] as unknown as BoardRow;
    for (let col = 0; col < 5; col++) {
      boardRow.push({
        word: shuffledWords[row * 5 + col],
        status: "hidden",
        row,
        column: col,
      });
    }
    board.push(boardRow);
  }

  return board;
};

const generateRandomKeyCards = (): { user: KeyCard; ai: KeyCard } => {
  // Codenames Duet rules: 9 green (words to guess) for each team, 3 assassins, rest innocent
  // Some cells overlap between teams
  const positions = shuffleArray([...Array(25).keys()]);

  const userCard: KeyCardCell[] = Array(25).fill("innocent");
  const aiCard: KeyCardCell[] = Array(25).fill("innocent");

  // Assign 9 words to guess for user
  for (let i = 0; i < 9; i++) {
    userCard[positions[i]] = "word_to_guess";
  }

  // Assign 9 words to guess for AI (some may overlap)
  for (let i = 5; i < 14; i++) {
    aiCard[positions[i]] = "word_to_guess";
  }

  // Assign 3 assassins for user
  for (let i = 20; i < 23; i++) {
    userCard[positions[i]] = "assassin";
  }

  // Assign 3 assassins for AI
  for (let i = 22; i < 25; i++) {
    aiCard[positions[i]] = "assassin";
  }

  // Convert to 5x5 grid
  const toKeyCard = (flat: KeyCardCell[]): KeyCard => {
    const card: KeyCard = [] as unknown as KeyCard;
    for (let row = 0; row < 5; row++) {
      card.push(flat.slice(row * 5, row * 5 + 5) as KeyCardRow);
    }
    return card;
  };

  return { user: toKeyCard(userCard), ai: toKeyCard(aiCard) };
};

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
  const keyCards = generateRandomKeyCards();
  return {
    board: generateRandomBoard(),
    keyCards: {
      user: encrypt(keyCards.user),
      ai: keyCards.ai,
    },
    commentForAI: COMMENT_FOR_AI,
    whoIsSpyMaster: "ai",
    status: "running",
  };
};
