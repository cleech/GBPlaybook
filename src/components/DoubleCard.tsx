import { JSX, } from "react";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";
import { GBModelExpanded } from "../models/gbdbTypes";
import useScaleRef from "../hooks/useScaleRef";

export function DoubleCard({ model }: { model: GBModelExpanded }): JSX.Element {

  const [scale, layoutRef] = useScaleRef<HTMLDivElement>(1000, 700);

  const image = undefined;

  return (
    <div
      ref={layoutRef}
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
      </div>
    </div>
  );
}
