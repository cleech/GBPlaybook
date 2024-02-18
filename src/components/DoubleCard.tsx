import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";
import { model } from "./FlipCard";
import GBImages from "./GBImages";
import { useStore } from "../models/Root";

export function DoubleCard({
  model,
  controls,
  controlProps,
}: {
  model: model;
  controls: any;
  controlProps?: any;
}): JSX.Element {
  const { settings } = useStore();
  const targetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.0);
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });
  const updateSize = useCallback(() => {
    if (!targetRef.current) {
      return;
    }
    let { width, height } = targetRef.current.getBoundingClientRect();
    let vertScale = width / 1000;
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

  const key = model.id;
  const gbcp =
    settings.cardPreferences.perferedStyled === "gbcp" &&
    (GBImages.has(`${key}_gbcp_front`) || GBImages.has(`${key}_full`));
  const image = gbcp ? GBImages.get(`${key}_full`) ?? undefined : undefined;

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
          ...(image
            ? {
                backgroundImage: `url(${image})`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                borderRadius: `${25 * scale}px`,
              }
            : {}),
        }}
      >
        <CardFront
          model={model}
          noBackground={!!image}
          style={{
            "--scale": scale,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
        <CardBack
          model={model}
          noBackground={!!image}
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
            {controls?.({ model, ...controlProps })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
