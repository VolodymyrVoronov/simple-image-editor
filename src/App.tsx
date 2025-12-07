import { lazy, Suspense, useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

import { useImageStore } from "./store/imageStore";
import type { Step } from "./types";
import { createStepperInstance } from "./utils";

import Steps from "./components/Steps";
import { Spinner } from "./components/ui/spinner";

const Effects = lazy(() => import("./components/Effects"));
const ImageCropper = lazy(() => import("./components/ImageCropper"));
const ImageUploader = lazy(() => import("./components/ImageUploader"));
const Save = lazy(() => import("./components/Save"));

const App = () => {
  const [step, setStep] = useImageStore(
    useShallow((state) => [state.step, state.setStep]),
  );

  // generator instance for stepper (ref)
  const stepperRef = useRef<Generator<Step, never, number | undefined> | null>(
    null,
  );

  useEffect(() => {
    // re-create generator whenever app mounts
    stepperRef.current = createStepperInstance(step);
    // advance to the saved step by sending a jump
    stepperRef.current.next(step);
  }, []);

  const jumpTo = useCallback(
    (s: Step) => {
      setStep(s);
      if (stepperRef.current) stepperRef.current.next(s);
    },
    [setStep],
  );

  const prev = useCallback(() => {
    if (stepperRef.current) {
      const value = stepperRef.current.next(step - 1).value as Step;
      setStep(value);
    }
  }, [step, setStep]);

  const next = useCallback(() => {
    if (stepperRef.current) {
      const r = stepperRef.current.next();
      const value = r.value as Step;
      setStep(value);
    }
  }, [setStep]);

  return (
    <div className="mx-auto flex h-svh max-w-[1000px] flex-col gap-2 p-2">
      <h1 className="text-center text-2xl font-bold">Image editor</h1>

      <Steps jumpTo={jumpTo} prev={prev} next={next} />

      <main className="flex flex-1 flex-col gap-4 rounded-2xl border p-4">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <Spinner />
            </div>
          }
        >
          {/* Upload */}
          {step === 0 && <ImageUploader jumpTo={jumpTo} />}

          {/* Crop */}
          {step === 1 && <ImageCropper jumpTo={jumpTo} />}

          {/* Effects */}
          {step === 2 && <Effects jumpTo={jumpTo} />}

          {/* Save */}
          {step === 3 && <Save jumpTo={jumpTo} />}
        </Suspense>
      </main>

      <footer className="flex w-full justify-center">
        <small>
          All happens in the browser. No data is sent to the server.
        </small>
      </footer>
    </div>
  );
};

export default App;
