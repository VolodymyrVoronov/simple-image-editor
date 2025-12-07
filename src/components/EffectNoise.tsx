import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectNoise = () => {
  const [noise, setEffects] = useImageStore(
    useShallow((state) => [state.effects.noise, state.setEffects]),
  );

  return (
    <Range
      label="Noise"
      value={noise}
      min={0}
      max={1}
      step={0.01}
      onChange={(v) => setEffects({ noise: v })}
    />
  );
};

export default memo(EffectNoise);
