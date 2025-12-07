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

  // -------------------------------
  // CROP
  // -------------------------------
  const canvas = document.createElement("canvas");

  let sx = 0,
    sy = 0,
    sWidth = img.width,
    sHeight = img.height;

  if (cropArea) {
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
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

  // -------------------------------
  // PIXELATE (first)
  // -------------------------------
  if (effects.pixelate > 0) {
    const px = Math.max(1, Math.floor(effects.pixelate));
    const tmp = document.createElement("canvas");
    const tctx = tmp.getContext("2d", { willReadFrequently: true })!;
    tmp.width = Math.max(1, Math.floor(canvas.width / px));
    tmp.height = Math.max(1, Math.floor(canvas.height / px));

    tctx.drawImage(canvas, 0, 0, tmp.width, tmp.height);

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

  // -------------------------------
  // PIXEL ACCESS (color transforms)
  // -------------------------------
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  const {
    brightness,
    contrast,
    saturation,
    grayscale,
    sepia,
    invert,
    hueRotate,
    opacity,
    noise,
  } = effects;

  // Precompute items
  const contrastFactor =
    (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
  const hueRad = (hueRotate * Math.PI) / 180;

  // Hue rotation matrix
  const cosA = Math.cos(hueRad);
  const sinA = Math.sin(hueRad);
  const hueMatrix = [
    0.213 + cosA * 0.787 - sinA * 0.213,
    0.715 - cosA * 0.715 - sinA * 0.715,
    0.072 - cosA * 0.072 + sinA * 0.928,

    0.213 - cosA * 0.213 + sinA * 0.143,
    0.715 + cosA * 0.285 + sinA * 0.14,
    0.072 - cosA * 0.072 - sinA * 0.283,

    0.213 - cosA * 0.213 - sinA * 0.787,
    0.715 - cosA * 0.715 + sinA * 0.715,
    0.072 + cosA * 0.928 + sinA * 0.072,
  ];

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brightness
    r *= brightness;
    g *= brightness;
    b *= brightness;

    // Contrast
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    // Saturation
    const avg = 0.2989 * r + 0.587 * g + 0.114 * b;
    r = avg + (r - avg) * saturation;
    g = avg + (g - avg) * saturation;
    b = avg + (b - avg) * saturation;

    // Grayscale
    if (grayscale > 0) {
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
      r = r * (1 - grayscale) + gray * grayscale;
      g = g * (1 - grayscale) + gray * grayscale;
      b = b * (1 - grayscale) + gray * grayscale;
    }

    // Sepia
    if (sepia > 0) {
      const sr = 0.393 * r + 0.769 * g + 0.189 * b;
      const sg = 0.349 * r + 0.686 * g + 0.168 * b;
      const sb = 0.272 * r + 0.534 * g + 0.131 * b;
      r = r * (1 - sepia) + sr * sepia;
      g = g * (1 - sepia) + sg * sepia;
      b = b * (1 - sepia) + sb * sepia;
    }

    // Invert
    if (invert > 0) {
      r = r * (1 - invert) + (255 - r) * invert;
      g = g * (1 - invert) + (255 - g) * invert;
      b = b * (1 - invert) + (255 - b) * invert;
    }

    // Hue Rotate
    if (hueRotate !== 0) {
      const nr = r * hueMatrix[0] + g * hueMatrix[1] + b * hueMatrix[2];
      const ng = r * hueMatrix[3] + g * hueMatrix[4] + b * hueMatrix[5];
      const nb = r * hueMatrix[6] + g * hueMatrix[7] + b * hueMatrix[8];
      r = nr;
      g = ng;
      b = nb;
    }

    // Opacity (per pixel alpha)
    data[i + 3] = data[i + 3] * opacity;

    // Noise
    if (noise > 0) {
      const n = (Math.random() - 0.5) * 255 * noise;
      r += n;
      g += n;
      b += n;
    }

    // Clamp
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  ctx.putImageData(imgData, 0, 0);

  // -------------------------------
  // BLUR / SHARPEN / EMBOSS (convolution)
  // -------------------------------

  const needsConvolution =
    effects.blur > 0 || effects.sharpen > 0 || effects.emboss > 0;

  if (needsConvolution) {
    const kernel = buildKernel(effects);
    applyConvolution(canvas, kernel);
  }

  return canvas;
}

// ------------------------------------------------
// KERNEL BUILDER
// ------------------------------------------------

function buildKernel(effects: IImageState["effects"]) {
  const { blur, sharpen, emboss } = effects;

  // Blur (Gaussian 3x3)
  const blurKernel = [
    1 / 16,
    2 / 16,
    1 / 16,
    2 / 16,
    4 / 16,
    2 / 16,
    1 / 16,
    2 / 16,
    1 / 16,
  ];

  // Sharpen
  const sharpenKernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

  // Emboss
  const embossKernel = [-2, -1, 0, -1, 1, 1, 0, 1, 2];

  // Blend kernels by weights
  const kernel = new Array(9).fill(0);

  for (let i = 0; i < 9; i++) {
    kernel[i] =
      blur * blurKernel[i] +
      sharpen * sharpenKernel[i] +
      emboss * embossKernel[i];
  }

  return kernel;
}

// ------------------------------------------------
// APPLY CONVOLUTION
// ------------------------------------------------

function applyConvolution(canvas: HTMLCanvasElement, kernel: number[]) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const w = canvas.width;
  const h = canvas.height;

  const src = ctx.getImageData(0, 0, w, h);
  const dst = ctx.createImageData(w, h);
  const s = src.data;
  const d = dst.data;

  const k = kernel;
  const side = 3;
  const half = 1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0,
        g = 0,
        b = 0;

      for (let ky = 0; ky < side; ky++) {
        for (let kx = 0; kx < side; kx++) {
          const px = x + kx - half;
          const py = y + ky - half;

          if (px >= 0 && px < w && py >= 0 && py < h) {
            const idx = (py * w + px) * 4;
            const kval = k[ky * side + kx];

            r += s[idx] * kval;
            g += s[idx + 1] * kval;
            b += s[idx + 2] * kval;
          }
        }
      }

      const i = (y * w + x) * 4;
      d[i] = Math.max(0, Math.min(255, r));
      d[i + 1] = Math.max(0, Math.min(255, g));
      d[i + 2] = Math.max(0, Math.min(255, b));
      d[i + 3] = 255;
    }
  }

  ctx.putImageData(dst, 0, 0);
}
