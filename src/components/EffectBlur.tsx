import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectBlur = () => {
  const [blur, setEffects] = useImageStore(
    useShallow((state) => [state.effects.blur, state.setEffects]),
  );

  return (
    <Range
      label="Blur"
      value={blur}
      min={0}
      max={10}
      step={0.1}
      onChange={(v) => setEffects({ blur: v })}
    />
  );
};

export default memo(EffectBlur);
