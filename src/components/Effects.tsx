import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";
import type { Step } from "@/types";

import EffectBlur from "./EffectBlur";
import EffectBrightness from "./EffectBrightness";
import EffectContrast from "./EffectContrast";
import EffectEmboss from "./EffectEmboss";
import EffectGrayscale from "./EffectGrayscale";
import EffectHueRotate from "./EffectHueRotate";
import EffectInvert from "./EffectInvert";
import EffectNoise from "./EffectNoise";
import EffectOpacity from "./EffectOpacity";
import EffectPixelate from "./EffectPixelate";
import EffectPreview from "./EffectPreview";
import EffectSaturation from "./EffectSaturation";
import EffectSepia from "./EffectSepia";
import EffectSharpen from "./EffectSharpen";
import { Button } from "./ui/button";

export interface IEffects {
  jumpTo: (step: Step) => void;
}

const Effects = ({ jumpTo }: IEffects) => {
  const [imageSrc, cropArea, effects] = useImageStore(
    useShallow((state) => [state.imageSrc, state.cropArea, state.effects]),
  );

  return (
    <section className="flex h-full">
      {!imageSrc ? (
        <div>Please upload an image first.</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-[300px_auto] gap-5">
            <div className="flex flex-col gap-5">
              {/* ---------------- BASIC ADJUSTMENTS ---------------- */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Basic Adjustments</h3>

                <EffectBrightness />
                <EffectContrast />
                <EffectSaturation />
                <EffectGrayscale />
              </div>

              {/* ---------------- COLOR EFFECTS ---------------- */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Color Effects</h3>

                <EffectSepia />
                <EffectInvert />
                <EffectHueRotate />
                <EffectOpacity />
              </div>

              {/* ---------------- STYLIZATION ---------------- */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Stylization</h3>

                <EffectPixelate />
                <EffectNoise />
              </div>

              {/* ---------------- BLUR / SHARPEN ---------------- */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Blur & Sharpen</h3>

                <EffectBlur />
                <EffectSharpen />
                <EffectEmboss />
              </div>
            </div>

            <EffectPreview
              src={imageSrc}
              cropArea={cropArea}
              effects={effects}
            />
          </div>

          <div className="flex w-full flex-row justify-center gap-2">
            <Button onClick={() => jumpTo(1)}>Back to Crop</Button>
            <Button onClick={() => jumpTo(3)} style={{ marginLeft: 8 }}>
              Go to Save
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Effects;
