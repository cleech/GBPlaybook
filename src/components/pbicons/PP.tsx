import { cx } from "@emotion/css";

const Icon = (props: { className?: string }) => {
  const { className, ...otherProps } = props;
  return (
    <svg className={cx('pbicon', 'pbicon-PP', className)}
      {...otherProps}
      viewBox="0 0 46 32">
      <path d="M0 0v7.616l15.694 10.837 7.466-2.458z"></path>
      <path d="M0 24.369v7.631l23.162-15.992-7.466-2.475z"></path>
      <path d="M22.838 0v7.616l15.677 10.837 7.483-2.458z"></path>
      <path d="M22.838 24.369v7.631l23.162-15.992-7.483-2.475z"></path>
    </svg>
  )
};

export default Icon;
