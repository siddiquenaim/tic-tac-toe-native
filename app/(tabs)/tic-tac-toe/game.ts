import { CELL_SIZE, WIN_LINES } from "./constants";
import {
  BotDifficulty,
  Cell,
  Mark,
  WinLine,
  WinOverlay,
  WinnerInfo,
} from "./types";

export function getWinnerLine(board: Cell[]): WinnerInfo | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const v = board[a];
    if (v && v === board[b] && v === board[c]) {
      return { winner: v, line };
    }
  }
  return null;
}

export function idxToRowCol(i: number) {
  return { row: Math.floor(i / 3), col: i % 3 };
}

export function lineToOverlay(line: WinLine): WinOverlay {
  const [a, , c] = line;
  const A = idxToRowCol(a);
  const C = idxToRowCol(c);

  const x1 = A.col * CELL_SIZE + CELL_SIZE / 2;
  const y1 = A.row * CELL_SIZE + CELL_SIZE / 2;
  const x2 = C.col * CELL_SIZE + CELL_SIZE / 2;
  const y2 = C.row * CELL_SIZE + CELL_SIZE / 2;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return { length, angle, midX, midY };
}

function getAvailableMoves(board: Cell[]) {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i += 1) {
    if (board[i] === null) moves.push(i);
  }
  return moves;
}

function evaluateBoard(board: Cell[], botMark: Mark, humanMark: Mark): number {
  const winnerInfo = getWinnerLine(board);
  if (!winnerInfo) return 0;
  if (winnerInfo.winner === botMark) return 1;
  if (winnerInfo.winner === humanMark) return -1;
  return 0;
}

function minimax(board: Cell[], maximizing: boolean, botMark: Mark, humanMark: Mark): number {
  const score = evaluateBoard(board, botMark, humanMark);
  if (score !== 0) return score;

  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return 0;

  if (maximizing) {
    let bestScore = -Infinity;
    for (const i of availableMoves) {
      board[i] = botMark;
      const nextScore = minimax(board, false, botMark, humanMark);
      board[i] = null;
      bestScore = Math.max(bestScore, nextScore);
    }
    return bestScore;
  }

  let bestScore = Infinity;
  for (const i of availableMoves) {
    board[i] = humanMark;
    const nextScore = minimax(board, true, botMark, humanMark);
    board[i] = null;
    bestScore = Math.min(bestScore, nextScore);
  }
  return bestScore;
}

function pickRandomMove(board: Cell[]): number | null {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return null;
  const idx = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[idx];
}

function pickBestMove(board: Cell[], botMark: Mark, humanMark: Mark): number | null {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return null;

  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const i of availableMoves) {
    board[i] = botMark;
    const score = minimax(board, false, botMark, humanMark);
    board[i] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
}

export function pickBotMove(
  board: Cell[],
  difficulty: BotDifficulty,
  botMark: Mark = "O",
  humanMark: Mark = "X",
): number | null {
  if (difficulty === "easy") {
    return pickRandomMove(board);
  }

  if (difficulty === "medium") {
    const shouldPlayBest = Math.random() < 0.7;
    return shouldPlayBest
      ? pickBestMove([...board], botMark, humanMark)
      : pickRandomMove(board);
  }

  return pickBestMove([...board], botMark, humanMark);
}
