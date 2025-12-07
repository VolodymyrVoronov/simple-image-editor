import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectSaturation = () => {
  const [saturation, setEffects] = useImageStore(
    useShallow((state) => [state.effects.saturation, state.setEffects]),
  );

  return (
    <Range
      label="Saturation"
      value={saturation}
      min={0}
      max={3}
      step={0.01}
      onChange={(v) => setEffects({ saturation: v })}
    />
  );
};

export default memo(EffectSaturation);
