import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectEmboss = () => {
  const [emboss, setEffects] = useImageStore(
    useShallow((state) => [state.effects.emboss, state.setEffects]),
  );

  return (
    <Range
      label="Emboss"
      value={emboss}
      min={0}
      max={1}
      step={0.05}
      onChange={(v) => setEffects({ emboss: v })}
    />
  );
};

export default memo(EffectEmboss);
