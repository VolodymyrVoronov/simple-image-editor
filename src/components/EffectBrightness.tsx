import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectBrightness = () => {
  const [brightness, setEffects] = useImageStore(
    useShallow((state) => [state.effects.brightness, state.setEffects]),
  );

  return (
    <Range
      label="Brightness"
      value={brightness}
      min={0}
      max={3}
      step={0.01}
      onChange={(v) => setEffects({ brightness: v })}
    />
  );
};

export default memo(EffectBrightness);
