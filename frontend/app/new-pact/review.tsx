import { useRouter } from "expo-router";
import FlowScreen from "../components/ui/flow-screen";
import DetailRow from "../components/ui/detail-row";
import Eyebrow from "../components/ui/eyebrow";
import { H2, Lede, Note } from "../components/ui/typography";
import { usePact } from "../../context/pact-store";
import { CHARITIES } from "../../constants/pact-config";
import { money } from "../../lib/format";
import { durationLabel, goalLabel, perDayLabel } from "../../lib/pact-math";

export default function ReviewScreen() {
  const router = useRouter();
  const { draft, commitDraft } = usePact();
  const { metric, goal, days, stake, charityId } = draft;

  const charityName =
    CHARITIES.find((c) => c.id === charityId)?.name ?? "charity";

  const rows = [
    { label: "Goal", value: goalLabel(metric, goal) },
    { label: "Length", value: durationLabel(days) },
    { label: "A day", value: perDayLabel(metric, goal, days) },
    { label: "Stake held", value: `$${stake}` },
    { label: "Shortfall goes to", value: charityName },
  ];

  return (
    <FlowScreen
      title="Review"
      step={4}
      ctaLabel="Start pact"
      onCta={() => {
        commitDraft();
        router.replace("/new-pact/done");
      }}
      fine="Cancel free within 24 hours. After that the stake is locked until the pact ends."
    >
      <H2>Beat yourself</H2>
      <Lede>Last look before anything is held.</Lede>

      {rows.map((row, i) => (
        <DetailRow
          key={row.label}
          label={row.label}
          value={row.value}
          last={i === rows.length - 1}
        />
      ))}

      <Eyebrow>The rule</Eyebrow>
      <Note>
        Finish and nothing is charged — the hold is released. Fall short and you
        are charged the same share you missed. Hit 80% of {goalLabel(metric, goal)}{" "}
        and {money(stake * 0.2)} goes to {charityName}; you keep{" "}
        {money(stake * 0.8)}.
      </Note>
    </FlowScreen>
  );
}
