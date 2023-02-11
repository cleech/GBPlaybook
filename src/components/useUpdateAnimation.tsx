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
        { backgroundColor: ["initial", "red", "initial"] },
        // { border: ["initial", "1px solid red", "initial"] },
        500
      );
    }
  }, deps);
  return ref;
};
