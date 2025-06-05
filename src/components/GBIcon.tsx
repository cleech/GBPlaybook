import React from "react";

import "./GBIcon.css";

// import playbookDefs from "../assets/playbook-symbol-defs.svg";
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

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
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


import DMG1 from "./pbicons/1";
import DMG2 from "./pbicons/2";
import DMG3 from "./pbicons/3";
import DMG4 from "./pbicons/4";
import DMG5 from "./pbicons/5";
import DMG6 from "./pbicons/6";
import DMG7 from "./pbicons/7";
import DMG8 from "./pbicons/8";
import CP from "./pbicons/CP";
import CP2 from "./pbicons/CP2";
import CP2gbcp from "./pbicons/CP-2gbcp";
import CPgbcp from "./pbicons/CP-gbcp";
import D from "./pbicons/D";
import DD from "./pbicons/DD";
import KD from "./pbicons/KD";
import P from "./pbicons/P";
import PD from "./pbicons/PD";
import PP from "./pbicons/PP";
import T from "./pbicons/T";

const pbMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "1": DMG1,
  "2": DMG2,
  "3": DMG3,
  "4": DMG4,
  "5": DMG5,
  "6": DMG6,
  "7": DMG7,
  "8": DMG8,
  "CP": CP,
  "CP2": CP2,
  "CP2-gbcp": CP2gbcp,
  "CP-gbcp": CPgbcp,
  "D": D,
  "DD": DD,
  "KD": KD,
  "P": P,
  "PD": PD,
  "PP": PP,
  "T": T,
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
  );
}

interface PBProps {
  icon: string;
  size?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function PB(props: PBProps) {
  const { icon, size, style, className, ...otherProps } = props;
  const i = icon.replace(/</g, "D").replace(/>/g, "P");

  const computedStyle: React.CSSProperties = {
    ...(size ? { width: size, height: size } : {}),
    ...(style && style.height ? { fontSize: style.height } : {}),
    ...(props.style || {}),
  };
  try {
    return (
      pbMap[i]({ className: className, style: computedStyle, ...otherProps })
    );
  } catch (e) {
    console.error(icon);
    console.error(e);
  }
}
