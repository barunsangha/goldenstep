import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import FlowScreen from "../components/ui/flow-screen";
import OptionCard from "../components/ui/option-card";
import { H2, Lede } from "../components/ui/typography";
import { usePact } from "../../context/pact-store";
import { CHARITIES } from "../../constants/pact-config";
import { getCharities, type Charity } from "../../lib/api";
import { colors } from "../../constants/theme";

/** Display copy still lives locally; ids now come from the database. */
const metaFor = (slug: string) =>
  CHARITIES.find((c) => c.id === slug)?.meta ?? "";

export default function CharityScreen() {
  const router = useRouter();
  const { draft, updateDraft } = usePact();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCharities()
      .then((rows) => {
        setCharities(rows);
        // draft.charityId starts as a slug; swap it for a real uuid.
        const match =
          rows.find((r) => r.slug === draft.charityId) ?? rows[0];
        if (match) updateDraft({ charityId: match.id });
      })
      .catch((e) => setError(String(e?.message ?? e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlowScreen
      title="Beat yourself"
      step={2}
      ctaLabel="Continue"
      onCta={() => router.push("/new-pact/stake")}
    >
      <H2>Who gets the shortfall?</H2>
      <Lede>
        Finish and nothing moves. Fall short and the missed portion goes here.
      </Lede>

      {error ? (
        <Text style={{ color: colors.orange, fontSize: 13 }}>{error}</Text>
      ) : null}

      {charities.map((charity) => (
        <OptionCard
          key={charity.id}
          title={charity.name}
          description={metaFor(charity.slug)}
          selected={charity.id === draft.charityId}
          onPress={() => updateDraft({ charityId: charity.id })}
        />
      ))}
    </FlowScreen>
  );
}