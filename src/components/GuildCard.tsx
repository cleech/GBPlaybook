import {
  useRef,
  CSSProperties,
} from "react";
import GBImages from "../utils/GBImages";
import "./FlipCard.css";
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
      <div
        ref={targetRef}
        className="flip-card"
        onClick={() => {
          targetRef.current?.classList.toggle("flipped");
        }}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
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
          <div className="flip-card-back">
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
        </div>
      </div>
    </div>
  );
}
