export type Cell = "X" | "O" | null;
export type Mark = Exclude<Cell, null>;
export type BotDifficulty = "easy" | "medium" | "hard";
export type GameMode = "human" | "ai";

export type WinLine = [number, number, number];

export type WinnerInfo = { winner: Mark; line: WinLine };

export type WinOverlay = {
  length: number;
  angle: number;
  midX: number;
  midY: number;
};
