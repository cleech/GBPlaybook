import "./CardFront.css"
import "./CardBack.css"

import {
  CSSProperties,
  ReactNode,
} from "react";

import { Gameplan } from "./DataTypes";
import useScaleRef from "../hooks/useScaleRef";

import { css, cx } from '@emotion/css';

import { CardText } from "./CardUtils";
import { useData } from "../hooks/useData";

interface CardCSS extends CSSProperties {
  "--scale"?: number | string;
}

const image = new URL(
  "../assets/cards/GB-S4-Gameplans-2019.png",
  import.meta.url
).href;

export const GameplanFront = (props: {
  gameplan: Gameplan;
  year: number;
  bleed?: boolean;
  style?: CardCSS;
}) => {
  const gameplan = props.gameplan;
  const nf = new Intl.NumberFormat("en-US", { signDisplay: "always" });
  const { lang } = useData();

  return (
    <div
      lang={lang}
      className={cx('card-front', { 'bleed': props.bleed })}
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${image})`,
        ...props.style,
      }}
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
            fontFamily: "Calluna-Regular, Noto Serif SC",
            // letterSpacing: "-1px",
          }}
        >
          <div
            className={css({
              fontFamily: "IM Fell Great Primer SC, Noto Serif SC",
              letterSpacing: "-1px",
              fontSize: "33.33pt",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: "0.8em",
              margin: "0.2em 0",
              whiteSpace: "pre",
              '& span': { whiteSpace: "pre" }
            })}
          >
            { /* ignore the dropcap style if it's all caps */
              /[a-z]/.test(gameplan.title) ?
                gameplan.title.split(/\n/).map((p, i) => (
                  <span key={`l${i}`}>
                    {p.split(/(?=[A-Z])/).map((s, j) => (
                      <span
                        key={`p${i}s${j}`}
                        className={cx({ 'dropcap': /^\p{Lu}/u.test(s) })}
                      >
                        <span key={`p${i}s${j}c`}>{s}</span>
                      </span>
                    ))}
                  </span>
                )) : gameplan.title}
          </div>
          <div
            // 10pt scaled at 200dpi/96 is 20.83pt
            // 9pt (Keep Your Chin Up) is 18.75pt
            className={css({
              margin: "0 1em",
              whiteSpace: "pre",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: 1,
              div: { fontSize: 'calc(9pt * 200/96)', margin: 0, whiteSpace: 'pre' },
              '#KeepYourChinUp': { fontSize: 'calc(8.5pt * 200/96)' },
              '#RawEnthusiasm': { fontSize: 'calc(8.75pt * 200/96)' },
              '.detail#WHATASTRIKE': { fontSize: 'calc(8.5pt * 200/96)' },
              p: { margin: '0.5em' },
              ul: { margin: 0, display: 'flex', flexDirection: 'column' },
              '&:lang(zh)': {
                p: { margin: '0.25em 0.5em' },
                fontSize: "var(--zh-font-size)",
                lineHeight: "1.4",
                letterSpacing: "unset",
              },
            })}
          >
            <div
              className="text"
              id={gameplan.title.replace(/[^a-zA-Z0-9]+/g, '')}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardText>
                {gameplan.text}
              </CardText>
            </div>
            <div
              className='detail'
              id={gameplan.title.replace(/[^a-zA-Z0-9]+/g, '')}
            >
              <CardText>
                {gameplan.detail ? `(_${gameplan.detail}_)` : undefined}
              </CardText>
            </div>
          </div>
          <div
            style={{
              fontSize: "35pt",
              position: "absolute",
              bottom: 40,
              left: 40,
              width: "80px",
              height: "80px",
              borderRadius: "50%",
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
              borderRadius: "50%",
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
            ™ & © Steamforged Games LTD {props.year}
          </div>
        </div>
      </div>
    </div >
  );
};

const SimpleCard = (props: { children?: ReactNode }) => {
  const [scale, layoutRef] = useScaleRef<HTMLDivElement>(500, 700);
  return (
    // layout positioning div
    <div
      ref={layoutRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // maxWidth: "500px",
        // maxHeight: "700px",
        // padding: 0,
        // margin: 0,
      }}
    >
      {/* sizing div */}
      <div
        style={
          {
            width: `${500 * scale}px`,
            height: `${700 * scale}px`,
            display: "flex",
            "--scale": scale,
          } as CardCSS
        }
      >
        {props.children}
      </div>
    </div>
  );
};

export const GameplanCard = (props: { gameplan: Gameplan, year: number }) => (
  <SimpleCard>
    <GameplanFront {...props} />
  </SimpleCard>
);

export const ReferenceCardFront = (props: {
  index: number;
  bleed?: boolean;
  style?: CardCSS;
}) => {
  const image = new URL(
    `../assets/cards/Reference/GB-S4-Reference-${props.index}.png`,
    import.meta.url
  ).href;
  return (
    <div
      className={cx('card-front', { 'bleed': props.bleed })}
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${image})`,
        ...props.style,
      }}
    />
  );
};

export const ReferenceCard = (props: { index: number }) => (
  <SimpleCard>
    <ReferenceCardFront {...props} />
  </SimpleCard>
);
