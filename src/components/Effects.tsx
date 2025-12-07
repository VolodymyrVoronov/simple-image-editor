import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";
import type { Step } from "@/types";

import EffectPreview from "./EffectPreview";
import Range from "./Range";
import { Button } from "./ui/button";

export interface IEffects {
  jumpTo: (step: Step) => void;
}

const Effects = ({ jumpTo }: IEffects) => {
  const [imageSrc, cropArea, effects, setEffects] = useImageStore(
    useShallow((state) => [
      state.imageSrc,
      state.cropArea,
      state.effects,
      state.setEffects,
    ]),
  );

  return (
    <section className="flex h-full">
      {!imageSrc ? (
        <div>Please upload an image first.</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-5">
              {/* ---------------- BASIC ADJUSTMENTS ---------------- */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Basic Adjustments</h3>

                <Range
                  label="Brightness"
                  value={effects.brightness}
                  min={0}
                  max={3}
                  step={0.01}
                  onChange={(v) => setEffects({ brightness: v })}
                />

                <Range
                  label="Contrast"
                  value={effects.contrast}
                  min={0}
                  max={3}
                  step={0.01}
                  onChange={(v) => setEffects({ contrast: v })}
                />

                <Range
                  label="Saturation"
                  value={effects.saturation}
                  min={0}
                  max={3}
                  step={0.01}
                  onChange={(v) => setEffects({ saturation: v })}
                />

                <Range
                  label="Grayscale"
                  value={effects.grayscale}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => setEffects({ grayscale: v })}
                />
              </div>

              {/* ---------------- COLOR EFFECTS ---------------- */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Color Effects</h3>

                <Range
                  label="Sepia"
                  value={effects.sepia}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => setEffects({ sepia: v })}
                />

                <Range
                  label="Invert"
                  value={effects.invert}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => setEffects({ invert: v })}
                />

                <Range
                  label="Hue Rotate"
                  value={effects.hueRotate}
                  min={-180}
                  max={180}
                  step={1}
                  onChange={(v) => setEffects({ hueRotate: v })}
                />

                <Range
                  label="Opacity"
                  value={effects.opacity}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => setEffects({ opacity: v })}
                />
              </div>

              {/* ---------------- STYLIZATION ---------------- */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Stylization</h3>

                <Range
                  label="Pixelate"
                  value={effects.pixelate}
                  min={0}
                  max={50}
                  step={1}
                  onChange={(v) => setEffects({ pixelate: v })}
                />

                <Range
                  label="Noise"
                  value={effects.noise}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => setEffects({ noise: v })}
                />
              </div>

              {/* ---------------- BLUR / SHARPEN ---------------- */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Blur & Sharpen</h3>

                <Range
                  label="Blur"
                  value={effects.blur}
                  min={0}
                  max={10}
                  step={0.1}
                  onChange={(v) => setEffects({ blur: v })}
                />

                <Range
                  label="Sharpen"
                  value={effects.sharpen}
                  min={0}
                  max={3}
                  step={0.05}
                  onChange={(v) => setEffects({ sharpen: v })}
                />

                <Range
                  label="Emboss"
                  value={effects.emboss}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(v) => setEffects({ emboss: v })}
                />
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
