import { cx } from "@emotion/css";

const Icon = (props: { className?: string }) => {
  const { className, ...otherProps } = props;
  return (
    <svg className={cx('pbicon', 'pbicon-1', className)}
      {...otherProps}
      viewBox="0 0 32 32">
      <path d="M8.2 32l16.25-0.288 0.215-1.583-5.896-0.432c0 0 0.215-1.151 0.215-2.517v-21.644c0-3.524 0.575-5.394 0.575-5.394l-0.144-0.144c0 0-3.955 1.509-12.080 3.738l0.288 2.158 4.818-1.151c1.295-0.288 1.509-0.144 1.509 2.733v19.703c0 1.366-0.144 2.66-3.236 2.877l-2.517 0.144z"></path>
    </svg>
  )
};

export default Icon;
