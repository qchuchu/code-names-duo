import { mountWidget } from "skybridge/web";
import { StartGame } from "../pages/StartGame";
import { GamePage } from "../pages/Game";
import "../index.css";
import type { Game } from "@/lib/types";
import { useWidgetState } from "@/utils";

const PlayWidget = () => {
  const [game] = useWidgetState<Game>();
  if (!game) return <StartGame />;
  return <GamePage />;
};

export default PlayWidget;

mountWidget(<PlayWidget />);
