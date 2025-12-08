import { Check, ImageUp, MoveLeft, MoveRight, Sparkles } from "lucide-react";
import { memo, useCallback, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";
import type { Step } from "@/types";

import AspectSelector from "./AspectSelector";
import Range from "./Range";
import { Button } from "./ui/button";

export interface ICropArea {
  jumpTo: (step: Step) => void;
}

const ImageCropper = ({ jumpTo }: ICropArea) => {
  const [imageSrc, aspect, setCropArea] = useImageStore(
    useShallow((state) => [state.imageSrc, state.aspect, state.setCropArea]),
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

  return (
    <section className="flex h-full flex-col gap-4">
      {imageSrc ? (
        <div className="grid h-full grid-cols-[auto_1fr] gap-4">
          <AspectSelector />

          <div className="flex flex-col gap-4">
            <Range
              label="Zoom"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              shouldUpdateInstantly
              onChange={(v) => setZoom(v)}
            />

            <div className="relative h-full w-full">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>No image uploaded yet.</div>
      )}

      <div className="flex flex-row justify-center gap-2">
        <Button onClick={() => jumpTo(0)} aria-label="Back to Upload">
          <ImageUp /> <MoveLeft />
          Back to Upload
        </Button>

        <Button
          onClick={applyCrop}
          disabled={!imageSrc}
          aria-label="Apply Crop"
        >
          Apply Crop <Check />
        </Button>

        <Button onClick={skipCrop} aria-label="Skip Crop">
          Skip Crop <MoveRight /> <Sparkles />
        </Button>
      </div>
    </section>
  );
};

export default memo(ImageCropper);
