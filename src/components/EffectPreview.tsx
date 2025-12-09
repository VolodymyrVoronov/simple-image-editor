import { memo, useEffect, useState } from "react";

import type { IImageState } from "@/types";
import { renderToCanvas } from "@/utils";

import { ImageZoom } from "@/components/kibo-ui/image-zoom";
import { Spinner } from "./ui/spinner";

export interface IEffectPreviewProps {
  src: string;
  cropArea: IImageState["cropArea"];
  effects: IImageState["effects"];
  withZoom?: boolean;
}

const EffectPreview = ({
  src,
  cropArea,
  effects,
  withZoom = false,
}: IEffectPreviewProps) => {
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

  const ZoomComponent = withZoom ? ImageZoom : "div";
  const withZoomProps = withZoom ? { zoomMargin: 10 } : {};

  return (
    <div className="flex w-full justify-center">
      <ZoomComponent {...withZoomProps}>
        <img
          src={url}
          alt="preview"
          className="w-full rounded-2xl object-contain"
        />
      </ZoomComponent>
    </div>
  );
};

export default memo(EffectPreview);
