import { mountWidget } from "skybridge/web";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { StartGame } from "../pages/StartGame";
import { Game } from "../pages/Game";
import "../index.css";

const PlayWidget = () => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<StartGame />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </MemoryRouter>
  );
};

export default PlayWidget;

mountWidget(<PlayWidget />);
