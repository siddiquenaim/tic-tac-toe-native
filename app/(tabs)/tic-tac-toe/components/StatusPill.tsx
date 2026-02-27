import React from "react";
import {
  Animated,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
import { AppStyles } from "../styles";

type Props = {
  statusText: string;
  statusPillStyle: StyleProp<ViewStyle>;
  winner: string | null;
  bannerScale: Animated.AnimatedInterpolation<number>;
  bannerGlow: Animated.AnimatedInterpolation<number>;
  styles: AppStyles;
};

export function StatusPill({
  statusText,
  statusPillStyle,
  winner,
  bannerScale,
  bannerGlow,
  styles,
}: Props) {
  return (
    <Animated.View
      style={[
        styles.pill,
        statusPillStyle,
        winner
          ? {
              transform: [{ scale: bannerScale }],
              shadowOpacity: bannerGlow,
            }
          : null,
      ]}
    >
      <Text style={styles.pillText}>{statusText}</Text>
    </Animated.View>
  );
}
