import { mountWidget } from "skybridge/web";
import { StartGame } from "../pages/StartGame";
import { GamePage } from "../pages/Game";
import { GameOver } from "../pages/GameOver";
import "../index.css";
import type { Game } from "@/lib/types";
import { useWidgetState } from "@/utils";

const PlayWidget = () => {
  const [game] = useWidgetState<Game>();
  if (!game) return <StartGame />;
  if (game.status === "gameOver") return <GameOver />;
  return <GamePage />;
};

export default PlayWidget;

mountWidget(<PlayWidget />);
