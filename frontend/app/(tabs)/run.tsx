import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  AppState,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProgressBar from "../components/ui/progress-bar";
import Eyebrow from "../components/ui/eyebrow";
import { colors, spacing } from "../../constants/theme";
import { money, num } from "../../lib/format";
import { usePact } from "../../context/pact-store";
import {
  getStepsToday,
  isPedometerAvailable,
  watchSteps,
} from "../../lib/health";
import { pctComplete } from "../../lib/pact-math";

type SyncState = "idle" | "syncing" | "done" | "failed";

export default function RunScreen() {
  const router = useRouter();
  const { activePact, today, refresh, error } = usePact();

  const [steps, setSteps] = useState<number | null>(null);
  const [live, setLive] = useState(0);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [sync, setSync] = useState<SyncState>("idle");
  const baseline = useRef<number>(0);

  /** Read the day's total, then watch for live increments on top of it. */
  const start = useCallback(async () => {
    const ok = await isPedometerAvailable();
    setAvailable(ok);

    const total = await getStepsToday();
    baseline.current = total;
    setSteps(total);
  }, []);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    const stop = watchSteps((s) => {
      setLive(s);
      setSteps(baseline.current + s);
    });
    return stop;
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") start();
    });
    return () => sub.remove();
  }, [start]);

  /**
   * Manual sync. The live counter is device-local until this runs — this is
   * what actually writes today's steps into `runs` and re-reads progress.
   * Safe to press repeatedly: syncSteps upserts on external_id.
   */
  const onSync = useCallback(async () => {
    if (sync === "syncing") return;
    setSync("syncing");

    try {
      await start();
      await refresh();
      // Live increments are now folded into the stored total.
      setLive(0);
      setSync("done");
      setTimeout(() => setSync("idle"), 2200);
    } catch {
      setSync("failed");
      setTimeout(() => setSync("idle"), 3000);
    }
  }, [sync, start, refresh]);

  const goal = today?.goal ?? 10000;
  const shown = steps ?? 0;
  const progress = pctComplete(shown, goal);
  const remaining = Math.max(goal - shown, 0);

  const syncLabel =
    sync === "syncing"
      ? "Syncing…"
      : sync === "done"
        ? "Synced"
        : sync === "failed"
          ? "Sync failed"
          : "Sync now";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-down" size={24} color={colors.gray} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Eyebrow top={0}>Walking now</Eyebrow>

        <View style={styles.countRow}>
          <Text style={styles.count}>{steps === null ? "—" : num(shown)}</Text>
          <Text style={styles.unit}>steps</Text>
        </View>

        <ProgressBar progress={progress} top={22} />

        <View style={styles.footer}>
          <Text style={styles.meta}>
            {remaining > 0
              ? `${num(remaining)} to today's goal`
              : "Daily goal hit"}
          </Text>
          <Text style={styles.meta}>{num(goal)} goal</Text>
        </View>

        {live > 0 ? (
          <Text style={styles.live}>
            +{num(live)} since you opened this — not saved yet
          </Text>
        ) : null}

        {available === false ? (
          <Text style={styles.warn}>
            No pedometer here — this device or browser can&apos;t count steps.
            Numbers shown are a placeholder.
          </Text>
        ) : null}

        {sync === "failed" && error ? (
          <Text style={styles.warn}>{error}</Text>
        ) : null}

        {activePact ? (
          <View style={styles.pactCard}>
            <Text style={styles.pactLabel}>Counting toward</Text>
            <Text style={styles.pactName}>{activePact.name}</Text>
            <ProgressBar
              progress={pctComplete(activePact.current, activePact.goal)}
              top={14}
            />
            <View style={styles.footer}>
              <Text style={styles.meta}>
                {num(activePact.current)} of {num(activePact.goal)}
              </Text>
              <Text style={styles.atRisk}>
                {money(activePact.atRisk)} at risk
              </Text>
            </View>
          </View>
        ) : null}

        <Pressable
          onPress={onSync}
          disabled={sync === "syncing"}
          style={({ pressed }) => [
            styles.sync,
            sync === "done" && styles.syncDone,
            sync === "failed" && styles.syncFailed,
            pressed && styles.pressed,
          ]}
        >
          {sync === "syncing" ? (
            <ActivityIndicator size="small" color={colors.greenDark} />
          ) : (
            <Ionicons
              name={
                sync === "done"
                  ? "checkmark"
                  : sync === "failed"
                    ? "alert-circle"
                    : "refresh"
              }
              size={16}
              color={sync === "failed" ? colors.white : colors.greenDark}
            />
          )}
          <Text
            style={[
              styles.syncText,
              sync === "failed" && { color: colors.white },
            ]}
          >
            {syncLabel}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },
  nav: {
    paddingHorizontal: spacing.screen,
    paddingTop: 6,
    paddingBottom: 4,
  },
  body: { flex: 1, paddingHorizontal: spacing.screen, paddingTop: 10 },
  countRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 9,
    marginTop: 14,
  },
  count: {
    fontSize: 64,
    fontWeight: "200",
    letterSpacing: -2,
    lineHeight: 64,
    color: colors.white,
    fontVariant: ["tabular-nums"],
  },
  unit: { fontSize: 15, color: colors.gray },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  meta: { fontSize: 12.5, color: colors.gray },
  atRisk: { fontSize: 12.5, color: colors.orange, fontWeight: "500" },
  live: { color: colors.green, fontSize: 12.5, marginTop: 14 },
  warn: {
    color: colors.orange,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 16,
  },
  pactCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginTop: 30,
  },
  pactLabel: {
    fontSize: 10.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.dim,
  },
  pactName: { color: colors.white, fontSize: 16, marginTop: 8 },
  sync: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.green,
    borderRadius: 28,
    paddingVertical: 15,
    marginTop: "auto",
    marginBottom: 24,
  },
  syncDone: { backgroundColor: colors.green },
  syncFailed: { backgroundColor: colors.orange },
  pressed: { opacity: 0.9 },
  syncText: { color: colors.greenDark, fontSize: 15, fontWeight: "500" },
});