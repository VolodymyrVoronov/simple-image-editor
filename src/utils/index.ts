import type { IImageState, Step } from "@/types";

export function* stepper(
  initial: Step = 0,
): Generator<Step, never, number | undefined> {
  let step: Step = initial;
  while (true) {
    // yield current step and await optional jump instruction
    const jumped = yield step;
    if (typeof jumped === "number") {
      const v = Math.max(0, Math.min(3, Math.floor(jumped))) as Step;
      step = v;
    } else {
      // when no value passed, move to next step (bounded)
      step = Math.min(3, step + 1) as Step;
    }
  }
}

// Helper to create a fresh generator instance (generators are not serializable)
export function createStepperInstance(initial: Step = 0) {
  const g = stepper(initial);
  g.next(); // prime to first yield
  return g;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = (e) => rej(e);
    img.src = src;
  });
}

// draw image to canvas and apply crop + effects
export async function renderToCanvas(
  src: string,
  cropArea: IImageState["cropArea"],
  effects: IImageState["effects"],
): Promise<HTMLCanvasElement> {
  const img = await loadImage(src);
  // compute crop box
  const canvas = document.createElement("canvas");

  let sx = 0,
    sy = 0,
    sWidth = img.width,
    sHeight = img.height;

  if (cropArea) {
    // cropArea is relative (0..1) or absolute? We'll assume absolute pixels if provided.
    // If values look like 0..1, interpret as ratios.
    const isRatio = cropArea.width <= 1 && cropArea.height <= 1;
    if (isRatio) {
      sx = Math.round(cropArea.x * img.width);
      sy = Math.round(cropArea.y * img.height);
      sWidth = Math.round(cropArea.width * img.width);
      sHeight = Math.round(cropArea.height * img.height);
    } else {
      sx = Math.round(cropArea.x);
      sy = Math.round(cropArea.y);
      sWidth = Math.round(cropArea.width);
      sHeight = Math.round(cropArea.height);
    }
  }

  canvas.width = sWidth;
  canvas.height = sHeight;
  const ctx = canvas.getContext("2d")!;

  // draw original crop
  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

  // apply pixelate effect (scale down then up)
  if (effects.pixelate > 0) {
    const px = Math.max(1, Math.floor(effects.pixelate));
    const tmp = document.createElement("canvas");
    const tmpCtx = tmp.getContext("2d")!;
    tmp.width = Math.max(1, Math.floor(canvas.width / px));
    tmp.height = Math.max(1, Math.floor(canvas.height / px));
    tmpCtx.drawImage(canvas, 0, 0, tmp.width, tmp.height);
    // scale back up
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      tmp,
      0,
      0,
      tmp.width,
      tmp.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    ctx.imageSmoothingEnabled = true;
  }

  // apply color adjustments via CSS filter-like operations on an offscreen canvas
  // We'll manipulate pixel data for brightness/contrast/saturation/grayscale.
  if (
    effects.brightness !== 1 ||
    effects.contrast !== 1 ||
    effects.saturation !== 1 ||
    effects.grayscale !== 0
  ) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const brightness = effects.brightness;
    const contrast = effects.contrast;
    const saturation = effects.saturation;
    const grayscale = effects.grayscale;

    // Precompute contrast factor (simple linear contrast)
    const contrastFactor =
      (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

    for (let i = 0; i < data.length; i += 4) {
      // read
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // brightness
      r = r * brightness;
      g = g * brightness;
      b = b * brightness;

      // contrast (approx)
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;

      // saturation: convert to HSL-lightness-based approach
      const avg = 0.2989 * r + 0.587 * g + 0.114 * b;
      r = avg + (r - avg) * saturation;
      g = avg + (g - avg) * saturation;
      b = avg + (b - avg) * saturation;

      // grayscale mix
      if (grayscale > 0) {
        const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
        r = r * (1 - grayscale) + gray * grayscale;
        g = g * (1 - grayscale) + gray * grayscale;
        b = b * (1 - grayscale) + gray * grayscale;
      }

      // clamp and write back
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  return canvas;
}
