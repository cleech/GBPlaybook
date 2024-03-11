import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  JSX,
  PropsWithChildren,
} from "react";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";
import "./FlipCard.css";

import { GBModelExpanded } from "../models/gbdb";
import { Observable } from "rxjs";

export function FlipCard({
  children,
  model,
  health$,
}: PropsWithChildren<{
  model: GBModelExpanded;
  health$?: Observable<number>;
}>): JSX.Element {
  const layoutRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });
  const updateSize = useCallback(() => {
    if (!layoutRef.current) {
      return;
    }
    const { width, height } = layoutRef.current.getBoundingClientRect();
    const vertScale = width / 500;
    const horiScale = height / 700;
    const newScale = Math.min(vertScale, horiScale, 1);
    setScale(newScale ?? 1);
  }, []);

  return (
    <div
      ref={layoutRef}
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "100%",
        maxHeight: "700px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={targetRef}
        className="flip-card"
        onClick={() => {
          targetRef.current?.classList.toggle("flipped");
        }}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <CardFront
              model={model}
              health$={health$}
              style={{ "--scale": scale }}
            />
            {children}
          </div>
          <div className="flip-card-back">
            <CardBack model={model} style={{ "--scale": scale }} />
          </div>
        </div>
      </div>
    </div>
  );
}
