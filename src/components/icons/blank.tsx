import { cx } from "@emotion/css";

const Icon = (props: { className?: string }) => {
const { className, ...otherProps } = props;
return(
  <svg id="gbicon-blank"
    className={cx('gbicon', 'gbicon-blank', className)}
    {...otherProps}
    viewBox="0 0 16 16">
    <path d="M8.001 1.175c3.763 0 6.825 3.063 6.825 6.826s-3.061 6.825-6.825 6.825c-3.763 0-6.826-3.061-6.826-6.825s3.063-6.826 6.826-6.826z"></path>
</svg>
)};

export default Icon;
