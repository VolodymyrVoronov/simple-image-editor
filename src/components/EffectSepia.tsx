import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectSepia = () => {
  const [sepia, setEffects] = useImageStore(
    useShallow((state) => [state.effects.sepia, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Sepia"
        value={sepia}
        min={0}
        max={1}
        step={0.01}
        onChange={(v) => setEffects({ sepia: v })}
      />

      <ResetEffectButton
        label="Reset sepia"
        onClick={() => setEffects({ sepia: initialState.effects.sepia })}
      />
    </div>
  );
};

export default memo(EffectSepia);
