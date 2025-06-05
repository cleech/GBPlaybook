import { cx } from "@emotion/css";

const Icon = (props: { className?: string }) => {
  const { className, ...otherProps } = props;
  return (
    <svg className={cx('pbicon', 'pbicon-5', className)}
      {...otherProps}
      viewBox="0 0 32 32">
      <path d="M7.22 28.373c0 2.54 3.991 3.627 6.748 3.627 6.605 0 10.813-4.862 10.813-9.868 0-9.361-14.004-11.32-14.004-11.32l0.436-6.531h11.465l0.652-4.282c0 0-1.452 0.29-3.265 0.29h-10.884l-0.797 15.021c0 0 11.393 1.161 11.393 8.418 0 3.482-2.468 6.314-5.079 6.314-2.83 0-3.482-3.627-5.66-3.627-1.016 0-1.814 0.797-1.814 1.959z"></path>
    </svg>
  )
};

export default Icon;
