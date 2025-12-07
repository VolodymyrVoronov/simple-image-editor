import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectBlur = () => {
  const [blur, setEffects] = useImageStore(
    useShallow((state) => [state.effects.blur, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Blur"
        value={blur}
        min={0}
        max={10}
        step={0.1}
        onChange={(v) => setEffects({ blur: v })}
      />

      <ResetEffectButton
        label="Reset blur"
        onClick={() => setEffects({ blur: initialState.effects.blur })}
      />
    </div>
  );
};

export default memo(EffectBlur);
