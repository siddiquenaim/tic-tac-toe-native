import React from "react";
import { Animated, TouchableOpacity, Text, View } from "react-native";
import { CELL_SIZE, WIN_LINE_HEIGHT } from "../constants";
import { AppStyles } from "../styles";
import { Cell, WinOverlay } from "../types";

type Props = {
  board: Cell[];
  cellScales: Animated.Value[];
  onPressCell: (i: number) => void;
  winningSet: Set<number>;
  winner: "X" | "O" | null;
  winOverlay: WinOverlay | null;
  lineScaleX: Animated.AnimatedInterpolation<number>;
  burstScale: Animated.AnimatedInterpolation<number>;
  burstOpacity: Animated.AnimatedInterpolation<number>;
  boardLocked: boolean;
  styles: AppStyles;
};

export function GameBoard({
  board,
  cellScales,
  onPressCell,
  winningSet,
  winner,
  winOverlay,
  lineScaleX,
  burstScale,
  burstOpacity,
  boardLocked,
  styles,
}: Props) {
  return (
    <View style={styles.boardWrap}>
      {winner ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.burst,
            { opacity: burstOpacity, transform: [{ scale: burstScale }] },
          ]}
        />
      ) : null}

      <View style={styles.grid}>
        {board.map((cell, i) => {
          const isWinning = winningSet.has(i);
          const isX = cell === "X";
          const isO = cell === "O";

          return (
            <Animated.View
              key={i}
              style={[styles.cellWrap, { transform: [{ scale: cellScales[i] }] }]}
            >
              <TouchableOpacity
                activeOpacity={0.75}
                disabled={boardLocked || cell !== null || winner !== null}
                onPress={() => onPressCell(i)}
                style={[styles.cell, isWinning ? styles.cellWinning : null]}
              >
                <Text
                  style={[
                    styles.cellText,
                    isX ? styles.xText : null,
                    isO ? styles.oText : null,
                  ]}
                >
                  {cell ?? ""}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <View pointerEvents="none" style={styles.lines}>
        <View style={[styles.vLine, { left: CELL_SIZE }]} />
        <View style={[styles.vLine, { left: CELL_SIZE * 2 }]} />
        <View style={[styles.hLine, { top: CELL_SIZE }]} />
        <View style={[styles.hLine, { top: CELL_SIZE * 2 }]} />
      </View>

      {winner && winOverlay ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.winLine,
            {
              left: winOverlay.midX - winOverlay.length / 2,
              top: winOverlay.midY - WIN_LINE_HEIGHT / 2,
              width: winOverlay.length,
              transform: [
                { rotate: `${winOverlay.angle}deg` },
                { scaleX: lineScaleX },
              ],
            },
            winner === "X" ? styles.winLineX : styles.winLineO,
          ]}
        />
      ) : null}
    </View>
  );
}
