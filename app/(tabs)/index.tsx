import { Audio } from "expo-av";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DifficultySelector } from "./tic-tac-toe/components/DifficultySelector";
import { GameBoard } from "./tic-tac-toe/components/GameBoard";
import { ModeSelector } from "./tic-tac-toe/components/ModeSelector";
import { StatusPill } from "./tic-tac-toe/components/StatusPill";
import { getWinnerLine, lineToOverlay, pickBotMove } from "./tic-tac-toe/game";
import { styles } from "./tic-tac-toe/styles";
import { BotDifficulty, Cell, GameMode } from "./tic-tac-toe/types";

export default function HomeScreen() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [mode, setMode] = useState<GameMode>("human");
  const [difficulty, setDifficulty] = useState<BotDifficulty>("medium");
  const [botThinking, setBotThinking] = useState(false);

  const tapSoundRef = useRef<Audio.Sound | null>(null);
  const winSoundRef = useRef<Audio.Sound | null>(null);
  const drawSoundRef = useRef<Audio.Sound | null>(null);
  const didEndSoundRef = useRef(false);
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const play = async (s: Audio.Sound | null) => {
    try {
      if (!s) return;
      await s.replayAsync();
    } catch {
      // ignore
    }
  };

  function clearBotTimer() {
    if (!botTimerRef.current) return;
    clearTimeout(botTimerRef.current);
    botTimerRef.current = null;
  }

  useEffect(() => {
    let mounted = true;

    async function loadSounds() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        const [tap, win, draw] = await Promise.all([
          Audio.Sound.createAsync(require("../../assets/sfx/tap.mp3"), {
            volume: 0.6,
          }),
          Audio.Sound.createAsync(require("../../assets/sfx/win.mp3"), {
            volume: 0.85,
          }),
          Audio.Sound.createAsync(require("../../assets/sfx/draw.mp3"), {
            volume: 0.85,
          }),
        ]);

        if (!mounted) {
          await tap.sound.unloadAsync();
          await win.sound.unloadAsync();
          await draw.sound.unloadAsync();
          return;
        }

        tapSoundRef.current = tap.sound;
        winSoundRef.current = win.sound;
        drawSoundRef.current = draw.sound;
      } catch (e) {
        console.log("[SFX] failed to load", e);
      }
    }

    loadSounds();

    return () => {
      mounted = false;
      clearBotTimer();
      tapSoundRef.current?.unloadAsync();
      winSoundRef.current?.unloadAsync();
      drawSoundRef.current?.unloadAsync();
      tapSoundRef.current = null;
      winSoundRef.current = null;
      drawSoundRef.current = null;
    };
  }, []);

  const cellScales = useRef(
    Array.from({ length: 9 }, () => new Animated.Value(1)),
  ).current;

  const winPulse = useRef(new Animated.Value(0)).current;
  const winLineAnim = useRef(new Animated.Value(0)).current;
  const burst = useRef(new Animated.Value(0)).current;

  const winInfo = useMemo(() => getWinnerLine(board), [board]);
  const winner = winInfo?.winner ?? null;
  const winnerLine = winInfo?.line ?? null;

  const isDraw = useMemo(
    () => !winner && board.every((c) => c !== null),
    [board, winner],
  );

  useEffect(() => {
    if (winner && !didEndSoundRef.current) {
      didEndSoundRef.current = true;
      play(winSoundRef.current);
    } else if (isDraw && !didEndSoundRef.current) {
      didEndSoundRef.current = true;
      play(drawSoundRef.current);
    } else if (!winner && !isDraw) {
      didEndSoundRef.current = false;
    }
  }, [winner, isDraw]);

  const statusText = winner
    ? `${winner} wins!`
    : isDraw
      ? "It's a draw!"
      : mode === "ai"
        ? botThinking
          ? `Bot (${difficulty.toUpperCase()}) is thinking...`
          : xIsNext
            ? "Your turn (X)"
            : "Bot turn (O)"
        : `Turn: ${xIsNext ? "X" : "O"}`;

  const statusPillStyle = winner
    ? styles.pillWin
    : isDraw
      ? styles.pillDraw
      : xIsNext
        ? styles.pillX
        : styles.pillO;

  function pressPop(i: number) {
    const v = cellScales[i];
    v.setValue(1);
    Animated.sequence([
      Animated.timing(v, {
        toValue: 0.92,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(v, {
        toValue: 1,
        friction: 4,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function reset() {
    clearBotTimer();
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setBotThinking(false);

    didEndSoundRef.current = false;

    winPulse.setValue(0);
    winLineAnim.setValue(0);
    burst.setValue(0);

    for (const s of cellScales) s.setValue(1);
  }

  function newRound() {
    clearBotTimer();
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setBotThinking(false);

    didEndSoundRef.current = false;

    winLineAnim.setValue(0);
    winPulse.setValue(0);
    burst.setValue(0);

    for (const s of cellScales) s.setValue(1);
  }

  function onPressCell(i: number) {
    if (winner || board[i]) return;
    if (mode === "ai" && (!xIsNext || botThinking)) return;

    play(tapSoundRef.current);
    pressPop(i);

    setBoard((prev) => {
      const next = [...prev];
      next[i] = mode === "ai" ? "X" : xIsNext ? "X" : "O";
      return next;
    });

    setXIsNext((prev) => {
      if (mode === "ai") return false;
      return !prev;
    });
  }

  function onChangeMode(nextMode: GameMode) {
    if (nextMode === mode) return;
    setMode(nextMode);
    newRound();
  }

  function onChangeDifficulty(nextDifficulty: BotDifficulty) {
    if (nextDifficulty === difficulty) return;
    setDifficulty(nextDifficulty);
    if (mode === "ai") newRound();
  }

  useEffect(() => {
    if (!winner) return;

    winPulse.setValue(0);
    winLineAnim.setValue(0);
    burst.setValue(0);

    Animated.parallel([
      Animated.timing(winLineAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(winPulse, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(winPulse, {
            toValue: 0,
            duration: 420,
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.timing(burst, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [winner, winPulse, winLineAnim, burst]);

  useEffect(() => {
    if (mode !== "ai") {
      setBotThinking(false);
      clearBotTimer();
      return;
    }

    if (xIsNext || winner || isDraw) {
      setBotThinking(false);
      clearBotTimer();
      return;
    }

    setBotThinking(true);
    clearBotTimer();

    botTimerRef.current = setTimeout(() => {
      const move = pickBotMove(board, difficulty, "O", "X");
      setBotThinking(false);
      if (move === null) return;

      play(tapSoundRef.current);
      pressPop(move);
      setBoard((prev) => {
        if (prev[move] !== null || getWinnerLine(prev)) return prev;
        const next = [...prev];
        next[move] = "O";
        return next;
      });
      setXIsNext(true);
      botTimerRef.current = null;
    }, 420);

    return () => {
      clearBotTimer();
    };
  }, [board, difficulty, isDraw, mode, winner, xIsNext]);

  const winOverlay = useMemo(() => {
    if (!winnerLine) return null;
    return lineToOverlay(winnerLine);
  }, [winnerLine]);

  const bannerScale = winPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  const bannerGlow = winPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.6],
  });

  const lineScaleX = winLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const burstScale = burst.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1.15],
  });

  const burstOpacity = burst.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const winningSet = useMemo(() => {
    if (!winnerLine) return new Set<number>();
    return new Set(winnerLine);
  }, [winnerLine]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View pointerEvents="none" style={styles.bgBlob1} />
      <View pointerEvents="none" style={styles.bgBlob2} />

      <View style={styles.container}>
        <Text style={styles.h1}>Tic Tac Toe</Text>

        <StatusPill
          statusText={statusText}
          statusPillStyle={statusPillStyle}
          winner={winner}
          bannerScale={bannerScale}
          bannerGlow={bannerGlow}
        />

        <View style={styles.card}>
          <ModeSelector mode={mode} onChange={onChangeMode} />
          {mode === "ai" ? (
            <DifficultySelector
              difficulty={difficulty}
              onChange={onChangeDifficulty}
            />
          ) : null}

          <GameBoard
            board={board}
            cellScales={cellScales}
            onPressCell={onPressCell}
            winningSet={winningSet}
            winner={winner}
            winOverlay={winOverlay}
            lineScaleX={lineScaleX}
            burstScale={burstScale}
            burstOpacity={burstOpacity}
            boardLocked={mode === "ai" && (!xIsNext || botThinking)}
          />

          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={reset}
              style={styles.btnGhost}
            >
              <Text style={styles.btnGhostText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={newRound}
              style={styles.btnPrimary}
            >
              <Text style={styles.btnPrimaryText}>New Round</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.tip}>
            {mode === "ai" ? "Play as X. Bot plays O." : "Pass and play: X vs O."}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
