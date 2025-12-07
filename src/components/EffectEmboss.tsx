import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectEmboss = () => {
  const [emboss, setEffects] = useImageStore(
    useShallow((state) => [state.effects.emboss, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Emboss"
        value={emboss}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => setEffects({ emboss: v })}
      />

      <ResetEffectButton
        label="Reset emboss"
        onClick={() => setEffects({ emboss: initialState.effects.emboss })}
      />
    </div>
  );
};

export default memo(EffectEmboss);
