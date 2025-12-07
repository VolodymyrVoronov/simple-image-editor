import {
  ChevronLeft,
  ChevronRight,
  Crop,
  ImageUp,
  RotateCcw,
  Save,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { memo, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import type { Step } from "@/types";
import { useImageStore } from "../store/imageStore";

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
import Dot from "./Dot";
import { Button } from "./ui/button";

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
          <li className="relative">
            <Button
              onClick={() => jumpTo(0)}
              disabled={step === 0}
              size="sm"
              aria-label="Upload image"
            >
              Upload
              <ImageUp />
            </Button>

            {step === 0 && <Dot />}
          </li>

          <li className="relative">
            <Button
              onClick={() => jumpTo(1)}
              disabled={step === 1 || !imageSrc}
              size="sm"
              variant={!imageSrc ? "ghost" : undefined}
              aria-label="Crop image"
            >
              Crop
              <Crop />
            </Button>

            {step === 1 && <Dot />}
          </li>

          <li className="relative">
            <Button
              onClick={() => jumpTo(2)}
              disabled={step === 2 || !imageSrc}
              size="sm"
              variant={!imageSrc ? "ghost" : undefined}
              aria-label="Add effects"
            >
              Effects
              <Sparkles />
            </Button>

            {step === 2 && <Dot />}
          </li>

          <li className="relative">
            <Button
              onClick={() => jumpTo(3)}
              disabled={step === 3 || !imageSrc}
              size="sm"
              variant={!imageSrc ? "ghost" : undefined}
              aria-label="Save image"
            >
              Save
              <Save />
            </Button>

            {step === 3 && <Dot />}
          </li>
        </ol>

        <div className="flex flex-row gap-2">
          <Button
            onClick={prev}
            aria-label="Previous step"
            size="icon-sm"
            disabled={step === 0 || !imageSrc}
          >
            <ChevronLeft />
          </Button>

          <Button
            onClick={next}
            aria-label="Next step"
            size="icon-sm"
            disabled={step === 3 || !imageSrc}
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
