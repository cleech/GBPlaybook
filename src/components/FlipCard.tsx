import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";
import "./FlipCard.css";

import { GBModelFull } from "../models/gbdb";

export function FlipCard({
  model,
  controls,
  controlProps,
}: {
  model: GBModelFull;
  controls: any;
  controlProps?: any;
}): JSX.Element {
  const layoutRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.0);
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });
  const updateSize = useCallback(() => {
    if (!layoutRef.current) {
      return;
    }
    let { width, height } = layoutRef.current.getBoundingClientRect();
    let vertScale = width / 500;
    let horiScale = height / 700;
    let newScale = Math.min(vertScale, horiScale, 1);
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
        style={{
          width: `${500 * scale}px`,
          height: `${700 * scale}px`,
        }}
        onClick={() => {
          targetRef.current?.classList.toggle("flipped");
        }}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <CardFront model={model} style={{ "--scale": scale }} />
            {controls ? (
              <div
              // style={{
              //   width: "100%",
              //   height: "100%",
              // }}
              >
                {controls?.({ model, ...controlProps })}
              </div>
            ) : null}
          </div>
          <div className="flip-card-back">
            <CardBack model={model} style={{ "--scale": scale }} />
          </div>
        </div>
      </div>
    </div>
  );
}
