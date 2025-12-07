import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectNoise = () => {
  const [noise, setEffects] = useImageStore(
    useShallow((state) => [state.effects.noise, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Noise"
        value={noise}
        min={0}
        max={1}
        step={0.01}
        onChange={(v) => setEffects({ noise: v })}
      />

      <ResetEffectButton
        label="Reset noise"
        onClick={() => setEffects({ noise: initialState.effects.noise })}
      />
    </div>
  );
};

export default memo(EffectNoise);
