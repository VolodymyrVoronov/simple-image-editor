import { memo } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "@/store/imageStore";

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

const FormatSelector = () => {
  const [format, setFormat] = useImageStore(
    useShallow((state) => [state.format, state.setFormat]),
  );

  return (
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
  );
};

export default memo(FormatSelector);
