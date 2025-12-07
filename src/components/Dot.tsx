import { cn } from "@/lib/utils";

export interface IDotProps {
  className?: string;
}

const Dot = ({ className }: IDotProps) => {
  return (
    <span
      className={cn(
        "absolute -top-0.5 -right-0.5 size-2 rounded-full bg-sky-600 dark:bg-sky-400",
        className,
      )}
    />
  );
};

export default Dot;
