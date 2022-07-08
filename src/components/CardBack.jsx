import React, { useState, useRef, useLayoutEffect } from "react";
import GBImages from "./GBImages";
import { useData } from "./DataContext";

import GBIcon from "./GBIcon";
import "./CardBack.css";

import { textIconReplace } from "./CardUtils";
import Color from "color";

const CardBack = (props) => {
  const model = props.model;
  const key = model.id;

  // const targetRef = useRef();
  // const [scale, setScale] = useState(props.scale ?? 1.0);
  // function updateSize() {
  //   // let newScale = targetRef.current.getBoundingClientRect().width / 500;
  //   let newScale = targetRef.current.getBoundingClientRect().height / 700;
  //   // console.log(`scale = ${newScale}`);
  //   setScale(newScale);
  // }
  // useLayoutEffect(() => {
  //   updateSize();
  //   window.addEventListener("resize", updateSize);
  //   return () => window.removeEventListener("resize", updateSize);
  // });
  // }, [targetRef.current]);
  
  const { data } = useData();
  const guild = data.Guilds.find(
    (g) => g.name === (props.guild ?? model.guild1)
  );

  // const image = GBImages[key + "_gbcp_back"] || GBImages[key + "_back"];
  const image = GBImages[key + "_back"];

  return (
    <div
      className={`card-back ${key} ${model.gbcp && "gbcp"} ${props.className}`}
      // ref={targetRef}
      style={{
        "--gbcp": model.gbcp,
        // "--scale": scale,
        "--team-color": guild.color,
        "--gbcp-color": Color(guild.shadow ?? guild.color).mix(
          Color.rgb(240, 230, 210),
          0.9
        ),
        "--mom-color": guild.shadow,
        "--mom-border-color": guild.darkColor,
        // backgroundImage: `url(${GBImages[key + "_back"]})`,
        backgroundImage: `url(${image})`,
        ...props.style,
      }}
    >
      <div className={`overlay ${model.gbcp ? "gbcp" : ""}`}>
        <div className="container">
          <div className="name-plate">
            <div className="guild-icon">
              <GBIcon id="guild-icon" icon={guild.name} />
              <GBIcon id="guild-icon1" icon={model.guild1} />
              <GBIcon id="guild-icon2" icon={model.guild2} />
            </div>
            <div className="name dropcap">
              {model.name.split(/(?=[A-Z])/).map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
          </div>
          <CharacterTraits model={model} />
          <Heroic model={model} />
          <Legendary model={model} />
        </div>
        <div className="footer">
          <div className="tags">{model.types}</div>
          <div className="right">
            <div className="icons">
              <FooterIcon icon="GB" />
              {model.guild2 && <FooterIcon icon={model.guild2} />}
              <FooterIcon icon={model.guild1} />
            </div>
            <div className="base-size">{`Size ${model.base} mm`}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FooterIcon = ({ icon }) => (
  <div className="icon wrapper">
    <GBIcon
      icon="blank"
      style={{ position: "absolute", zIndex: -1, fill: "white" }}
    />
    {/* <div
      style={{
        width: "38px",
        height: "38px",
        margin: "3px",
        borderRadius: "38px",
        backgroundColor: "white",
        position: "absolute",
        zIndex: -1,
      }}
    /> */}
    <GBIcon icon={icon} />
  </div>
);

function CTName({ text }) {
  const name = text.split("[", 1)[0];
  const arg = text.replace(/[^[]*(\[.*\])?/, " $1");
  return (
    <div>
      <span>{name}</span>
      <span>{arg}</span>
    </div>
  );
}

const CharacterTraits = ({ model }) => {
  const { data, loading } = useData();
  if (loading) {
    return null;
  }
  const Traits = data["Character Traits"];
  return (
    <div>
      <div className="header dropcap">
        <span>Character </span>
        <span>Traits</span>
      </div>
      {model.character_traits.map((key, index) => {
        const ct = Traits.find((ct) => ct.name === key.replace(/ \[.*\]/, ""));
        return (
          <div className="character-trait" key={`${key}-${index}`}>
            <div className={`trait ${ct.active && "active"}`}>
              <CTName text={key} />
            </div>
            <span className="text">{textIconReplace(ct.text)}</span>
          </div>
        );
      })}
    </div>
  );
};

const Heroic = ({ model }) => {
  if (!model.heroic) {
    return null;
  }
  const name = model.heroic.split("\n", 1)[0];
  const text = model.heroic.split("\n").slice(1).join("\n");
  return (
    <div>
      <div className="header dropcap">
        <span>Heroic </span>
        <span>Play</span>
      </div>
      <div className="heroic">
        <CTName text={name} />
        <span>{textIconReplace(text)}</span>
      </div>
    </div>
  );
};

const Legendary = ({ model }) => {
  if (!model.legendary) {
    return null;
  }
  const name = model.legendary.split("\n", 1)[0];
  const text = model.legendary.split("\n").slice(1).join("\n");
  return (
    <div>
      <div className="header dropcap">
        <span>Legendary </span>
        <span>Play</span>
      </div>
      <div className="legendary">
        <CTName text={name} />
        <span>{textIconReplace(text)}</span>
      </div>
    </div>
  );
};

export { CardBack };
