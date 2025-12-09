import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { IImageState } from "@/types";

export const initialState: Omit<
  IImageState,
  | "setImage"
  | "setAspect"
  | "setStep"
  | "setCropArea"
  | "setEffects"
  | "setFormat"
  | "setQuality"
  | "resetAll"
  | "resetAllEffects"
> = {
  step: 0,
  imageSrc: null,
  aspect: 4 / 3,
  cropArea: null,
  effects: {
    brightness: 1,
    contrast: 0,
    saturation: 1,
    grayscale: 0,
    pixelate: 0,
    sepia: 0,
    invert: 0,
    hueRotate: 0,
    blur: 0,
    sharpen: 0,
    emboss: 0,
    opacity: 1,
    noise: 0,
  },
  format: "image/png",
  quality: 0.92,
};

export const useImageStore = create<IImageState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setImage: (src) => {
        get().resetAll();

        set({ imageSrc: src });
      },

      setAspect: (a) => set({ aspect: a }),

      setStep: (s) => set({ step: s }),

      setCropArea: (area) => set({ cropArea: area }),

      setEffects: (updater) =>
        set({ effects: { ...get().effects, ...updater } }),

      setFormat: (fmt) => set({ format: fmt }),

      setQuality: (q) => set({ quality: q }),

      resetAll: () => set(initialState),

      resetAllEffects: () => set({ effects: initialState.effects }),
    }),
    { name: "image-editor-app-storage-v1" },
  ),
);
