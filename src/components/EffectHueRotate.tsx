import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectHueRotate = () => {
  const [hueRotate, setEffects] = useImageStore(
    useShallow((state) => [state.effects.hueRotate, state.setEffects]),
  );

  return (
    <Range
      label="Hue Rotate"
      value={hueRotate}
      min={-180}
      max={180}
      step={1}
      onChange={(v) => setEffects({ hueRotate: v })}
    />
  );
};

export default memo(EffectHueRotate);
