import { Download, MoveLeft, Sparkles } from "lucide-react";
import { memo, useCallback } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";
import type { Step } from "@/types";
import { renderToCanvas } from "@/utils";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EffectPreview from "./EffectPreview";
import Range from "./Range";
import { Button } from "./ui/button";

export interface ISaveProps {
  jumpTo: (step: Step) => void;
}

const Save = ({ jumpTo }: ISaveProps) => {
  const [imageSrc, cropArea, effects, format, quality, setFormat, setQuality] =
    useImageStore(
      useShallow((state) => [
        state.imageSrc,
        state.cropArea,
        state.effects,
        state.format,
        state.quality,
        state.setFormat,
        state.setQuality,
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
            <div className="flex flex-row items-center gap-2">
              <Label htmlFor="format">Format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Format</SelectLabel>
                    <SelectItem value="image/png">PNG</SelectItem>
                    <SelectItem value="image/webp">WebP</SelectItem>
                    <SelectItem value="image/jpeg">JPEG</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-row items-end-safe gap-2">
              <Range
                label="Quality (for lossy formats)"
                value={quality}
                min={0.1}
                max={1}
                step={0.01}
                onChange={(v) => setQuality(v)}
              />

              <span>{(quality * 100).toFixed(0)}%</span>
            </div>
          </div>

          <EffectPreview src={imageSrc} cropArea={cropArea} effects={effects} />

          <div className="flex w-full flex-row justify-center gap-2">
            <Button onClick={() => jumpTo(2)}>
              <Sparkles /> <MoveLeft />
              Back to Effects
            </Button>

            <Button
              onClick={async () => {
                await onSave();
              }}
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
