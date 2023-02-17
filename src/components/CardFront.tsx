import React, { CSSProperties } from "react";
import GBImages from "./GBImages";
import { useData } from "./DataContext";
import { Observer } from "mobx-react-lite";

import GBIcon, { PB } from "./GBIcon";
import "./CardFront.css";

import { textIconReplace } from "./CardUtils";
import Color from "color";

import { Guild } from "./DataContext.d";
import { IGBPlayer, JGBPlayer, useStore } from "../models/Root";
type model = JGBPlayer | IGBPlayer;

interface CardFrontProps {
  model: model;
  style: GBCardCSS;
  guild?: string;
  className?: string;
}

export interface GBCardCSS extends CSSProperties {
  "--scale": number | string;
  "--gbcp-color"?: string;
  "--mom-border-color"?: string;
  "--mom-color"?: string;
  "--team-color"?: string;
  "--guild1-color"?: string;
  "--guild2-color"?: string;
}

const CardFront = (props: CardFrontProps) => {
  const model = props.model;
  const key = model.id;

  // const targetRef = useRef();
  // const [scale, setScale] = useState(props.scale ?? 1.0);
  // useLayoutEffect(() => {
  //   updateSize();
  //   window.addEventListener("resize", updateSize);
  //   return () => window.removeEventListener("resize", updateSize);
  // });
  // function updateSize() {
  //   let newScale = targetRef.current.getBoundingClientRect().width / 500;
  //   // let newScale = targetRef.current.getBoundingClientRect().height / 700;
  //   setScale(newScale);
  // }

  const { settings } = useStore();
  const { data } = useData();
  if (!data) {
    return null;
  }

  const guild = data.Guilds.find(
    (g) => g.name === (props.guild ?? model.guild1)
  );
  const guild1 = data.Guilds.find((g) => g.name === model.guild1);
  const guild2 = data.Guilds.find((g) => g.name === model.guild2);
  if (!guild1 || !guild) {
    return null;
  }

  const gbcp =
    model.gbcp ||
    (settings.cardPreferences.perferedStyled === "gbcp" &&
      GBImages.has(`${key}_gbcp_front`));

  const image =
    (gbcp ? GBImages.get(`${key}_gbcp_front`) : GBImages.get(`${key}_front`)) ??
    GBImages.get(`${key}_front`);

  return (
    <div
      className={`card-front ${key} ${gbcp && "gbcp"} ${props.className}`}
      // ref={targetRef}
      style={{
        "--team-color": guild.color,
        /* not the best way to do this */
        // "--gbcp-color": Color(guild2 ? guild2.color : guild1.color).mix(
        //   Color.rgb(240, 230, 210),
        //   0.9
        // ),
        "--gbcp-color": Color(guild1.shadow ?? guild1.color)
          .mix(Color.rgb(254, 246, 227), 0.9)
          .string(),
        "--guild1-color": guild1.color,
        "--guild2-color": guild2 ? guild2.color : undefined,
        "--mom-color": guild.shadow,
        "--mom-border-color": guild.darkColor,
        backgroundImage: `url(${image})`,
        ...props.style,
      }}
    >
      <div className={`overlay ${gbcp ? "gbcp" : ""}`}>
        <div className="font-top-box">
          <NamePlate model={model} guild={guild} />
          <StatBox model={model} />
        </div>
        <Playbook model={model} gbcp={gbcp} />
        <div className="character-plays-wrapper">
          <CharacterPlays model={model} gbcp={gbcp} />
        </div>
        <HealthBoxes model={model} />
      </div>
    </div>
  );
};

const NamePlate = ({ model, guild }: { model: model; guild: Guild }) => (
  <div className="name-plate">
    <div className="guild-icon">
      <GBIcon id="guild-icon" icon={guild.name} />
      {/* <GBIcon id="guild-icon-gbcp" icon={`${guild.name}-GBCP`} /> */}
    </div>
    <div className="name-plate-right">
      <div className="name">
        <div className="dropcap">
          {model.name.split(/(?=[A-Z])/).map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>
      <div className="reach">Melee Zone {model.reach ? 2 : 1}"</div>
    </div>
  </div>
);

const HealthBoxes = ({ model }: { model: model }) => (
  <Observer>
    {() => (
      <div className="health">
        {[...Array(model.hp).keys()].map((key) => (
          <div
            className={`health-box ${
              key + 1 > (model.health ?? model.hp) ? "damaged" : ""
            }`}
            key={key}
          >
            {(key === 0 && <GBIcon icon="skull" size={17} />) ||
              (key + 1 === model.recovery && (
                <GBIcon icon="bandage" size={22} />
              )) ||
              (key + 1 === model.hp && key + 1)}
          </div>
        ))}
      </div>
    )}
  </Observer>
);

const Playbook = ({
  model,
  gbcp = false,
}: {
  model: model;
  gbcp?: boolean;
}) => (
  <div className="playbook">
    {model.playbook?.map((row, index) => {
      return row?.flatMap((pbm, col) => {
        const [pb, mom] = pbm ? pbm.split(";") : [null, null];
        return (
          <div
            className={`playbook-result ${!pb ? "spacer" : ""} ${
              mom ? "momentus" : ""
            }`}
            key={index * 7 + col}
            style={
              {
                "--col": col,
                display: "flex",
                flexDirection: gbcp ? "row" : "column",
                // 0.15 is always safe; (sqrt(2)-1)/(2*sqrt(2))
                // padding: "0.15em",
                padding: "0.10em",
                gap: gbcp ? 0 : "0.05em",
              } as CSSProperties
            }
          >
            {pb
              ? pb.split(",").map((p, index) => {
                  p = gbcp
                    ? p.replace(/^CP$/, "CP-gbcp").replace(/^CP2$/, "CP2-gbcp")
                    : p;
                  return <PB icon={p} key={index} />;
                })
              : null}
          </div>
        );
      });
    })}
  </div>
);

const StatBox = ({ model }: { model: model }) => (
  <div className="statbox">
    <span>MOV</span>
    <span>TAC</span>
    <span>KICK</span>
    <span>DEF</span>
    <span>ARM</span>
    <span>INF</span>
    <span>{`${model.jog}"/${model.sprint}"`}</span>
    <span>{model.tac}</span>
    <span>{`${model.kickdice}/${model.kickdist}"`}</span>
    <span>{`${model.def}+`}</span>
    <span>{model.arm}</span>
    <span>{`${model.inf}/${model.infmax}`}</span>
  </div>
);

const BooleanIcon = ({ test }: { test: boolean }) => (
  <GBIcon icon={test ? "checkmark" : "ballotX"} size={14} />
);

function CPName({ text }: { text: string }) {
  const name = text.split("[", 1)[0];
  const arg = text.replace(/[^[]*(\[.*\])?/, " $1");
  return (
    <div className="name">
      <span>{name}</span>
      <span>{arg}</span>
    </div>
  );
}

const CharacterPlays = ({
  model,
  gbcp = false,
}: {
  model: model;
  gbcp?: boolean;
}) => {
  const { data } = useData();
  if (!data) {
    return null;
  }
  const CPlays = data["Character Plays"];
  return (
    <div className="character-plays">
      <span className="dropcap">
        <span>Character </span>
        <span>Plays</span>
      </span>
      <span>CST</span>
      <span>RNG</span>
      <span>SUS</span>
      <span>OPT</span>
      {model.character_plays?.map((key) => {
        const cp = CPlays.find((cp) => cp.name === key);
        if (!cp) {
          return null;
        }
        return (
          <React.Fragment key={key}>
            <CPName text={cp.name} />
            <span>
              {String(cp.CST)
                .split(",")
                .map((s, idx) => (
                  <span key={idx}>
                    {idx > 0 && "/"}
                    {{
                      CP: <GBIcon icon={gbcp ? "ball" : "GB"} size={18} />,
                      CP2: <GBIcon icon={gbcp ? "trophy" : "GBT"} size={18} />,
                    }[s] || <span>{s}</span>}
                  </span>
                ))}
            </span>
            <span>
              {cp.RNG}
              {typeof cp.RNG === "number" && '"'}
            </span>
            <span>
              <BooleanIcon test={cp.SUS} />
            </span>
            <span>
              <BooleanIcon test={cp.OPT} />
            </span>
            <div className={`text ${key}`}>{textIconReplace(cp.text)}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const MemoCardFront = React.memo(CardFront);
export { MemoCardFront as CardFront };
