import Svg, { Path } from "react-native-svg";
import { colors } from "../../../constants/theme";

export default function Chevron() {
  return (
    <Svg width={7} height={12} viewBox="0 0 7 12" fill="none">
      <Path
        d="M1 1l5 5-5 5"
        stroke={colors.dim}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}
