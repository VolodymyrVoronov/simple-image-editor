import { useId } from "react";

import { Slider } from "@/components/ui/slider";
import { Label } from "./ui/label";

export interface IRangeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;

  onChange: (value: number) => void;
}

const Range = ({ label, value, min, max, step, onChange }: IRangeProps) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`${id}-${label}`}>
        {label}: {value}
      </Label>

      <Slider
        id={`${id}-${label}`}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(value) => onChange(value[0])}
        aria-label={label}
      />
    </div>
  );
};

export default Range;
