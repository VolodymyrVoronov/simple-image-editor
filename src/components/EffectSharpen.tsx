import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectSharpen = () => {
  const [sharpen, setEffects] = useImageStore(
    useShallow((state) => [state.effects.sharpen, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Sharpen"
        value={sharpen}
        min={0}
        max={3}
        step={0.05}
        onChange={(v) => setEffects({ sharpen: v })}
      />

      <ResetEffectButton
        label="Reset sharpen"
        onClick={() => setEffects({ sharpen: initialState.effects.sharpen })}
      />
    </div>
  );
};

export default memo(EffectSharpen);
