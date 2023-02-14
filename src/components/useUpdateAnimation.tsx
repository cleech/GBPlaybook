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
