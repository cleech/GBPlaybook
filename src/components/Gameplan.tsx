import React, {
  CSSProperties,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";

import { Gameplan } from "./DataContext.d";

interface CardCSS extends CSSProperties {
  "--scale": number | string;
}

const image = new URL(
  "../assets/cards/GB-S4-Gameplans-2019.png",
  import.meta.url
).href;

const GameplanFront = (props: { gameplan: Gameplan; style?: CardCSS }) => {
  const gameplan = props.gameplan;
  const nf = new Intl.NumberFormat("en-US", { signDisplay: "always" });

  return (
    <div
      className="card-front"
      style={
        {
          backgroundImage: `url(${image})`,
          ...props.style,
        } as any
      }
    >
      <div className="overlay">
        <div
          style={{
            height: "255px",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "Crimson Text",
            letterSpacing: "-1px",
          }}
        >
          <div
            style={{
              fontFamily: "IM Fell Great Primer SC",
              fontSize: "33.33pt",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: "0.8em",
              margin: "0.25em 0",
            }}
          >
            {gameplan.title.split(/\n/).map((p, i) => (
              <span key={`l${i}`}>
                {p.split(/(?=[A-Z])/).map((s, j) => (
                  <span
                    key={`p${i}s${j}`}
                    className={/^\p{Lu}/u.test(s) ? "dropcap" : ""}
                  >
                    <span key={`p${i}s${j}c`}>{s}</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
          <div
            style={{
              fontSize: "20pt",
              margin: "0 1em",
              whiteSpace: "pre-wrap",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {gameplan.text}
            <p style={{ fontStyle: "italic", margin: "0.5em 0" }}>
              {gameplan.detail}
            </p>
          </div>
          <div
            style={{
              fontSize: "35pt",
              position: "absolute",
              bottom: 40,
              left: 40,
              width: "80px",
              height: "80px",
              borderRadius: "40px",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {nf.format(gameplan.initiative)}
          </div>
          <div
            style={{
              fontSize: "35pt",
              position: "absolute",
              bottom: 40,
              right: 40,
              width: "80px",
              height: "80px",
              borderRadius: "40px",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {nf.format(gameplan.influence)}
          </div>
          <div
            style={{
              fontFamily: "serif",
              fontSize: "10pt",
              position: "absolute",
              bottom: "2em",
              letterSpacing: 0,
              wordSpacing: 0,
            }}
          >
            ™ & © Steamforged Games LTD 2019
          </div>
        </div>
      </div>
    </div>
  );
};

const GameplanCard = (props: { gameplan: Gameplan }) => {
  const gameplan = props.gameplan;

  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.0);

  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });
  const updateSize = useCallback(() => {
    if (!ref.current) {
      return;
    }
    let { width, height } = ref.current.getBoundingClientRect();
    let vertScale = width / 500;
    let horiScale = height / 700;
    let newScale = Math.min(vertScale, horiScale, 1);
    setScale(newScale ?? 1);
  }, []);

  return (
    // layout positioning div
    <div
      ref={ref}
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "100%",
        maxHeight: "700px",
        // display: "flex",
        // alignItems: "center",
        // justifyContent: "center",
        padding: 0, margin: 0
      }}
    >
      {/* sizing div */}
      <div
        style={{
          width: `${500 * scale}px`,
          height: `${700 * scale}px`,
          display: "flex",
        }}
      >
        <GameplanFront
          gameplan={gameplan}
          style={{
            "--scale": scale,
          }}
        />
      </div>
    </div>
  );
};

// const MemoGameplanCard = React.memo(GameplanCard);
// export { MemoGameplanCard as GameplanCard };

export { GameplanCard };
