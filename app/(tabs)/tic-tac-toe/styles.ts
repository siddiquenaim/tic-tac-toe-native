import { StyleSheet } from "react-native";
import {
  BOARD_SIZE,
  CELL_SIZE,
  LINE_THICKNESS,
  WIN_LINE_HEIGHT,
} from "./constants";

export const COLORS = {
  bg: "#0B1220",
  card: "rgba(255,255,255,0.08)",
  cardBorder: "rgba(255,255,255,0.12)",
  text: "#EAF0FF",
  muted: "rgba(234,240,255,0.72)",
  x: "#7C5CFF",
  o: "#34D399",
  line: "rgba(234,240,255,0.26)",
  win: "rgba(255,255,255,0.12)",
  pillX: "rgba(124,92,255,0.22)",
  pillO: "rgba(52,211,153,0.22)",
  pillWin: "rgba(255,255,255,0.18)",
  pillDraw: "rgba(255,196,46,0.20)",
};

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    alignItems: "center",
  },

  bgBlob1: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 360,
    left: -140,
    top: -90,
    backgroundColor: "rgba(124,92,255,0.28)",
  },
  bgBlob2: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 420,
    right: -180,
    bottom: -160,
    backgroundColor: "rgba(52,211,153,0.18)",
  },

  h1: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: 0.3,
  },

  pill: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.pillWin,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    shadowOpacity: 0.25,
    elevation: 6,
  },
  pillText: { color: COLORS.text, fontSize: 15, fontWeight: "800" },
  pillX: { backgroundColor: COLORS.pillX },
  pillO: { backgroundColor: COLORS.pillO },
  pillWin: { backgroundColor: COLORS.pillWin },
  pillDraw: { backgroundColor: COLORS.pillDraw },

  card: {
    marginTop: 18,
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    padding: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modeRow: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  modeLabel: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "800",
  },
  modeModes: {
    flexDirection: "row",
    gap: 8,
  },
  modeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  modeChipActive: {
    backgroundColor: "rgba(52,211,153,0.22)",
    borderColor: "rgba(52,211,153,0.45)",
  },
  modeChipText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  modeChipTextActive: {
    color: COLORS.text,
  },
  botRow: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  botLabel: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "800",
  },
  botModes: {
    flexDirection: "row",
    gap: 8,
  },
  botChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  botChipActive: {
    backgroundColor: "rgba(124,92,255,0.28)",
    borderColor: "rgba(124,92,255,0.45)",
  },
  botChipText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  botChipTextActive: {
    color: COLORS.text,
  },

  boardWrap: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    alignSelf: "center",
    position: "relative",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.18)",
  },

  grid: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  cellWrap: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },

  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  cellWinning: {
    backgroundColor: COLORS.win,
  },

  cellText: { fontSize: 60, fontWeight: "900", color: COLORS.text },
  xText: { color: COLORS.x },
  oText: { color: COLORS.o },

  lines: { position: "absolute", inset: 0 },
  vLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: LINE_THICKNESS,
    marginLeft: -(LINE_THICKNESS / 2),
    backgroundColor: COLORS.line,
  },
  hLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: LINE_THICKNESS,
    marginTop: -(LINE_THICKNESS / 2),
    backgroundColor: COLORS.line,
  },

  winLine: {
    position: "absolute",
    height: WIN_LINE_HEIGHT,
    borderRadius: 999,
  },
  winLineX: { backgroundColor: "rgba(124,92,255,0.95)" },
  winLineO: { backgroundColor: "rgba(52,211,153,0.95)" },

  burst: {
    position: "absolute",
    left: "50%",
    top: 10,
    width: 240,
    height: 240,
    marginLeft: -120,
    borderRadius: 240,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  actionsRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },

  btnGhost: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
  },
  btnGhostText: { color: COLORS.text, fontWeight: "900" },

  btnPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(124,92,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(124,92,255,0.40)",
    alignItems: "center",
  },
  btnPrimaryText: { color: COLORS.text, fontWeight: "900" },

  tip: {
    marginTop: 14,
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
});
