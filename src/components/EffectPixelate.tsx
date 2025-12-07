import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectPixelate = () => {
  const [pixelate, setEffects] = useImageStore(
    useShallow((state) => [state.effects.pixelate, state.setEffects]),
  );

  return (
    <Range
      label="Pixelate"
      value={pixelate}
      min={0}
      max={50}
      step={1}
      onChange={(v) => setEffects({ pixelate: v })}
    />
  );
};

export default memo(EffectPixelate);
