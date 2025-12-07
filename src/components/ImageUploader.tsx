import {
  Crop,
  Image,
  MoveRight,
  RedoDot,
  Sparkles,
  Upload,
} from "lucide-react";
import { memo, useCallback, useRef } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";
import type { Step } from "@/types";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export interface IImageUploaderProps {
  jumpTo: (step: Step) => void;
}

const ImageUploader = ({ jumpTo }: IImageUploaderProps) => {
  const [imageSrc, setImage] = useImageStore(
    useShallow((state) => [state.imageSrc, state.setImage]),
  );

  const inputRef = useRef<HTMLInputElement>(null);

  // Upload handler
  const onFile = useCallback(
    (file?: File) => {
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        setImage(String(reader.result));
        jumpTo(1);
      };

      reader.readAsDataURL(file);
    },
    [setImage, jumpTo],
  );

  return (
    <section className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="image-uploader">Upload image</Label>
        <Input
          ref={inputRef}
          id="image-uploader"
          type="file"
          accept="image/*"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>

      {!imageSrc ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Image />
            </EmptyMedia>
            <EmptyTitle>No image uploaded</EmptyTitle>
            <EmptyDescription>Upload an image to get started.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              Upload
              <Upload />
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="flex h-full w-full flex-col justify-center gap-4">
          <img
            src={imageSrc}
            alt="uploaded"
            className="h-[50svh] max-w-full object-contain"
          />

          <div className="flex flex-row justify-center gap-2">
            <Button onClick={() => jumpTo(1)} aria-label="Go to Crop">
              Go to Crop
              <MoveRight /> <Crop />
            </Button>

            <Button onClick={() => jumpTo(2)} aria-label="Skip to Effects">
              Skip to Effects <RedoDot /> <Sparkles />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default memo(ImageUploader);
