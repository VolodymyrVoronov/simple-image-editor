import { useCallback, useEffect, useRef } from "react";

import { useImageStore } from "./store/imageStore";
import type { Step } from "./types";
import { createStepperInstance, renderToCanvas } from "./utils";

import EffectPreview from "./components/EffectPreview";
import ImageUploader from "./components/ImageUploader";
import Range from "./components/Range";
import Steps from "./components/Steps";
import { Button } from "./components/ui/button";
import ImageCropper from "./components/ImageCropper";

const App = () => {
  const {
    step,
    imageSrc,
    cropArea,
    effects,
    format,
    quality,

    setStep,
    setEffects,
    setFormat,
    setQuality,
  } = useImageStore();

  // generator instance for stepper (ref)
  const stepperRef = useRef<Generator<Step, never, number | undefined> | null>(
    null,
  );

  useEffect(() => {
    // re-create generator whenever app mounts
    stepperRef.current = createStepperInstance(step);
    // advance to the saved step by sending a jump
    stepperRef.current.next(step);
  }, []);

  const jumpTo = useCallback(
    (s: Step) => {
      setStep(s);
      if (stepperRef.current) stepperRef.current.next(s);
    },
    [setStep],
  );

  const prev = useCallback(() => {
    if (stepperRef.current) {
      const value = stepperRef.current.next(step - 1).value as Step;
      setStep(value);
    }
  }, [step, setStep]);

  const next = useCallback(() => {
    if (stepperRef.current) {
      const r = stepperRef.current.next();
      const value = r.value as Step;
      setStep(value);
    }
  }, [setStep]);

  // apply effects handler uses store directly when saving

  // Save/download function
  const onSave = useCallback(async () => {
    if (!imageSrc) return;
    const canvas = await renderToCanvas(imageSrc, cropArea ?? null, effects);
    return new Promise<void>((res, rej) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return rej(new Error("Failed to export image"));
          const name = `edited-image.${format === "image/png" ? "png" : format === "image/webp" ? "webp" : "png"}`;
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = name;
          a.click();
          URL.revokeObjectURL(a.href);
          res();
        },
        format,
        quality,
      );
    });
  }, [imageSrc, cropArea, effects, format, quality]);

  // // Reset all
  // const resetAll = useCallback(() => {
  //   setImage(null);
  //   setCropArea(null);
  //   setEffects({
  //     brightness: 1,
  //     contrast: 0,
  //     saturation: 1,
  //     grayscale: 0,
  //     pixelate: 0,
  //     sepia: 0,
  //     invert: 0,
  //     hueRotate: 0,
  //     blur: 0,
  //     sharpen: 0,
  //     emboss: 0,
  //     opacity: 1,
  //     noise: 0,
  //   });
  //   setFormat("image/png");
  //   setQuality(0.92);
  //   jumpTo(0);
  // }, [setImage, setCropArea, setEffects, setFormat, setQuality, jumpTo]);

  return (
    <div className="mx-auto flex h-svh max-w-[1000px] flex-col gap-2 p-2">
      <h1 className="text-center text-2xl font-bold">Image editor</h1>
      {/* <p style={{ marginTop: 4, color: "#444" }}>
        Steps: Upload → Crop → Effects → Save. You can jump between steps.
      </p> */}

      <Steps jumpTo={jumpTo} prev={prev} next={next} />

      <main className="flex flex-1 flex-col gap-4 rounded-2xl border p-4">
        {/* Upload */}
        {step === 0 && <ImageUploader jumpTo={jumpTo} />}

        {/* Crop */}
        {step === 1 && <ImageCropper jumpTo={jumpTo} />}

        {/* Effects */}
        {step === 2 && (
          <section>
            <h2>Effects</h2>
            {!imageSrc ? (
              <div>Please upload an image first.</div>
            ) : (
              <div className="flex flex-col gap-4">
                <EffectPreview
                  src={imageSrc}
                  cropArea={cropArea}
                  effects={effects}
                />
                {/* ---------------- BASIC ADJUSTMENTS ---------------- */}
                <div className="flex flex-col gap-3">
                  <h3>Basic Adjustments</h3>

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
                  <h3>Color Effects</h3>

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
                  <h3>Stylization</h3>

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
                  <h3>Blur & Sharpen</h3>

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

                <div style={{ marginTop: 12 }}>
                  <Button onClick={() => jumpTo(1)}>Back to Crop</Button>
                  <Button onClick={() => jumpTo(3)} style={{ marginLeft: 8 }}>
                    Go to Save
                  </Button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Save */}
        {step === 3 && (
          <section>
            <h2>Save / Export</h2>
            {!imageSrc ? (
              <div>No image to save.</div>
            ) : (
              <div>
                <EffectPreview
                  src={imageSrc}
                  cropArea={cropArea}
                  effects={effects}
                />
                <div>
                  <label>Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                    <option value="image/jpeg">JPEG</option>
                  </select>
                </div>
                <div style={{ marginTop: 8 }}>
                  <label>Quality (for lossy formats)</label>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.01}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                  />
                  <span style={{ marginLeft: 8 }}>
                    {(quality * 100).toFixed(0)}%
                  </span>
                </div>

                <div style={{ marginTop: 12 }}>
                  <Button onClick={() => jumpTo(2)}>Back to Effects</Button>
                  <Button
                    onClick={async () => {
                      await onSave();
                    }}
                    style={{ marginLeft: 8 }}
                  >
                    Download
                  </Button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer>
        <small>
          All happens in the browser. No data is sent to the server.
        </small>
      </footer>
    </div>
  );
};

export default App;
