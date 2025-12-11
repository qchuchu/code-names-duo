import { initGame } from "@/lib/initGame";
import type { Game } from "@/lib/types";
import { useWidgetState } from "@/utils";
import { NEW_GAME_PROMPT } from "@/pages/constants";

export const GameOver = () => {
  const [_, setGame] = useWidgetState<Game>();

  const handleRestartGame = () => {
    window.openai.requestDisplayMode({ mode: "fullscreen" });
    const game = initGame();
    setGame(game);
    window.openai.sendFollowUpMessage({
      prompt: NEW_GAME_PROMPT,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-codenames-black">
      <div className="text-center mb-12">
        <h1 className="font-title text-7xl md:text-8xl text-codenames-cream tracking-wider drop-shadow-lg">
          GAME
        </h1>
        <h1 className="font-title text-7xl md:text-8xl text-codenames-cream tracking-wider drop-shadow-lg -mt-4">
          OVER
        </h1>
      </div>

      <p className="text-center text-codenames-cream/90 max-w-xl mb-12 text-lg leading-relaxed">
        The assassin was found! Better luck next time.
      </p>

      <button
        onClick={handleRestartGame}
        className="bg-codenames-yellow hover:bg-codenames-yellow/90 text-codenames-black font-bold text-2xl px-12 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 font-title tracking-wide cursor-pointer"
      >
        PLAY AGAIN
      </button>
    </div>
  );
};
