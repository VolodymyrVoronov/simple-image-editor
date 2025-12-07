import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import Range from "./Range";

const QualitySelector = () => {
  const [quality, setQuality] = useImageStore(
    useShallow((state) => [state.quality, state.setQuality]),
  );

  return (
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
  );
};

export default memo(QualitySelector);
