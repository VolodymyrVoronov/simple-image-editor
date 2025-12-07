import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { memo, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import type { Step } from "@/types";
import { useImageStore } from "../store/imageStore";

import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface IStepsProps {
  jumpTo: (step: Step) => void;
  prev: () => void;
  next: () => void;
}

const Steps = ({ jumpTo, prev, next }: IStepsProps) => {
  const [step, imageSrc, resetAll] = useImageStore(
    useShallow((state) => [state.step, state.imageSrc, state.resetAll]),
  );

  // Reset all
  const onResetAllButtonClick = useCallback(() => {
    resetAll();
    jumpTo(0);
  }, [jumpTo, resetAll]);

  return (
    <nav className="flex w-full flex-col gap-1">
      <h2 className="font-semibold">Steps:</h2>

      <div className="flex flex-row justify-between">
        <ol className="flex flex-row gap-2">
          <li>
            <Button onClick={() => jumpTo(0)} disabled={step === 0} size="sm">
              1. Upload
            </Button>
          </li>
          <li>
            <Button onClick={() => jumpTo(1)} disabled={step === 1} size="sm">
              2. Crop
            </Button>
          </li>
          <li>
            <Button onClick={() => jumpTo(2)} disabled={step === 2} size="sm">
              3. Effects
            </Button>
          </li>
          <li>
            <Button onClick={() => jumpTo(3)} disabled={step === 3} size="sm">
              4. Save
            </Button>
          </li>
        </ol>

        <div className="flex flex-row gap-2">
          <Button
            onClick={prev}
            aria-label="Previous step"
            size="icon-sm"
            disabled={step === 0}
          >
            <ChevronLeft />
          </Button>

          <Button
            onClick={next}
            aria-label="Next step"
            size="icon-sm"
            disabled={step === 3}
          >
            <ChevronRight />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild disabled={!imageSrc}>
              <Button aria-label="Reset" size="icon-sm" variant="destructive">
                <RotateCcw />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader className="items-center">
                <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
                  <TriangleAlert className="text-destructive size-6" />
                </div>
                <AlertDialogTitle>
                  Are you absolutely sure you want to reset all?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  This action cannot be undone. This will reset all steps and
                  delete any edits you have made.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onResetAllButtonClick}
                  className="bg-destructive dark:bg-destructive/60 hover:bg-destructive focus-visible:ring-destructive text-white"
                >
                  Yes, I'm sure. Reset all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </nav>
  );
};

export default memo(Steps);
