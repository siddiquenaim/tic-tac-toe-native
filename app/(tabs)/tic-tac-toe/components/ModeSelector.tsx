import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AppStyles } from "../styles";
import { GameMode } from "../types";

type Props = {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
  styles: AppStyles;
};

const OPTIONS: { value: GameMode; label: string }[] = [
  { value: "human", label: "2 Players" },
  { value: "ai", label: "vs AI" },
];

export function ModeSelector({ mode, onChange, styles }: Props) {
  return (
    <View style={styles.modeRow}>
      <Text style={styles.modeLabel}>Mode:</Text>
      <View style={styles.modeModes}>
        {OPTIONS.map((option) => {
          const active = option.value === mode;
          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.8}
              onPress={() => onChange(option.value)}
              style={[styles.modeChip, active ? styles.modeChipActive : null]}
            >
              <Text
                style={[
                  styles.modeChipText,
                  active ? styles.modeChipTextActive : null,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
