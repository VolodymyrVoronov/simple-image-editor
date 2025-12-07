import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectOpacity = () => {
  const [opacity, setEffects] = useImageStore(
    useShallow((state) => [state.effects.opacity, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Opacity"
        value={opacity}
        min={0}
        max={1}
        step={0.01}
        onChange={(v) => setEffects({ opacity: v })}
      />

      <ResetEffectButton
        label="Reset opacity"
        onClick={() => setEffects({ opacity: initialState.effects.opacity })}
      />
    </div>
  );
};

export default memo(EffectOpacity);
