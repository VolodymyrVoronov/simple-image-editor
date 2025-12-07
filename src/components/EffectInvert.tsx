import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectInvert = () => {
  const [invert, setEffects] = useImageStore(
    useShallow((state) => [state.effects.invert, state.setEffects]),
  );

  return (
    <Range
      label="Invert"
      value={invert}
      min={0}
      max={1}
      step={0.01}
      onChange={(v) => setEffects({ invert: v })}
    />
  );
};

export default memo(EffectInvert);
