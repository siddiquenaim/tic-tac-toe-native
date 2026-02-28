import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Easing,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DifficultySelector } from "./tic-tac-toe/components/DifficultySelector";
import { GameBoard } from "./tic-tac-toe/components/GameBoard";
import { ModeSelector } from "./tic-tac-toe/components/ModeSelector";
import { StatusPill } from "./tic-tac-toe/components/StatusPill";
import { getWinnerLine, lineToOverlay, pickBotMove } from "./tic-tac-toe/game";
import { createStyles, ThemeName, THEMES } from "./tic-tac-toe/styles";
import { BotDifficulty, Cell, GameMode } from "./tic-tac-toe/types";

const SETTINGS_KEY = "tic-tac-toe:settings";

type StoredSettings = {
  themeName: ThemeName;
  mode: GameMode;
  difficulty: BotDifficulty;
  musicEnabled: boolean;
};

function isThemeName(value: unknown): value is ThemeName {
  return value === "dark" || value === "light";
}

function isGameMode(value: unknown): value is GameMode {
  return value === "human" || value === "ai";
}

function isBotDifficulty(value: unknown): value is BotDifficulty {
  return value === "easy" || value === "medium" || value === "hard";
}

export default function HomeScreen() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [mode, setMode] = useState<GameMode>("human");
  const [difficulty, setDifficulty] = useState<BotDifficulty>("medium");
  const [themeName, setThemeName] = useState<ThemeName>("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [introVisible, setIntroVisible] = useState(true);
  const [botThinking, setBotThinking] = useState(false);
  const [botStartsNextRound, setBotStartsNextRound] = useState(false);
  const [settingsReady, setSettingsReady] = useState(false);
  const styles = useMemo(() => createStyles(THEMES[themeName]), [themeName]);

  const tapSoundRef = useRef<Audio.Sound | null>(null);
  const winSoundRef = useRef<Audio.Sound | null>(null);
  const drawSoundRef = useRef<Audio.Sound | null>(null);
  const didEndSoundRef = useRef(false);
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const introOpacity = useRef(new Animated.Value(1)).current;
  const introScale = useRef(new Animated.Value(0.92)).current;

  const play = async (s: Audio.Sound | null) => {
    try {
      if (!s || !musicEnabled) return;
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
    async function loadSettings() {
      try {
        const raw = await AsyncStorage.getItem(SETTINGS_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw) as Partial<StoredSettings>;

        if (isThemeName(parsed.themeName)) {
          setThemeName(parsed.themeName);
        }
        if (isGameMode(parsed.mode)) {
          setMode(parsed.mode);
        }
        if (isBotDifficulty(parsed.difficulty)) {
          setDifficulty(parsed.difficulty);
        }
        if (typeof parsed.musicEnabled === "boolean") {
          setMusicEnabled(parsed.musicEnabled);
        }
      } catch (e) {
        console.log("[Settings] failed to load", e);
      } finally {
        setSettingsReady(true);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    if (!settingsReady) return;

    const payload: StoredSettings = {
      themeName,
      mode,
      difficulty,
      musicEnabled,
    };

    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(payload)).catch((e) => {
      console.log("[Settings] failed to save", e);
    });
  }, [difficulty, mode, musicEnabled, settingsReady, themeName]);

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

  useEffect(() => {
    if (!settingsReady) return;

    introOpacity.setValue(1);
    introScale.setValue(0.92);

    Animated.spring(introScale, {
      toValue: 1,
      friction: 6,
      tension: 90,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(introOpacity, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(introScale, {
          toValue: 1.06,
          duration: 420,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => setIntroVisible(false));
    }, 950);

    return () => {
      clearTimeout(timeout);
    };
  }, [introOpacity, introScale, settingsReady]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function startRound(
    targetMode: GameMode = mode,
    nextBotStarts: boolean = botStartsNextRound,
  ) {
    clearBotTimer();
    setBoard(Array(9).fill(null));
    setBotThinking(false);
    if (targetMode === "ai") {
      setXIsNext(!nextBotStarts);
      setBotStartsNextRound(!nextBotStarts);
    } else {
      setXIsNext(true);
    }

    didEndSoundRef.current = false;

    winPulse.setValue(0);
    winLineAnim.setValue(0);
    burst.setValue(0);

    for (const s of cellScales) s.setValue(1);
  }

  function reset() {
    startRound();
  }

  function newRound() {
    startRound();
  }

  function onPressCell(i: number) {
    if (winner || board[i] || introVisible) return;
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
    startRound(nextMode, false);
  }

  function onChangeDifficulty(nextDifficulty: BotDifficulty) {
    if (nextDifficulty === difficulty) return;
    setDifficulty(nextDifficulty);
    if (mode === "ai") newRound();
  }

  function exitApp() {
    setMenuOpen(false);
    BackHandler.exitApp();
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

    if (xIsNext || winner || isDraw || introVisible) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, difficulty, introVisible, isDraw, mode, winner, xIsNext]);

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
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.h1}>Tic Tac Toe</Text>
            {/* <Text style={styles.subtitle}>One screen. No bottom nav.</Text> */}
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setMenuOpen(true)}
            style={styles.menuButton}
          >
            <View style={styles.menuBars}>
              <View style={styles.menuBar} />
              <View style={styles.menuBar} />
              <View style={styles.menuBar} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.contentArea}>
          <StatusPill
            statusText={statusText}
            statusPillStyle={statusPillStyle}
            winner={winner}
            bannerScale={bannerScale}
            bannerGlow={bannerGlow}
            styles={styles}
          />

          <View style={styles.card}>
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
              boardLocked={
                introVisible || (mode === "ai" && (!xIsNext || botThinking))
              }
              styles={styles}
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
              {mode === "ai"
                ? "Play as X. Bot plays O."
                : "Pass and play: X vs O."}
            </Text>
          </View>
        </View>
      </View>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={styles.menuBackdrop}>
          <Pressable
            style={styles.menuDismissZone}
            onPress={() => setMenuOpen(false)}
          />
          <View style={styles.menuSheetWrap}>
            <View style={styles.menuSheet}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Settings</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setMenuOpen(false)}
                  style={styles.menuClose}
                >
                  <Text style={styles.menuCloseText}>X</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Theme:</Text>
                <View style={styles.toggleGroup}>
                  {(["dark", "light"] as ThemeName[]).map((option) => {
                    const active = themeName === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        activeOpacity={0.8}
                        onPress={() => setThemeName(option)}
                        style={[
                          styles.toggleChip,
                          active ? styles.toggleChipActive : null,
                        ]}
                      >
                        <Text
                          style={[
                            styles.toggleChipText,
                            active ? styles.toggleChipTextActive : null,
                          ]}
                        >
                          {option.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Music:</Text>
                <View style={styles.toggleGroup}>
                  {[
                    { label: "ON", value: true },
                    { label: "OFF", value: false },
                  ].map((option) => {
                    const active = musicEnabled === option.value;
                    return (
                      <TouchableOpacity
                        key={option.label}
                        activeOpacity={0.8}
                        onPress={() => setMusicEnabled(option.value)}
                        style={[
                          styles.toggleChip,
                          active ? styles.toggleChipActive : null,
                        ]}
                      >
                        <Text
                          style={[
                            styles.toggleChipText,
                            active ? styles.toggleChipTextActive : null,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <ModeSelector
                mode={mode}
                onChange={onChangeMode}
                styles={styles}
              />
              {mode === "ai" ? (
                <DifficultySelector
                  difficulty={difficulty}
                  onChange={onChangeDifficulty}
                  styles={styles}
                />
              ) : null}

              <Text style={styles.menuTip}>
                Changes apply immediately. Switching game mode or AI difficulty
                starts a fresh round.
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={exitApp}
                style={styles.exitButton}
              >
                <Text style={styles.exitButtonText}>Exit App</Text>
              </TouchableOpacity>

              <Text style={styles.menuFooter}>
                All rights reserved by NS Hamza
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {introVisible ? (
        <Animated.View
          pointerEvents="auto"
          style={[
            styles.introOverlay,
            {
              opacity: introOpacity,
              transform: [{ scale: introScale }],
            },
          ]}
        >
          <View pointerEvents="none" style={styles.introGlow} />
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Tic Tac Toe</Text>
            <View style={styles.introMarks}>
              <Text style={styles.introMarkX}>X</Text>
              <View style={styles.introDash} />
              <Text style={styles.introMarkO}>O</Text>
            </View>
            <Text style={styles.introCaption}>Ready for the next round</Text>
          </View>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}
