import { useRouter } from "expo-router";
import FlowScreen from "../components/ui/flow-screen";
import OptionCard from "../components/ui/option-card";
import { H2, Lede } from "../components/ui/typography";
import { usePact } from "../../context/pact-store";
import { CHARITIES } from "../../constants/pact-config";

export default function CharityScreen() {
  const router = useRouter();
  const { draft, updateDraft } = usePact();

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

      {CHARITIES.map((charity) => (
        <OptionCard
          key={charity.id}
          title={charity.name}
          description={charity.meta}
          selected={charity.id === draft.charityId}
          onPress={() => updateDraft({ charityId: charity.id })}
        />
      ))}
    </FlowScreen>
  );
}
