import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { IImageState } from "@/types";

export const useImageStore = create<IImageState>()(
  persist(
    (set, get) => ({
      step: 0,
      imageSrc: null,
      cropArea: null,
      effects: {
        brightness: 1,
        contrast: 1,
        saturation: 1,
        pixelate: 0,
        grayscale: 0,
      },
      format: "image/png",
      quality: 0.92,

      setImage: (src) => set({ imageSrc: src }),

      setStep: (s) => set({ step: s }),

      setCropArea: (area) => set({ cropArea: area }),

      setEffects: (updater) =>
        set({ effects: { ...get().effects, ...updater } }),

      setFormat: (fmt) => set({ format: fmt }),

      setQuality: (q) => set({ quality: q }),
    }),
    { name: "image-app-storage" },
  ),
);
