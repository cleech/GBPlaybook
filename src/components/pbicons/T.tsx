import { cx } from "@emotion/css";

const Icon = (props: { className?: string }) => {
  const { className, ...otherProps } = props;
  return (
    <svg className={cx('pbicon', 'pbicon-T', className)}
      {...otherProps}
      viewBox="0 0 32 32">
      <path d="M9.893 32l12.726-0.294 0.147-1.397-4.708-0.442c0 0 0.222-1.103 0.222-2.575v-24.351l0.514-0.514h4.341c3.605 0 5.149 0.958 5.002 5.738h1.766l1.472-8.165c0 0-1.472 0.294-3.458 0.294h-22.657c-1.913 0-3.163-0.294-3.163-0.294l-1.472 8.165h1.691c1.913-4.782 3.31-5.738 6.474-5.738h4.413v24.865c0 1.691-1.25 2.869-3.311 3.091z"></path>
    </svg>
  )
};

export default Icon;
