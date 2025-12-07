import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectGrayscale = () => {
  const [grayscale, setEffects] = useImageStore(
    useShallow((state) => [state.effects.grayscale, state.setEffects]),
  );

  return (
    <Range
      label="Grayscale"
      value={grayscale}
      min={0}
      max={1}
      step={0.01}
      onChange={(v) => setEffects({ grayscale: v })}
    />
  );
};

export default memo(EffectGrayscale);
