import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../constants/theme";

/**
 * Generated avatars.
 *
 * Each user picks a SEED (a short key). The seed maps to a gradient and a
 * shape treatment, rendered on device — no upload, no storage bucket, no
 * network call. That means it cannot fail on stage, and every user still
 * looks distinct.
 *
 * If a user has no seed, one is derived from their id so they still get a
 * consistent look rather than a grey circle.
 */

export type AvatarSeed = keyof typeof PALETTES;

export const PALETTES = {
  aurora: ["#00E07A", "#00A3FF"],
  ember: ["#FF8534", "#FF2D55"],
  violet: ["#A855F7", "#4F46E5"],
  mint: ["#5EEAD4", "#00E07A"],
  dusk: ["#F472B6", "#A855F7"],
  slate: ["#64748B", "#1E293B"],
  gold: ["#FDE047", "#FF8534"],
  deep: ["#0EA5E9", "#1E1B4B"],
} as const;

export const SEEDS = Object.keys(PALETTES) as AvatarSeed[];

/** Stable pick from a user id, so no-seed users still look intentional. */
export function seedFromId(id: string): AvatarSeed {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return SEEDS[h % SEEDS.length];
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Avatar({
  name,
  seed,
  size = 54,
  selected = false,
}: {
  name: string;
  seed?: string | null;
  size?: number;
  selected?: boolean;
}) {
  const key: AvatarSeed =
    seed && seed in PALETTES ? (seed as AvatarSeed) : seedFromId(name || "?");

  const colorsPair = PALETTES[key];

  return (
    <LinearGradient
      colors={colorsPair}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        selected && styles.selected,
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.34 }]}>
        {initialsOf(name || "?")}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    borderWidth: 2.5,
    borderColor: colors.white,
  },
  initials: {
    color: "#00160C",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});