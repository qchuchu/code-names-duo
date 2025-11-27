import { mountWidget } from "skybridge/web";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { StartGame } from "../pages/StartGame";
import { GamePage } from "../pages/Game";
import "../index.css";
import type { Game } from "@/lib/types";
import { useWidgetState } from "@/utils";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const InitialRouteSetter = () => {
  const [game] = useWidgetState<Game>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (game && location.pathname === "/") {
      navigate("/game", { replace: true });
    }
    if (!game && location.pathname === "/game") {
      navigate("/", { replace: true });
    }
  }, [game, location.pathname, navigate]);

  return null;
};

const PlayWidget = () => {
  return (
    <MemoryRouter>
      <InitialRouteSetter />
      <Routes>
        <Route path="/" element={<StartGame />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </MemoryRouter>
  );
};

export default PlayWidget;

mountWidget(<PlayWidget />);
