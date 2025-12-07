import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectContrast = () => {
  const [contrast, setEffects] = useImageStore(
    useShallow((state) => [state.effects.contrast, state.setEffects]),
  );

  return (
    <Range
      label="Contrast"
      value={contrast}
      min={0}
      max={3}
      step={0.01}
      onChange={(v) => setEffects({ contrast: v })}
    />
  );
};

export default memo(EffectContrast);
