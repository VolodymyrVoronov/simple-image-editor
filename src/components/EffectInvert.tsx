import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectInvert = () => {
  const [invert, setEffects] = useImageStore(
    useShallow((state) => [state.effects.invert, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Invert"
        value={invert}
        min={0}
        max={1}
        step={0.01}
        onChange={(v) => setEffects({ invert: v })}
      />

      <ResetEffectButton
        label="Reset invert"
        onClick={() => setEffects({ invert: initialState.effects.invert })}
      />
    </div>
  );
};

export default memo(EffectInvert);
