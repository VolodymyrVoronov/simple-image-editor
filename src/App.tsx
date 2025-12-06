import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { useImageStore } from "./store/imageStore";
import type { Step } from "./types";
import { createStepperInstance, renderToCanvas } from "./utils";

import { Button } from "./components/ui/button";
import EffectPreview from "./components/EffectPreview";

const App = () => {
  const {
    step,
    imageSrc,
    cropArea,
    effects,
    format,
    quality,
    setImage,
    setStep,
    setCropArea,
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

  // Upload handler
  const onFile = useCallback(
    (file?: File) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setImage(String(reader.result));
        // after upload go to crop step (1)
        jumpTo(1);
      };
      reader.readAsDataURL(file);
    },
    [setImage, jumpTo],
  );

  // Crop state (react-easy-crop uses relative values)
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const applyCrop = useCallback(() => {
    if (!imageSrc || !croppedAreaPixels) return;
    // save crop area in pixel coordinates
    setCropArea({
      x: croppedAreaPixels.x,
      y: croppedAreaPixels.y,
      width: croppedAreaPixels.width,
      height: croppedAreaPixels.height,
    });
    jumpTo(2);
  }, [imageSrc, croppedAreaPixels, setCropArea, jumpTo]);

  const skipCrop = useCallback(() => jumpTo(2), [jumpTo]);

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

  // Reset all
  const resetAll = useCallback(() => {
    setImage(null);
    setCropArea(null);
    setEffects({
      brightness: 1,
      contrast: 1,
      saturation: 1,
      pixelate: 0,
      grayscale: 0,
    });
    setFormat("image/png");
    setQuality(0.92);
    jumpTo(0);
  }, [setImage, setCropArea, setEffects, setFormat, setQuality, jumpTo]);

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "1rem auto",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 22 }}>
        Image editor (React + TS + generators + zustand)
      </h1>
      <p style={{ marginTop: 4, color: "#444" }}>
        Steps: Upload → Crop → Effects → Save. You can jump between steps.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <nav
          style={{
            minWidth: 220,
            padding: 12,
            border: "1px solid #eee",
            borderRadius: 8,
          }}
        >
          <strong>Steps</strong>
          <ol>
            <li style={{ marginTop: 8 }}>
              <Button onClick={() => jumpTo(0)} disabled={step === 0}>
                1. Upload
              </Button>
            </li>
            <li style={{ marginTop: 8 }}>
              <Button onClick={() => jumpTo(1)} disabled={step === 1}>
                2. Crop
              </Button>
            </li>
            <li style={{ marginTop: 8 }}>
              <Button onClick={() => jumpTo(2)} disabled={step === 2}>
                3. Effects
              </Button>
            </li>
            <li style={{ marginTop: 8 }}>
              <Button onClick={() => jumpTo(3)} disabled={step === 3}>
                4. Save
              </Button>
            </li>
          </ol>

          <div style={{ marginTop: 12 }}>
            <Button onClick={prev} style={{ marginRight: 8 }}>
              Previous (generator)
            </Button>
            <Button onClick={next}>Next (generator)</Button>
            <Button onClick={resetAll} style={{ marginLeft: 8 }}>
              Reset
            </Button>
          </div>

          <div
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: "1px dashed #ddd",
            }}
          >
            <div>
              <strong>Saved state</strong>
            </div>
            <div>Step: {step}</div>
            <div>Format: {format}</div>
          </div>
        </nav>

        <main
          style={{
            flex: 1,
            padding: 12,
            border: "1px solid #eee",
            borderRadius: 8,
          }}
        >
          {/* Upload */}
          {step === 0 && (
            <section>
              <h2>Upload image</h2>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              {imageSrc && (
                <div style={{ marginTop: 12 }}>
                  <img
                    src={imageSrc}
                    alt="uploaded"
                    style={{ maxWidth: "100%", maxHeight: 400 }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Button onClick={() => jumpTo(1)}>Go to Crop</Button>
                    <Button onClick={() => jumpTo(2)} style={{ marginLeft: 8 }}>
                      Skip to Effects
                    </Button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Crop */}
          {step === 1 && (
            <section>
              <h2>Crop</h2>
              {imageSrc ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 400,
                    background: "#333",
                  }}
                >
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
              ) : (
                <div>No image uploaded yet.</div>
              )}

              <div style={{ marginTop: 8 }}>
                <label>Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </div>
              <div style={{ marginTop: 8 }}>
                <Button onClick={applyCrop} disabled={!imageSrc}>
                  Apply Crop
                </Button>
                <Button onClick={skipCrop} style={{ marginLeft: 8 }}>
                  Skip Crop
                </Button>
                <Button onClick={() => jumpTo(0)} style={{ marginLeft: 8 }}>
                  Back to Upload
                </Button>
              </div>
            </section>
          )}

          {/* Effects */}
          {step === 2 && (
            <section>
              <h2>Effects</h2>
              {!imageSrc ? (
                <div>Please upload an image first.</div>
              ) : (
                <div>
                  <EffectPreview
                    src={imageSrc}
                    cropArea={cropArea}
                    effects={effects}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <label>Brightness {effects.brightness.toFixed(2)}</label>
                      <input
                        type="range"
                        min={0}
                        max={2}
                        step={0.01}
                        value={effects.brightness}
                        onChange={(e) =>
                          setEffects({ brightness: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div>
                      <label>Contrast {effects.contrast.toFixed(2)}</label>
                      <input
                        type="range"
                        min={0}
                        max={2}
                        step={0.01}
                        value={effects.contrast}
                        onChange={(e) =>
                          setEffects({ contrast: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div>
                      <label>Saturation {effects.saturation.toFixed(2)}</label>
                      <input
                        type="range"
                        min={0}
                        max={2}
                        step={0.01}
                        value={effects.saturation}
                        onChange={(e) =>
                          setEffects({ saturation: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div>
                      <label>Grayscale {effects.grayscale.toFixed(2)}</label>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={effects.grayscale}
                        onChange={(e) =>
                          setEffects({ grayscale: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label>Pixelate {effects.pixelate}px</label>
                      <input
                        type="range"
                        min={0}
                        max={50}
                        step={1}
                        value={effects.pixelate}
                        onChange={(e) =>
                          setEffects({ pixelate: Number(e.target.value) })
                        }
                      />
                    </div>
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
      </div>

      <footer style={{ marginTop: 12, color: "#666" }}>
        <small>
          State is persisted in localStorage. This example is fully typed with
          TypeScript and uses a small generator to manage step flow.
        </small>
      </footer>
    </div>
  );
};

export default App;
