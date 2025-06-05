import { cx } from "@emotion/css";

const Icon = (props: { className?: string }) => {
  const { className, ...otherProps } = props;
  return (
    <svg className={cx('pbicon', 'pbicon-PD', className)}
      {...otherProps}
      viewBox="0 0 46 32">
      <path d="M0 0v7.626l11.711 8.377-11.711 8.371v7.626l22.359-15.984-0.050-0.013 0.050-0.019zM46 0l-22.34 15.984 0.050 0.013-0.050 0.019 22.34 15.984v-7.626l-11.717-8.377 11.717-8.371z"></path>
    </svg>
  )
};

export default Icon;
