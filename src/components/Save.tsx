import { Download, MoveLeft, Sparkles } from "lucide-react";
import { memo, useCallback } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";
import type { Step } from "@/types";
import { renderToCanvas } from "@/utils";

import EffectPreview from "./EffectPreview";
import FormatSelector from "./FormatSelector";
import QualitySelector from "./QualitySelector";
import { Button } from "./ui/button";

export interface ISaveProps {
  jumpTo: (step: Step) => void;
}

const Save = ({ jumpTo }: ISaveProps) => {
  const [imageSrc, cropArea, effects, format, quality] = useImageStore(
    useShallow((state) => [
      state.imageSrc,
      state.cropArea,
      state.effects,
      state.format,
      state.quality,
    ]),
  );

  // Save/download function
  const onSave = useCallback(async () => {
    if (!imageSrc) return;

    const canvas = await renderToCanvas(imageSrc, cropArea ?? null, effects);

    return new Promise<void>((res, rej) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return rej(new Error("Failed to export image"));

          let fileName: string;

          if (format === "image/png") {
            fileName = "edited-image.png";
          } else if (format === "image/webp") {
            fileName = "edited-image.webp";
          } else {
            fileName = "edited-image.jpeg";
          }

          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(a.href);
          res();
        },
        format,
        quality,
      );
    });
  }, [imageSrc, cropArea, effects, format, quality]);

  return (
    <section className="flex h-full flex-col gap-2">
      {!imageSrc ? (
        <div>No image to save.</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormatSelector />
            <QualitySelector />
          </div>

          <EffectPreview src={imageSrc} cropArea={cropArea} effects={effects} />

          <div className="flex w-full flex-row justify-center gap-2">
            <Button onClick={() => jumpTo(2)} aria-label="Back to effects">
              <Sparkles /> <MoveLeft />
              Back to Effects
            </Button>

            <Button
              onClick={async () => {
                await onSave();
              }}
              aria-label="Download image"
            >
              Download
              <Download />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default memo(Save);
