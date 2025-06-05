import { cx } from "@emotion/css";

const Icon = (props: { className?: string }) => {
  const { className, ...otherProps } = props;
  return (
    <svg id="gbicon-checkmark"
      className={cx('gbicon', 'gbicon-checkmark', className)}
      {...otherProps}
      viewBox="0 0 17 16">
      <path d="M10.133 5.020c-2.153 2.173-3.908 4.418-5.275 6.724l-0.378-0.847c-0.755-1.694-1.449-2.541-2.071-2.541-0.735 0-1.541 0.459-2.408 1.388 0.51 0.173 0.98 0.541 1.398 1.082s0.867 1.378 1.357 2.51l0.337 0.796c0.357 0.867 0.592 1.49 0.694 1.867 0.276-0.245 0.775-0.632 1.52-1.153l0.898-0.602c1.122-2.367 2.735-4.898 4.857-7.612s4.051-4.724 5.786-6.020l-0.429-0.612c-2.041 1.163-4.143 2.837-6.286 5.020z"></path>
    </svg>
  )
};

export default Icon;
