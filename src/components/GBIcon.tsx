import React from "react";
// import { cx } from "@emotion/css";

import "./GBIcon.css";

import playbookDefs from "../assets/playbook-symbol-defs.svg";
// import gbDefs from "../assets/gb-symbol-defs.svg";

interface GBIconProps {
  icon: string;
  size?: string | number;
  style?: React.CSSProperties;
  className?: string;
  fontSize?: string | number;
  id?: string;
}


import Alchemists from "./icons/Alchemists";
import ballFull from "./icons/ball-full";
import ballotX from "./icons/ballotX";
import ball from "./icons/ball";
import bandage from "./icons/bandage";
import Blacksmiths from "./icons/Blacksmiths";
import blank from "./icons/blank";
import bleeding from "./icons/bleeding";
import Brewers from "./icons/Brewers";
import burning from "./icons/burning";
import Butchers from "./icons/Butchers";
import checkmark from "./icons/checkmark";
import Cooks from "./icons/Cooks";
import disease from "./icons/disease";
import Engineers from "./icons/Engineers";
import Falconers from "./icons/Falconers";
import Farmers from "./icons/Farmers";
import Fishermen from "./icons/Fishermen";
import gbcp from "./icons/gbcp";
import GB from "./icons/GB";
import GBT from "./icons/GBT";
import Hunters from "./icons/Hunters";
import knockDown from "./icons/knock-down";
import Lamplighters from "./icons/Lamplighters";
import Logo from "./icons/Logo";
import Masons from "./icons/Masons";
import Miners from "./icons/Miners";
import Morticians from "./icons/Morticians";
import Navigators from "./icons/Navigators";
import OrderGBCP from "./icons/Order-GBCP";
import Order from "./icons/Order";
import poison from "./icons/poison";
import Ratcatchers from "./icons/Ratcatchers";
import Shepherds from "./icons/Shepherds";
import skull from "./icons/skull";
import snared from "./icons/snared";
import trophy from "./icons/trophy";
import Union from "./icons/Union";

const iconMap: Record<string, React.FC<GBIconProps>> = {
  'Alchemists': Alchemists,
  'ball-full': ballFull,
  'ballotX': ballotX,
  'ball': ball,
  'bandage': bandage,
  'Blacksmiths': Blacksmiths,
  'blank': blank,
  'bleeding': bleeding,
  'Brewers': Brewers,
  'burning': burning,
  'Butchers': Butchers,
  'checkmark': checkmark,
  'Cooks': Cooks,
  'disease': disease,
  'Engineers': Engineers,
  'Falconers': Falconers,
  'Farmers': Farmers,
  'Fishermen': Fishermen,
  'gbcp': gbcp,
  'GB': GB,
  'GBT': GBT,
  'Hunters': Hunters,
  'knock-down': knockDown,
  'Lamplighters': Lamplighters,
  'Logo': Logo,
  'Masons': Masons,
  'Miners': Miners,
  'Morticians': Morticians,
  'Navigators': Navigators,
  'Order-GBCP': OrderGBCP,
  'Order': Order,
  'poison': poison,
  'Ratcatchers': Ratcatchers,
  'Shepherds': Shepherds,
  'skull': skull,
  'snared': snared,
  'trophy': trophy,
  'Union': Union,
}

export default function GBIcon(props: GBIconProps) {
  const { icon, size, style, className, ...otherProps } = props;

  const computedStyle: React.CSSProperties = {
    ...(style || {}),
    ...(size ? { width: size, height: size } : {}),
    ...(style && style.height ? { fontSize: style.height } : {}),
  };

  return (
    iconMap[icon]({ className: className, style: computedStyle, ...otherProps })
    // iconMap[icon]({})
  );
}

interface PBProps {
  icon: string;
  size?: string;
  style?: React.CSSProperties;
}

export function PB(props: PBProps) {
  const { icon, size, style } = props;
  const i = icon.replace(/</g, "D").replace(/>/g, "P");

  const computedStyle: React.CSSProperties = {
    ...(size ? { width: size, height: size } : {}),
    ...(style && style.height ? { fontSize: style.height } : {}),
    ...(props.style || {}),
  };
  return (
    <svg className={`pbicon pbicon-${i}`} style={computedStyle} {...props}>
      <use href={`${playbookDefs}#pbicon-${i}`} />
    </svg>
  );
}
