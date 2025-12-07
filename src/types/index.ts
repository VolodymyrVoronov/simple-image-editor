// ---------------------- Types ----------------------
export type Step = 0 | 1 | 2 | 3;

export interface IImageState {
  step: Step;
  imageSrc: string | null; // data URL or object URL
  cropArea?: { x: number; y: number; width: number; height: number } | null;
  effects: {
    brightness: number;
    contrast: number;
    saturation: number;
    grayscale: number;
    pixelate: number;
    sepia: number;
    invert: number;
    hueRotate: number;
    blur: number;
    sharpen: number;
    emboss: number;
    opacity: number;
    noise: number;
  };
  format: string;
  quality: number;

  setImage: (src: string | null) => void;
  setStep: (s: Step) => void;
  setCropArea: (area: IImageState["cropArea"]) => void;
  setEffects: (updater: Partial<IImageState["effects"]>) => void;
  setFormat: (fmt: string) => void;
  setQuality: (q: number) => void;
  resetAll: () => void;
}
