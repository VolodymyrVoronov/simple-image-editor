import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectContrast = () => {
  const [contrast, setEffects] = useImageStore(
    useShallow((state) => [state.effects.contrast, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Contrast"
        value={contrast}
        min={0}
        max={3}
        step={0.01}
        onChange={(v) => setEffects({ contrast: v })}
      />

      <ResetEffectButton
        label="Reset contrast"
        onClick={() => setEffects({ contrast: initialState.effects.contrast })}
      />
    </div>
  );
};

export default memo(EffectContrast);
