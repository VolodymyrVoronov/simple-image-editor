import { useId } from "react";

import { Slider } from "@/components/ui/slider";
import { Label } from "./ui/label";

export interface IRangeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;

  shouldUpdateInstantly?: boolean;
  resettable?: boolean;

  onChange: (value: number) => void;
}

const Range = ({
  label,
  value,
  min,
  max,
  step,
  shouldUpdateInstantly = false,
  resettable = true,

  onChange,
}: IRangeProps) => {
  const id = useId();

  return (
    <div
      key={resettable ? value : undefined}
      className="flex w-full flex-col gap-2"
    >
      <Label htmlFor={`${id}-${label}`}>
        {label}: {value.toFixed(2)}
      </Label>

      <Slider
        id={`${id}-${label}`}
        min={min}
        max={max}
        step={step}
        value={shouldUpdateInstantly ? [value] : undefined}
        defaultValue={shouldUpdateInstantly ? undefined : [value]}
        onValueChange={
          shouldUpdateInstantly ? (value) => onChange(value[0]) : undefined
        }
        onValueCommit={
          shouldUpdateInstantly ? undefined : (value) => onChange(value[0])
        }
        aria-label={label}
      />
    </div>
  );
};

export default Range;
