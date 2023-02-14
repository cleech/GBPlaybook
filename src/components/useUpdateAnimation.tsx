import React from "react";
import { useDidUpdate } from "rooks";

export const useUpdateAnimation = (
  animate: boolean,
  deps?: unknown[]
): React.RefObject<any> => {
  const ref = React.useRef<any>(null);
  useDidUpdate(() => {
    if (animate) {
      ref.current?.animate(
        {
          backgroundColor: ["initial", "red", "initial"],
          outline: [
            "initial",
            "0px solid red",
            "0.5em solid red",
            "0px solid red",
            "initial",
          ],
        },
        750
      );
    }
  }, deps);
  return ref;
};

export const pulseAnimationKeyFrames = {
  opacity: [0, 1, 0],
  outlineWidth: ["1px", "20px"],
};

export const usePulseAnimation = (
  animate: boolean,
  deps?: unknown[]
): React.RefObject<any> => {
  const ref = React.useRef<any>(null);
  useDidUpdate(() => {
    if (animate) {
      console.log(`animate: ${ref.current}`);
      ref.current?.animate(
        {
          opacity: [0, 1, 0],
          outlineWidth: ["1px", "20px"],
        },
        { duration: 1000, easing: "ease-in-out" }
      );
    }
  }, deps);
  return ref;
};
