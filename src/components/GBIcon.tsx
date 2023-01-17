import React from "react";
import "./GBIcon.css";

import playbookDefs from "../assets/playbook-symbol-defs.svg";
import gbDefs from "../assets/gb-symbol-defs.svg";

interface GBIconProps {
  icon?: string;
  size?: string | number;
  style?: React.CSSProperties;
  className?: string;
  fontSize?: string | number;
  id?: string;
}

const GBIcon = (props: GBIconProps) => {
  const { icon, size, style, className, ...otherProps } = props;

  const computedStyle: React.CSSProperties = {
    ...(style || {}),
    ...(size ? { width: size, height: size } : {}),
    ...(style && style.height ? { fontSize: style.height } : {}),
  };

  return (
    <svg
      className={`gbicon gbicon-${icon} ${className || ""}`}
      style={computedStyle}
      {...otherProps}
    >
      <use href={`${gbDefs}#gbicon-${icon}`} />
    </svg>
  );
};
export default GBIcon;

interface PBProps {
  icon: string;
  size?: string;
  style?: React.CSSProperties;
}

const PB = (props: PBProps) => {
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
};
export { PB };
