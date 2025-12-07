import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectSepia = () => {
  const [sepia, setEffects] = useImageStore(
    useShallow((state) => [state.effects.sepia, state.setEffects]),
  );

  return (
    <Range
      label="Sepia"
      value={sepia}
      min={0}
      max={1}
      step={0.01}
      onChange={(v) => setEffects({ sepia: v })}
    />
  );
};

export default memo(EffectSepia);
