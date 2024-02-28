import React from "react";
import { useDidUpdate } from "rooks";

export const useUpdateAnimation = <T extends HTMLElement>(
  animate: boolean,
  deps?: unknown[]
): React.RefObject<T> => {
  const ref = React.useRef<T>(null);
  useDidUpdate(() => {
    if (animate) {
      ref.current?.animate(
        {
          backgroundColor: ["initial", "red", "initial"],
          boxShadow: [
            "0 0 0px 0px transparent",
            "0 0 0.25em 0.25em red",
            "0 0 0.25em 0.25em transparent",
          ],
        },
        500
      );
    }
  }, deps);
  return ref;
};

export const pulseAnimationKeyFrames = {
  boxShadow: [
    "0 0 0px 0px transparent",
    "0 0 20px 20px red",
    "0 0 20px 20px transparent",
  ],
};
