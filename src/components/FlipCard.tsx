import { useRef, JSX, PropsWithChildren, } from "react";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";
import "./FlipCard.css";

import { GBModelExpanded } from "../models/gbdbTypes";
import { Observable } from "rxjs";
import useScaleRef from "../hooks/useScaleRef";

export function FlipCard({
  children,
  model,
  health$,
}: PropsWithChildren<{
  model: GBModelExpanded;
  health$?: Observable<number>;
}>): JSX.Element {
  const targetRef = useRef<HTMLDivElement>(null);
  const [scale, layoutRef] = useScaleRef<HTMLDivElement>(500, 700);

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
