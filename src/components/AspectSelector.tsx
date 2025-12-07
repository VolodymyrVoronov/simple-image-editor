import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

const aspectRatios: { label: string; value: number }[] = [
  { label: "1:1", value: 1 / 1 },
  { label: "2:3", value: 2 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "4:3", value: 4 / 3 },
  { label: "5:4", value: 5 / 4 },
  { label: "9:16", value: 9 / 16 },
  { label: "16:9", value: 16 / 9 },
  { label: "21:9", value: 21 / 9 },
] as const;

const AspectSelector = () => {
  const [aspect, setAspect] = useImageStore(
    useShallow((state) => [state.aspect, state.setAspect]),
  );

  return (
    <ButtonGroup orientation="vertical">
      {aspectRatios.map((ar) => (
        <Button
          key={ar.label}
          variant={ar.value === aspect ? "default" : "secondary"}
          onClick={() => setAspect(ar.value)}
          aria-label={ar.label}
        >
          {ar.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default memo(AspectSelector);
