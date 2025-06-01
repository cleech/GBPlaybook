import { cx } from "@emotion/css";

const Icon = (props: { className: string }) => (
  <svg id="gbicon-GB"
    className={cx('gbicon', 'gbicon-GB', props.className)}
    viewBox="0 0 16 16">

  </svg>
);

export default Icon;
