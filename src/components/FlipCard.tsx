import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";
import "./FlipCard.css";

import { GBModelFull } from "../models/gbdb";
// import { IGBPlayer, JGBPlayer } from "../models/Root";
// export type model = IGBPlayer | JGBPlayer;

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

  // const { data } = useData();
  // if (!data) {
  //   return null;
  // }
  // const model = data.Models.find((m) => m.id === name);
  // if (GBImages[`${model.id}_gbcp_front`]) {
  //   model.gbcp = true;
  // }

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
          // aspectRatio: 5 / 7,
          // display: "flex",
        }}
        onClick={() => {
          targetRef.current?.classList.toggle("flipped");
        }}
      >
        <div className="flip-card-inner">
          <CardFront
            className="flip-card-front"
            model={model}
            style={{
              // maxWidth: "2.5in",
              // "--scale": "calc(2.5 * 96 / 500)",
              "--scale": scale,
            }}
          />
          {controls ? (
            <div
              className="flip-card-front"
              style={{
                width: "100%",
                height: "100%",
                // width: "500px",
                // height: "700px",
                // transform: `scale(${scale})`,
                // transformOrigin: "top left",
              }}
            >
              {/* {controls?.({ model, scale: 1 / scale })} */}
              {controls?.({ model, ...controlProps })}
            </div>
          ) : null}
          <CardBack
            className="flip-card-back"
            model={model}
            style={{
              // maxWidth: "2.5in",
              // "--scale": "calc(2.5 * 96 / 500)",
              "--scale": scale,
            }}
          />
        </div>
      </div>
    </div>
  );
}
