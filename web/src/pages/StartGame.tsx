import { useNavigate } from "react-router-dom";

export const StartGame = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    window.openai.requestDisplayMode({ mode: "pip" });
    navigate("/game");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-codenames-green-dark">
      <div className="text-center mb-12">
        <h1 className="font-title text-7xl md:text-8xl text-codenames-cream tracking-wider drop-shadow-lg">CODE</h1>
        <h1 className="font-title text-7xl md:text-8xl text-codenames-cream tracking-wider drop-shadow-lg -mt-4">
          NAMES
        </h1>
        <div className="bg-codenames-purple px-8 py-2 rounded-lg mt-2 inline-block shadow-lg">
          <span className="font-title text-4xl md:text-5xl text-codenames-yellow tracking-widest">DUO</span>
        </div>
      </div>

      <p className="text-center text-codenames-cream/90 max-w-xl mb-12 text-lg leading-relaxed">
        <span className="font-bold text-codenames-yellow">Codenames Duo</span> is a cooperative game for 2 players (or
        more) where you must find all your Codenames before time runs out.
      </p>

      <button
        onClick={handleStartGame}
        className="bg-codenames-yellow hover:bg-codenames-yellow/90 text-codenames-black font-bold text-2xl px-12 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 font-title tracking-wide cursor-pointer"
      >
        PLAY
      </button>
    </div>
  );
};
