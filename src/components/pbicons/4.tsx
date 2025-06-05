import { cx } from "@emotion/css";

const Icon = (props: { className?: string }) => {
  const { className, ...otherProps } = props;
  return (
    <svg className={cx('pbicon', 'pbicon-4', className)}
      {...otherProps}
      viewBox="0 0 32 32">
      <path d="M5.281 23.251h12.175v4.082c0 1.676-1.239 2.843-3.281 3.063v1.604l12.030-0.292 0.146-1.384-4.082-0.438c0 0 0.218-1.093 0.218-2.551v-4.082h4.156l0.729-3.206h-4.885v-14.798c0-3.572 0.292-5.103 0.292-5.103l-0.218-0.146-3.426 0.801-14.507 19.829zM17.456 20.045h-9.622l9.842-13.56c-0.146 0.875-0.218 2.114-0.218 3.061z"></path>
    </svg>
  )
};

export default Icon;
