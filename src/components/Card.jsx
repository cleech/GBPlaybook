import { useState, useRef, useLayoutEffect } from "react";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";
// import { useData } from "./DataContext";
// import GBImages from "./GBImages";
import "./Card.css";

export function DoubleCard({ model, controls }) {
  const targetRef = useRef();
  const [scale, setScale] = useState(1.0);
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });
  function updateSize() {
    let newScale = targetRef.current.getBoundingClientRect().width / 1000;
    setScale(newScale);
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
    <div ref={targetRef}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          postion: "relative",
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
        <div
          style={{
            position: "absolute",
            // top: "0px",
            left: "0px",
            width: "500px",
            height: "700px",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {controls?.({ model })}
        </div>
      </div>
    </div>
  );
}

export function FlipCard({ model, controls }) {
  const targetRef = useRef();
  const [scale, setScale] = useState(1.0);
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });
  function updateSize() {
    let newScale = targetRef.current.getBoundingClientRect().width / 500;
    setScale(newScale);
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
      className="flip-card"
      onClick={() => {
        targetRef.current.classList.toggle("flipped");
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
        <div
          className="flip-card-front"
          style={{
            width: "500px",
            height: "700px",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {controls?.({ model })}
        </div>
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
  );
}
