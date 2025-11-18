import "./CardFront.css"
import "./CardBack.css"
import "./CardQuirks.css"

import {
  useRef,
  CSSProperties,
} from "react";
import GBImages from "../utils/GBImages";
import flipStyles from './flipCardStyles';
import useScaleRef from "../hooks/useScaleRef";

interface CardCSS extends CSSProperties {
  "--scale": number | string;
}

export const DoubleGuildCard = ({ guild }: { guild: string | undefined }) => {
  const [scale, layoutRef] = useScaleRef<HTMLDivElement>(1000, 700);
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
      <div className={flipStyles.flipCard}
        onClick={() => {
          targetRef.current?.classList.toggle("flipped");
        }}
      >
        <div ref={targetRef} className={flipStyles.flipCardInner}>
          <div className={flipStyles.flipCardFront}>
            <div
              className="card-back"
              style={
                {
                  backgroundImage: `url(${GBImages.get(`${guild}_back`)})`,
                  "--scale": scale,
                } as CardCSS
              }
            />
          </div>
          <div className={flipStyles.flipCardBack}>
            <div
              className="card-front"
              style={
                {
                  backgroundImage: `url(${GBImages.get(`${guild}_front`)})`,
                  "--scale": scale,
                } as CardCSS
              }
            />
          </div>
        </div>
      </div>
    </div >
  );
}
