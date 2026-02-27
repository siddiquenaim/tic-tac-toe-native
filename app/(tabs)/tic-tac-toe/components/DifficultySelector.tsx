import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AppStyles } from "../styles";
import { BotDifficulty } from "../types";

type Props = {
  difficulty: BotDifficulty;
  onChange: (difficulty: BotDifficulty) => void;
  styles: AppStyles;
};

const OPTIONS: BotDifficulty[] = ["easy", "medium", "hard"];

export function DifficultySelector({ difficulty, onChange, styles }: Props) {
  return (
    <View style={styles.botRow}>
      <Text style={styles.botLabel}>Bot:</Text>
      <View style={styles.botModes}>
        {OPTIONS.map((option) => {
          const active = option === difficulty;
          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.8}
              onPress={() => onChange(option)}
              style={[styles.botChip, active ? styles.botChipActive : null]}
            >
              <Text
                style={[styles.botChipText, active ? styles.botChipTextActive : null]}
              >
                {option.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
