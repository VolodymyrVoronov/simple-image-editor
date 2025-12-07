import { RotateCcw } from "lucide-react";

import { Button } from "./ui/button";

export interface IResetEffectButtonProps {
  label?: string;

  onClick?: () => void;
}

const ResetEffectButton = ({ label, onClick }: IResetEffectButtonProps) => {
  return (
    <Button
      aria-label={label}
      size="icon-xs"
      variant="outline"
      onClick={onClick}
    >
      <RotateCcw />
    </Button>
  );
};

export default ResetEffectButton;
