import React, { useState, useRef, useLayoutEffect } from "react";
import GBImages from "./GBImages";
import { useData } from "./DataContext";
import { Observer } from "mobx-react-lite";

import GBIcon, { PB } from "./GBIcon";
import "./CardFront.css";

import useFitText from "use-fit-text";
import { textIconReplace } from "./CardUtils";
import Color from "color";

const CardFront = (props) => {
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

  const { data, loading } = useData();
  if (loading) {
    return null;
  }

  const guild = data.Guilds.find(
    (g) => g.name === (props.guild ?? model.guild1)
  );
  const guild1 = data.Guilds.find((g) => g.name === model.guild1);
  const guild2 = data.Guilds.find((g) => g.name === model.guild2);

  // const image = GBImages[key + "_gbcp_front"] || GBImages[key + "_front"];
  const image = GBImages[key + "_front"];

  return (
    <div
      className={`card-front ${key} ${model.gbcp && "gbcp"} ${props.className}`}
      // ref={targetRef}
      style={{
        // "--scale": scale,
        "--team-color": guild.color,
        /* not the best way to do this */
        // "--gbcp-color": Color(guild2 ? guild2.color : guild1.color).mix(
        //   Color.rgb(240, 230, 210),
        //   0.9
        // ),
        "--gbcp-color": Color(guild1.shadow ?? guild1.color).mix(
          Color.rgb(240, 230, 210),
          0.9
        ),
        "--guild1-color": guild1.color,
        "--guild2-color": guild2 ? guild2.color : undefined,
        "--mom-color": guild.shadow,
        "--mom-border-color": guild.darkColor,
        // backgroundImage: `url(${GBImages[key + "_front"]})`,
        backgroundImage: `url(${image})`,
        ...props.style,
      }}
    >
      <div className={`overlay ${model.gbcp ? "gbcp" : ""}`}>
        <div className="font-top-box">
          <NamePlate model={model} guild={guild} />
          <StatBox model={model} />
        </div>
        <Playbook model={model} />
        <div className="character-plays-wrapper">
          <CharacterPlays model={model} />
        </div>
        <HealthBoxes model={model} />
      </div>
    </div>
  );
};

const NamePlate = ({ model, guild }) => {
  let { fontSize, ref } = useFitText();
  return (
    <div className="name-plate">
      <div className="guild-icon">
        <GBIcon id="guild-icon" icon={guild.name} />
        {/* <GBIcon id="guild-icon-gbcp" icon={`${guild.name}-GBCP`} /> */}
        <GBIcon id="guild-icon1" icon={model.guild1} />
        <GBIcon id="guild-icon2" icon={model.guild2} />
      </div>
      <div className="name-plate-right">
        <div className="name">
          <div className="dropcap" ref={ref} style={{ fontSize: fontSize }}>
            {model.name.split(/(?=[A-Z])/).map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        </div>
        <div className="reach">Melee Zone {model.reach ? 2 : 1}"</div>
      </div>
    </div>
  );
};

const HealthBoxes = ({ model }) => (
  <Observer>
    {() => (
      <div className="health">
        {[...Array(model.hp).keys()].map((key) => (
          <div
            className={`health-box ${key + 1 > model.health ? "damaged" : ""}`}
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

const Playbook = ({ model }) => {
  const classes = (pbm) => {
    const classNames = ["playbook-result"];
    const [pb, mom] = pbm ? pbm.split(";") : [null, null];
    if (mom) {
      classNames.push("momentus");
    }
    if (!pb) {
      classNames.push("spacer");
    }
    return classNames.join(" ");
  };
  return (
    <div className="playbook">
      {model.playbook.map((row, index) => {
        return row.flatMap((pbm, key) => (
          <div
            className={classes(pbm)}
            key={index * 7 + key}
            style={{
              "--col": key,
            }}
          >
            {pbm ? <PB icon={pbm} /> : null}
          </div>
        ));
      })}
    </div>
  );
};

const StatBox = ({ model }) => (
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

function BooleanIcon({ test }) {
  return <GBIcon icon={test ? "checkmark" : "ballotX"} size={14} />;
}

function CPName({ text }) {
  const name = text.split("[", 1)[0];
  const arg = text.replace(/[^[]*(\[.*\])?/, " $1");
  return (
    <div className="name">
      <span>{name}</span>
      <span>{arg}</span>
    </div>
  );
}

const CharacterPlays = ({ model }) => {
  const { data, loading } = useData();
  if (loading) {
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
      {model.character_plays.map((key) => {
        const cp = CPlays.find((cp) => cp.name === key);
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
                      CP: <GBIcon icon="GB" size={18} />,
                      CP2: <GBIcon icon="GBT" size={18} />,
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

export { CardFront };
