import { Platform, StyleSheet } from "react-native";
import {
  BOARD_SIZE,
  CELL_SIZE,
  LINE_THICKNESS,
  WIN_LINE_HEIGHT,
} from "./constants";

const titleFont = Platform.select({ ios: "Georgia", android: "serif" }) ?? "serif";
const bodyFont = Platform.select({ ios: "Avenir Next", android: "sans-serif" }) ?? "sans-serif";
const strongFont = Platform.select({ ios: "Avenir Next", android: "sans-serif-medium" }) ?? "sans-serif-medium";

export type ThemeName = "dark" | "light";

export const THEMES = {
  dark: {
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
    blob1: "rgba(124,92,255,0.28)",
    blob2: "rgba(52,211,153,0.18)",
    board: "rgba(0,0,0,0.18)",
    winLineX: "rgba(124,92,255,0.95)",
    winLineO: "rgba(52,211,153,0.95)",
    burst: "rgba(255,255,255,0.06)",
    burstBorder: "rgba(255,255,255,0.10)",
    themeToggleBg: "rgba(255,255,255,0.08)",
    themeToggleBorder: "rgba(255,255,255,0.14)",
    themeToggleText: "#EAF0FF",
    primaryBtnBg: "rgba(124,92,255,0.28)",
    primaryBtnBorder: "rgba(124,92,255,0.40)",
    modeActiveBg: "rgba(52,211,153,0.22)",
    modeActiveBorder: "rgba(52,211,153,0.45)",
    botActiveBg: "rgba(124,92,255,0.28)",
    botActiveBorder: "rgba(124,92,255,0.45)",
  },
  light: {
    bg: "#F4F7FF",
    card: "rgba(255,255,255,0.82)",
    cardBorder: "rgba(20,30,60,0.10)",
    text: "#13213D",
    muted: "rgba(19,33,61,0.68)",
    x: "#6246EA",
    o: "#0FA37F",
    line: "rgba(19,33,61,0.20)",
    win: "rgba(19,33,61,0.08)",
    pillX: "rgba(98,70,234,0.15)",
    pillO: "rgba(15,163,127,0.15)",
    pillWin: "rgba(19,33,61,0.12)",
    pillDraw: "rgba(255,184,0,0.18)",
    blob1: "rgba(98,70,234,0.16)",
    blob2: "rgba(15,163,127,0.14)",
    board: "rgba(255,255,255,0.9)",
    winLineX: "rgba(98,70,234,0.92)",
    winLineO: "rgba(15,163,127,0.92)",
    burst: "rgba(19,33,61,0.06)",
    burstBorder: "rgba(19,33,61,0.10)",
    themeToggleBg: "rgba(255,255,255,0.75)",
    themeToggleBorder: "rgba(19,33,61,0.15)",
    themeToggleText: "#13213D",
    primaryBtnBg: "rgba(98,70,234,0.18)",
    primaryBtnBorder: "rgba(98,70,234,0.34)",
    modeActiveBg: "rgba(15,163,127,0.16)",
    modeActiveBorder: "rgba(15,163,127,0.35)",
    botActiveBg: "rgba(98,70,234,0.16)",
    botActiveBorder: "rgba(98,70,234,0.35)",
  },
};

export type AppTheme = (typeof THEMES)[ThemeName];
export type AppStyles = ReturnType<typeof createStyles>;

export function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.bg },
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
      backgroundColor: theme.blob1,
    },
    bgBlob2: {
      position: "absolute",
      width: 420,
      height: 420,
      borderRadius: 420,
      right: -180,
      bottom: -160,
      backgroundColor: theme.blob2,
    },

    titleRow: {
      width: "100%",
      maxWidth: 420,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },

    h1: {
      fontSize: 38,
      fontWeight: "700",
      color: theme.text,
      letterSpacing: 0.4,
      fontFamily: titleFont,
    },

    themeToggle: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.themeToggleBorder,
      backgroundColor: theme.themeToggleBg,
    },
    themeToggleText: {
      color: theme.themeToggleText,
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.5,
      fontFamily: strongFont,
    },

    pill: {
      marginTop: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      backgroundColor: theme.pillWin,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 18,
      shadowOpacity: 0.18,
      elevation: 6,
    },
    pillText: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "700",
      letterSpacing: 0.2,
      fontFamily: strongFont,
    },
    pillX: { backgroundColor: theme.pillX },
    pillO: { backgroundColor: theme.pillO },
    pillWin: { backgroundColor: theme.pillWin },
    pillDraw: { backgroundColor: theme.pillDraw },

    card: {
      marginTop: 18,
      width: "100%",
      maxWidth: 420,
      borderRadius: 20,
      padding: 18,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    modeRow: {
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    modeLabel: {
      color: theme.muted,
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 0.3,
      fontFamily: strongFont,
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
      borderColor: theme.cardBorder,
      backgroundColor: "rgba(255,255,255,0.04)",
    },
    modeChipActive: {
      backgroundColor: theme.modeActiveBg,
      borderColor: theme.modeActiveBorder,
    },
    modeChipText: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.25,
      fontFamily: strongFont,
    },
    modeChipTextActive: {
      color: theme.text,
    },
    botRow: {
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    botLabel: {
      color: theme.muted,
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 0.3,
      fontFamily: strongFont,
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
      borderColor: theme.cardBorder,
      backgroundColor: "rgba(255,255,255,0.04)",
    },
    botChipActive: {
      backgroundColor: theme.botActiveBg,
      borderColor: theme.botActiveBorder,
    },
    botChipText: {
      color: theme.muted,
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.4,
      fontFamily: strongFont,
    },
    botChipTextActive: {
      color: theme.text,
    },

    boardWrap: {
      width: BOARD_SIZE,
      height: BOARD_SIZE,
      alignSelf: "center",
      position: "relative",
      borderRadius: 18,
      overflow: "hidden",
      backgroundColor: theme.board,
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
      backgroundColor: theme.win,
    },

    cellText: {
      fontSize: 62,
      fontWeight: "700",
      color: theme.text,
      fontFamily: titleFont,
      letterSpacing: 0.2,
    },
    xText: { color: theme.x },
    oText: { color: theme.o },

    lines: { position: "absolute", inset: 0 },
    vLine: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: LINE_THICKNESS,
      marginLeft: -(LINE_THICKNESS / 2),
      backgroundColor: theme.line,
    },
    hLine: {
      position: "absolute",
      left: 0,
      right: 0,
      height: LINE_THICKNESS,
      marginTop: -(LINE_THICKNESS / 2),
      backgroundColor: theme.line,
    },

    winLine: {
      position: "absolute",
      height: WIN_LINE_HEIGHT,
      borderRadius: 999,
    },
    winLineX: { backgroundColor: theme.winLineX },
    winLineO: { backgroundColor: theme.winLineO },

    burst: {
      position: "absolute",
      left: "50%",
      top: 10,
      width: 240,
      height: 240,
      marginLeft: -120,
      borderRadius: 240,
      backgroundColor: theme.burst,
      borderWidth: 1,
      borderColor: theme.burstBorder,
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
      borderColor: theme.cardBorder,
      alignItems: "center",
    },
    btnGhostText: { color: theme.text, fontWeight: "700", fontFamily: strongFont },

    btnPrimary: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: theme.primaryBtnBg,
      borderWidth: 1,
      borderColor: theme.primaryBtnBorder,
      alignItems: "center",
    },
    btnPrimaryText: { color: theme.text, fontWeight: "700", fontFamily: strongFont },

    tip: {
      marginTop: 14,
      color: theme.muted,
      fontSize: 13,
      textAlign: "center",
      lineHeight: 18,
      fontFamily: bodyFont,
    },
  });
}
