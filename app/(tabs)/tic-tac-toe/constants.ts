import { WinLine } from "./types";

export const BOARD_SIZE = 312;
export const CELL_SIZE = BOARD_SIZE / 3;
export const LINE_THICKNESS = 7;
export const WIN_LINE_HEIGHT = 10;

export const WIN_LINES: WinLine[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
