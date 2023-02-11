import { Typography } from "@mui/material";
import { useData } from "./DataContext";

const VersionTag = () => {
  const { version } = useData();
  return (
    <Typography
      sx={{
        position: "absolute",
        bottom: 0,
        right: 0,
        color: "text.disabled",
      }}
    >
      [{version}]
    </Typography>
  );
};
export default VersionTag;
