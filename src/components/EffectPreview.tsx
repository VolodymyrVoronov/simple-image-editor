import { memo, useEffect, useState } from "react";

import type { IImageState } from "@/types";
import { renderToCanvas } from "@/utils";

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

  if (!url) return <div style={{ marginTop: 12 }}>Rendering preview…</div>;

  return (
    <img
      src={url}
      alt="preview"
      style={{
        marginTop: 12,
        maxWidth: "100%",
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    />
  );
};

export default memo(EffectPreview);
