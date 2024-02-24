import React, { CSSProperties, useEffect, useState } from "react";
import GBImages from "./GBImages";
import { useData } from "./DataContext";

import GBIcon, { PB } from "./GBIcon";
import "./CardFront.css";

import { textIconReplace } from "./CardUtils";
import Color from "color";

import { Guild } from "./DataContext.d";
import { useStore } from "../models/Root";
import { GBGuildDoc, GBModelExpanded } from "../models/gbdb";
import { Observable } from "rxjs";

interface CardFrontProps {
  model: GBModelExpanded;
  health$?: Observable<number>;
  style: GBCardCSS;
  className?: string;
  noBackground?: boolean;
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

  const { settings } = useStore();
  const { gbdb: db } = useData();

  const [guild1, setGuild1] = useState<GBGuildDoc | null>(null);
  const [guild2, setGuild2] = useState<GBGuildDoc | null>(null);

  useEffect(() => {
    let isLive = true;
    if (!db) {
      return;
    }
    const fetchData = async () => {
      const [guild1, guild2] = await Promise.all([
        db.guilds.findOne().where({ name: model.guild1 }).exec(),
        db.guilds.findOne().where({ name: model.guild2 }).exec(),
      ]);
      if (isLive) {
        setGuild1(guild1);
        setGuild2(guild2);
      }
    };
    fetchData().catch(console.error);
    return () => {
      isLive = false;
    };
  }, [db, model.guild1, model.guild2]);

  if (!guild1) {
    return null;
  }

  const gbcp =
    settings.cardPreferences.perferedStyled === "gbcp" &&
    (GBImages.has(`${key}_gbcp_front`) || GBImages.has(`${key}_full`));

  const image = gbcp
    ? GBImages.get(`${key}_full`) ??
      GBImages.get(`${key}_gbcp_front`) ??
      GBImages.get(`${key}_front`)
    : GBImages.get(`${key}_front`) ??
      GBImages.get(`${key}_full`) ??
      GBImages.get(`${key}_gbcp_front`);

  return (
    <div
      className={`card-front ${key} ${gbcp && "gbcp"} ${props.className}`}
      style={{
        "--team-color": guild1.color,
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
        "--mom-color": guild1.shadow,
        "--mom-border-color": guild1.darkColor,
        backgroundImage: props.noBackground ? undefined : `url(${image})`,
        ...props.style,
      }}
    >
      <div className={`overlay ${gbcp ? "gbcp" : ""}`}>
        <div className="font-top-box">
          <NamePlate model={model} guild={guild1} />
          <StatBox model={model} />
        </div>
        <Playbook model={model} gbcp={gbcp} />
        <div className="character-plays-wrapper">
          <CharacterPlays model={model} gbcp={gbcp} />
        </div>
        <HealthBoxes model={model} health$={props.health$} />
      </div>
    </div>
  );
};

const NamePlate = ({
  model,
  guild,
}: {
  model: GBModelExpanded;
  guild: Guild;
}) => (
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

const HealthBoxes = ({
  model,
  health$,
}: {
  model: GBModelExpanded;
  health$?: Observable<number>;
}) => {
  const [health, setHealth] = useState<number>(model.hp);
  useEffect(() => {
    let observer = health$?.subscribe((newHealth) => setHealth(newHealth));
    return () => observer?.unsubscribe();
  }, [health$]);

  return (
    <div className="health">
      {[...Array(model.hp).keys()].map((key) => (
        <div
          className={`health-box ${key + 1 > health ? "damaged" : ""}`}
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
  );
};

const Playbook = ({
  model,
  gbcp = false,
}: {
  model: GBModelExpanded;
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

const StatBox = ({ model }: { model: GBModelExpanded }) => (
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
  model: GBModelExpanded;
  gbcp?: boolean;
}) => (
  <div className="character-plays">
    <span className="dropcap">
      <span>Character </span>
      <span>Plays</span>
    </span>
    <span>CST</span>
    <span>RNG</span>
    <span>SUS</span>
    <span>OPT</span>
    {model.character_plays.map((cp) => (
      <React.Fragment key={cp.name}>
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
        <div className={`text ${cp.name}`}>{textIconReplace(cp.text)}</div>
      </React.Fragment>
    ))}
  </div>
);

const MemoCardFront = React.memo(CardFront);
export { MemoCardFront as CardFront };
