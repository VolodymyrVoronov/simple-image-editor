import { memo, useEffect, useState } from "react";

import type { IImageState } from "@/types";
import { renderToCanvas } from "@/utils";

import { ImageZoom } from "@/components/kibo-ui/image-zoom";
import { Spinner } from "./ui/spinner";

const EffectPreview = ({
  src,
  cropArea,
  effects,
}: {
  src: string;
  cropArea: IImageState["cropArea"];
  effects: IImageState["effects"];
}) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const canvas = await renderToCanvas(src, cropArea ?? null, effects);
      if (!active) return;
      setUrl(canvas.toDataURL());
    })();

    return () => {
      active = false;
    };
  }, [src, cropArea, effects]);

  if (!url)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <Spinner />
        <span className="text-lg">Rendering preview...</span>
      </div>
    );

  return (
    <div className="flex w-full justify-center">
      <ImageZoom zoomMargin={10}>
        <img
          src={url}
          alt="preview"
          className="w-full rounded-2xl object-contain"
        />
      </ImageZoom>
    </div>
  );
};

export default memo(EffectPreview);
