import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectPixelate = () => {
  const [pixelate, setEffects] = useImageStore(
    useShallow((state) => [state.effects.pixelate, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Pixelate"
        value={pixelate}
        min={0}
        max={50}
        step={1}
        onChange={(v) => setEffects({ pixelate: v })}
      />

      <ResetEffectButton
        label="Reset pixelate"
        onClick={() => setEffects({ pixelate: initialState.effects.pixelate })}
      />
    </div>
  );
};

export default memo(EffectPixelate);
