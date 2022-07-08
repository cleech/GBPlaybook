import "./GBIcon.css";

import playbookDefs from "../assets/playbook-symbol-defs.svg";
import gbDefs from "../assets/gb-symbol-defs.svg";

const GBIcon = (props) => {
  const { icon, size, style } = props;

  const computedStyle = {
    ...(size ? { width: size, height: size } : {}),
    ...(style && style.height ? { fontSize: style.height } : {}),
    ...(props.style || {}),
  };

  return (
    <svg className={`gbicon gbicon-${icon}`} {...props} style={computedStyle}>
      <use href={`${gbDefs}#gbicon-${icon}`} />
    </svg>
  );
};
export default GBIcon;

const PB = (props) => {
  const { icon, size, style } = props;

  const [pb, mom] = icon ? icon.split(";") : [null, null];
  const i = pb.replace(",", "-").replace(/</g, "D").replace(/>/g, "P");

  const computedStyle = {
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
