import React, { useEffect, useState } from "react";
import GBImages from "../utils/GBImages";

import GBIcon from "./GBIcon";
import "./CardBack.css";

import { textIconReplace } from "./CardUtils";
import Color from "color";

import { GBCardCSS } from "./CardFront";
import { useSettings } from "../hooks/useSettings";
import { GBModelExpanded } from "../models/gbdb";
import { useRxData } from "../hooks/useRxQuery";
import { map } from "rxjs";

interface CardBackProps {
  model: GBModelExpanded;
  style: GBCardCSS;
  guild?: string;
  className?: string;
  noBackground?: boolean;
}

const CardBack = (props: CardBackProps) => {
  const model = props.model;
  const key = model.id;

  const { setting$ } = useSettings();
  const [style, setStyle] = useState<"sfg" | "gbcp">();
  useEffect(() => {
    const sub = setting$
      ?.pipe(map((s) => s?.toJSON().data.cardPreferences.preferredStyle))
      .subscribe((style) => setStyle(style));

    return () => sub?.unsubscribe();
  });

  const guild = useRxData(
    (db) => db.guilds.findOne().where({ name: model.guild1 }).exec(),
    [model.guild1]
  );

  if (!guild) {
    return null;
  }

  const gbcp =
    style === "gbcp" &&
    (GBImages.has(`${key}_gbcp_front`) || GBImages.has(`${key}_full`));

  const image = gbcp
    ? GBImages.get(`${key}_full`) ??
      GBImages.get(`${key}_gbcp_back`) ??
      GBImages.get(`${key}_back`)
    : GBImages.get(`${key}_back`) ??
      GBImages.get(`${key}_full`) ??
      GBImages.get(`${key}_gbcp_back`);

  return (
    <div
      className={`card-back ${key} ${gbcp && "gbcp"} ${props.className}`}
      // ref={targetRef}
      style={{
        "--team-color": guild.color,
        "--gbcp-color": Color(guild.shadow ?? guild.color).mix(
          Color.rgb(254, 246, 227),
          0.9
        ),
        "--mom-color": guild.shadow,
        "--mom-border-color": guild.darkColor,
        backgroundImage: props.noBackground ? undefined : `url(${image})`,
        ...props.style,
      }}
    >
      <div className={`overlay ${gbcp ? "gbcp" : ""}`}>
        <div className="container">
          <div className="name-plate">
            <div className="guild-icon">
              <GBIcon id="guild-icon" icon={guild.name} />
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
              <FooterIcon icon={gbcp ? "gbcp" : "GB"} />
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

const FooterIcon = ({ icon }: { icon: string }) => (
  <div className="icon wrapper">
    <GBIcon icon={icon} />
  </div>
);

function CTName({ text }: { text: string }) {
  const name = text.split("[", 1)[0];
  const arg = text.replace(/[^[]*(\[.*\])?/, " $1");
  return (
    <div>
      <span>{name}</span>
      <span>{arg}</span>
    </div>
  );
}

const CharacterTraits = ({ model }: { model: GBModelExpanded }) => (
  <>
    <div className="header dropcap">
      <span>Character </span>
      <span>Traits</span>
    </div>
    {model.character_traits.map((ct, index) => (
      <React.Fragment key={`ct-${index}`}>
        <div className="character-trait" key={`${ct.name}-${index}`}>
          <div className={`trait ${ct.active && "active"}`}>
            <CTName
              text={ct.name.concat(ct.parameter ? ` [${ct.parameter}]` : "")}
            />
          </div>
          <span className="text">{textIconReplace(ct.text)}</span>
        </div>
        <div style={{ flexGrow: 1, maxHeight: "1em" }} />
      </React.Fragment>
    ))}
  </>
);

const Heroic = ({ model }: { model: GBModelExpanded }) => {
  if (!model.heroic) {
    return null;
  }
  const name = model.heroic.split("\n", 1)[0];
  const text = model.heroic.split("\n").slice(1).join("\n");
  return (
    <>
      <div className="header dropcap">
        <span>Heroic </span>
        <span>Play</span>
      </div>
      <div className="heroic">
        <CTName text={name} />
        <span>{textIconReplace(text)}</span>
      </div>
      <div style={{ flexGrow: 1, maxHeight: "1em" }} />
    </>
  );
};

const Legendary = ({ model }: { model: GBModelExpanded }) => {
  if (!model.legendary) {
    return null;
  }
  const name = model.legendary.split("\n", 1)[0];
  const text = model.legendary.split("\n").slice(1).join("\n");
  return (
    <>
      <div className="header dropcap">
        <span>Legendary </span>
        <span>Play</span>
      </div>
      <div className="legendary">
        <CTName text={name} />
        <span>{textIconReplace(text)}</span>
      </div>
      <div style={{ flexGrow: 1, maxHeight: "1em" }} />
    </>
  );
};

const MemoCardBack = React.memo(CardBack);
export { MemoCardBack as CardBack };
