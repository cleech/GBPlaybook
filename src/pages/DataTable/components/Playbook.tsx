import { CSSProperties } from "react";
import { cx } from "@emotion/css";
import { PB } from "../../../components/GBIcon";
import { GBModelExpanded } from "../../../models/gbdbTypes";
import "./Playbook.css";

interface PlaybookProps {
  model: GBModelExpanded;
  size?: string | number;
}

export const Playbook = ({ model, size }: PlaybookProps) => {
  return (
    <div 
      className={cx("vpb-container", model.id)}
      style={{ 
        "--size": typeof size === 'number' ? `${size}px` : size || '30px',
        "--team-color": model.guild1.color,
        "--guild1-color": model.guild1.color,
        "--guild2-color": model.guild2 ? model.guild2.color : undefined,
        "--mom-color": model.guild1.shadow,
        "--mom-border-color": model.guild1.darkColor,
      } as CSSProperties}
    >
      <div className="vpb-grid">
        {model.playbook?.map((row, rowIndex) => (
          row?.map((pbm, colIndex) => {
            const [pb, mom] = pbm ? pbm.split(";") : [null, null];
            return (
              <div
                className={cx('vpb-result', { 'vpb-spacer': !pb }, { 'vpb-momentus': !!mom })}
                key={`${rowIndex}-${colIndex}`}
                style={{ "--col": colIndex } as CSSProperties}
              >
                {pb
                  ? pb.split(",").map((p, i) => (
                    <PB icon={p} key={i} />
                  ))
                  : null}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};
