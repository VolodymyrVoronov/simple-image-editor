import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { initialState, useImageStore } from "@/store/imageStore";

import Range from "./Range";
import ResetEffectButton from "./ResetEffectButton";

const EffectGrayscale = () => {
  const [grayscale, setEffects] = useImageStore(
    useShallow((state) => [state.effects.grayscale, state.setEffects]),
  );

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Range
        label="Grayscale"
        value={grayscale}
        min={0}
        max={1}
        step={0.01}
        onChange={(v) => setEffects({ grayscale: v })}
      />

      <ResetEffectButton
        label="Reset grayscale"
        onClick={() =>
          setEffects({ grayscale: initialState.effects.grayscale })
        }
      />
    </div>
  );
};

export default memo(EffectGrayscale);
