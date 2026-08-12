import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Eyebrow from "../components/ui/eyebrow";
import ProgressBar from "../components/ui/progress-bar";
import { colors, spacing } from "../../constants/theme";
import { money, num } from "../../lib/format";
import { getCurrentUserId } from "../../lib/session";
import {
  getProfile,
  getPactHistory,
  type Profile,
  type PactHistoryRow,
} from "../../lib/api";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<PactHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const userId = getCurrentUserId();
    try {
      setError(null);
      const [p, h] = await Promise.all([
        getProfile(userId),
        getPactHistory(userId),
      ]);
      setProfile(p);
      setHistory(h);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const initials = (profile?.name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            tintColor={colors.white}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name}>{profile?.name ?? "—"}</Text>
            <Text style={styles.sub}>
              {profile ? `${num(profile.dailyStepGoal)} steps a day` : ""}
            </Text>
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Eyebrow>Record</Eyebrow>
        <View style={styles.statRow}>
          <Stat
            label="Pacts"
            value={profile ? String(profile.pactsTotal) : "—"}
          />
          <Stat
            label="Finished"
            value={profile ? String(profile.pactsCompleted) : "—"}
          />
          <Stat
            label="Kept"
            value={profile ? money(profile.totalKept) : "—"}
            tint={colors.green}
          />
          <Stat
            label="To charity"
            value={profile ? money(profile.totalForfeited) : "—"}
            tint={colors.orange}
          />
        </View>

        <Eyebrow>All time</Eyebrow>
        <View style={styles.bigCard}>
          <Text style={styles.bigValue}>
            {profile ? num(profile.stepsAllTime) : "—"}
          </Text>
          <Text style={styles.bigLabel}>steps recorded</Text>
        </View>

        <Eyebrow>Past pacts</Eyebrow>
        {history.length === 0 && !loading ? (
          <Text style={styles.empty}>No pacts yet.</Text>
        ) : null}

        {history.map((h) => (
          <View key={h.gameweekId} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{h.name}</Text>
              <Text
                style={[
                  styles.badge,
                  h.status === "active"
                    ? styles.badgeActive
                    : h.forfeited > 0
                      ? styles.badgeMissed
                      : styles.badgeDone,
                ]}
              >
                {h.status === "active"
                  ? "Active"
                  : h.forfeited > 0
                    ? "Missed"
                    : "Finished"}
              </Text>
            </View>

            <ProgressBar progress={h.progressPct} top={14} />

            <View style={styles.cardFooter}>
              <Text style={styles.cardMeta}>
                {h.progressPct}% · {h.charityName ?? "no charity"}
              </Text>
              <Text
                style={[
                  styles.cardAmount,
                  { color: h.forfeited > 0 ? colors.orange : colors.green },
                ]}
              >
                {h.forfeited > 0
                  ? `${money(h.forfeited)} given`
                  : `${money(h.stakeAmount)} kept`}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint?: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, tint ? { color: tint } : null]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingTop: 18,
    paddingBottom: 4,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { color: colors.white, fontSize: 19, fontWeight: "400" },
  headerText: { flex: 1 },
  name: { color: colors.white, fontSize: 21, fontWeight: "400" },
  sub: { color: colors.gray, fontSize: 13, marginTop: 3 },
  error: { color: colors.orange, fontSize: 12.5, marginTop: 10 },
  statRow: { flexDirection: "row", gap: 10 },
  stat: {
    flex: 1,
    backgroundColor: colors.cardSoft,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  statValue: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "400",
    fontVariant: ["tabular-nums"],
  },
  statLabel: { color: colors.dim, fontSize: 10, marginTop: 5 },
  bigCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
  },
  bigValue: {
    color: colors.white,
    fontSize: 38,
    fontWeight: "200",
    letterSpacing: -1,
    fontVariant: ["tabular-nums"],
  },
  bigLabel: { color: colors.gray, fontSize: 13, marginTop: 4 },
  empty: { color: colors.gray, fontSize: 13 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardTitle: { color: colors.white, fontSize: 15, flex: 1 },
  badge: {
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeActive: { color: colors.green, backgroundColor: colors.greenDark },
  badgeDone: { color: colors.green, backgroundColor: colors.greenDark },
  badgeMissed: { color: colors.orange, backgroundColor: "#2A1505" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  cardMeta: { color: colors.gray, fontSize: 12 },
  cardAmount: { fontSize: 12, fontWeight: "500" },
});