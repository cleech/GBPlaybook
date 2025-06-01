import { cx } from "@emotion/css";

const Icon = (props: { className?: string }) => {
  const { className, ...otherProps } = props;
  return (
    <svg className={cx('pbicon', 'pbicon-6', className)}
      {...otherProps}
      viewBox="0 0 32 32">
      <path d="M15.929 32c6.903 0 10.497-6.040 10.497-11.145 0-4.457-2.948-9.061-8.7-9.061-2.158 0-3.667 0.79-3.667 0.79l0.358 1.87c4.745-1.582 6.759 4.243 6.759 7.981 0 3.594-1.582 7.405-4.601 7.405-3.523 0-5.537-5.752-5.537-11.577-0.144-7.261 3.306-15.747 12.079-16.322l-0.288-1.941c-11.504 0-17.256 10.209-17.256 18.982 0 6.615 3.379 13.013 10.353 13.013z"></path>
    </svg>
  )
};

export default Icon;
