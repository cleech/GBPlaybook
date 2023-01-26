import React, { useState, useRef, useLayoutEffect } from "react";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";
// import { useData } from "./DataContext";
// import GBImages from "./GBImages";
import "./Card.css";

import { IGBPlayer, JGBPlayer } from "../models/Root";
type model = IGBPlayer | JGBPlayer;

export function DoubleCard({
  model,
  controls,
}: {
  model: model;
  controls: any;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.0);
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });
  function updateSize() {
    if (!targetRef.current) {
      return;
    }
    let { width, height } = targetRef.current.getBoundingClientRect();
    let vertScale = width / 1000;
    let horiScale = height / 700;
    let newScale = Math.min(vertScale, horiScale, 1);
    setScale(newScale ?? 1);
  }

  // const { data, loading } = useData();
  // if (loading) {
  //   return null;
  // }
  // const model = data.Models.find((m) => m.id === name);
  // if (GBImages[`${model.id}_gbcp_front`]) {
  //   model.gbcp = true;
  // }

  return (
    <div
      ref={targetRef}
      style={{
        width: "100%",
        maxWidth: "1000px",
        height: "100%",
        maxHeight: "700px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: `${1000 * scale}px`,
          height: `${700 * scale}px`,
          // aspectRatio: 10 / 7,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <CardFront
          model={model}
          style={{
            "--scale": scale,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
        <CardBack
          model={model}
          style={{
            "--scale": scale,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        />
        {controls ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              // position: "absolute",
              // top: "0px",
              // left: "0px",
              // width: "500px",
              // height: "700px",
              // transform: `scale(${scale})`,
              // transformOrigin: "top left",
            }}
          >
            {controls?.({ model })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function FlipCard({ model, controls }: { model: model; controls: any }) {
  const layoutRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.0);
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });
  function updateSize() {
    if (!layoutRef.current) {
      return;
    }
    let { width, height } = layoutRef.current.getBoundingClientRect();
    let vertScale = width / 500;
    let horiScale = height / 700;
    let newScale = Math.min(vertScale, horiScale, 1);
    setScale(newScale ?? 1);
  }

  // const { data, loading } = useData();
  // if (loading) {
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
              {controls?.({ model })}
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
