import React, { useState, useRef, useLayoutEffect, CSSProperties } from "react";
// import { useData } from "./DataContext";
import GBImages from "./GBImages";
import "./Card.css";

interface CardCSS extends CSSProperties {
  "--scale": number | string;
}

export const DoubleGuildCard = ({ guild }: { guild: string | undefined }) => {
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
        <div
          className="card-front"
          style={
            {
              backgroundImage: `url(${GBImages.get(`${guild}_front`)})`,
              "--scale": scale,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            } as CardCSS
          }
        />
        <div
          className="card-back"
          style={
            {
              backgroundImage: `url(${GBImages.get(`${guild}_back`)})`,
              "--scale": scale,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            } as CardCSS
          }
        />
      </div>
    </div>
  );
};

export function FlipGuildCard({ guild }: { guild: string | undefined }) {
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
          <div
            className="flip-card-front card-front"
            style={
              {
                backgroundImage: `url(${GBImages.get(`${guild}_front`)})`,
                "--scale": scale,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              } as CardCSS
            }
          />
          <div
            className="flip-card-back card-back"
            style={
              {
                backgroundImage: `url(${GBImages.get(`${guild}_back`)})`,
                "--scale": scale,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              } as CardCSS
            }
          />
        </div>
      </div>
    </div>
  );
}
