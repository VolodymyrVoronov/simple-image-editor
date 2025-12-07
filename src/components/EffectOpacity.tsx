import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectOpacity = () => {
  const [opacity, setEffects] = useImageStore(
    useShallow((state) => [state.effects.opacity, state.setEffects]),
  );

  return (
    <Range
      label="Opacity"
      value={opacity}
      min={0}
      max={1}
      step={0.01}
      onChange={(v) => setEffects({ opacity: v })}
    />
  );
};

export default memo(EffectOpacity);
