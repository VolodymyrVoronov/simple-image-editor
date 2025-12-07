import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const EffectSharpen = () => {
  const [sharpen, setEffects] = useImageStore(
    useShallow((state) => [state.effects.sharpen, state.setEffects]),
  );

  return (
    <Range
      label="Sharpen"
      value={sharpen}
      min={0}
      max={3}
      step={0.05}
      onChange={(v) => setEffects({ sharpen: v })}
    />
  );
};

export default memo(EffectSharpen);
