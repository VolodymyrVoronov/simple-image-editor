import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectHueRotate = () => {
  const [hueRotate, setEffects] = useImageStore(
    useShallow((state) => [state.effects.hueRotate, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Hue Rotate"
        value={hueRotate}
        min={-180}
        max={180}
        step={1}
        onChange={(v) => setEffects({ hueRotate: v })}
      />

      <ResetEffectButton
        label="Reset hue rotate"
        onClick={() =>
          setEffects({ hueRotate: initialState.effects.hueRotate })
        }
      />
    </div>
  );
};

export default memo(EffectHueRotate);
