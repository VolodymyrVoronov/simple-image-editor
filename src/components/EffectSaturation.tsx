import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectSaturation = () => {
  const [saturation, setEffects] = useImageStore(
    useShallow((state) => [state.effects.saturation, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Saturation"
        value={saturation}
        min={0}
        max={3}
        step={0.01}
        onChange={(v) => setEffects({ saturation: v })}
      />

      <ResetEffectButton
        label="Reset saturation"
        onClick={() =>
          setEffects({ saturation: initialState.effects.saturation })
        }
      />
    </div>
  );
};

export default memo(EffectSaturation);
