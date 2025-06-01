import { cx } from "@emotion/css";

const Icon = (props: { className?: string }) => {
  const { className, ...otherProps } = props;
  return (
    <svg className={cx('pbicon', 'pbicon-D', className)}
      {...otherProps}
      viewBox="0 0 32 32">
      <path d="M27.618 0.002l-23.236 15.983 0.052 0.013-0.052 0.019 23.236 15.983v-7.625l-12.183-8.383 12.183-8.383v-7.608z"></path>
    </svg>
  )
};

export default Icon;
