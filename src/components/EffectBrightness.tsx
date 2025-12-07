import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectBrightness = () => {
  const [brightness, setEffects] = useImageStore(
    useShallow((state) => [state.effects.brightness, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Brightness"
        value={brightness}
        min={0}
        max={3}
        step={0.01}
        onChange={(v) => setEffects({ brightness: v })}
      />

      <ResetEffectButton
        label="Reset brightness"
        onClick={() =>
          setEffects({ brightness: initialState.effects.brightness })
        }
      />
    </div>
  );
};

export default memo(EffectBrightness);
