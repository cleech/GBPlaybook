import {
  useState,
  useRef,
  useLayoutEffect,
  CSSProperties,
  useCallback,
} from "react";
import GBImages from "../utils/GBImages";
import "./FlipCard.css";

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
  const updateSize = useCallback(() => {
    if (!targetRef.current) {
      return;
    }
    const { width, height } = targetRef.current.getBoundingClientRect();
    const vertScale = width / 1000;
    const horiScale = height / 700;
    const newScale = Math.min(vertScale, horiScale, 1);
    setScale(newScale ?? 1);
  }, []);

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
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });
  const updateSize = useCallback(() => {
    if (!layoutRef.current) {
      return;
    }
    const { width, height } = layoutRef.current.getBoundingClientRect();
    const vertScale = width / 500;
    const horiScale = height / 700;
    const newScale = Math.min(vertScale, horiScale, 1);
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
