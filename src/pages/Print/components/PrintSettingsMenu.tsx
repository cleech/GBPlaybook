import { useState, useEffect, MouseEvent } from "react";
import { Tooltip, IconButton, Menu, Stack, FormControlLabel, Checkbox } from "@mui/material";
import { Settings } from "@mui/icons-material";

import usePrintSettings from "./usePrintSettings";

export default function PrintSettingsMenu() {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(menuAnchor);
  const settingsClick = (e: MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  };
  const settingsClose = () => {
    setMenuAnchor(null);
  };

  const [paged, setPaged] = useState(true);

  const settings = usePrintSettings();
  const { doubleCard, setDouble, withBleed, setBleed } = settings;

  useEffect(() => {
    const size = doubleCard
      ? withBleed
        ? "5.25in 3.75in"
        : "5in 3.5in"
      : withBleed
        ? "2.75in 3.75in"
        : "2.5in 3.5in";
    const style = document.createElement("style");
    if (!paged) {
      style.innerHTML = `
      @media print {
        @page {
          size: ${size};
          margin: 0;
        }
        .Cards > .card {
          margin: 0;
        }
      }
      `;
    }
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [doubleCard, withBleed, paged]);

  return (
    <>
      <Tooltip title="Print Settings" arrow>
        <IconButton size="small" onClick={settingsClick}>
          <Settings />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={settingsOpen}
        onClose={settingsClose}
      >
        <Stack margin={2}>
          <FormControlLabel
            label="Double Wide Cards"
            control={
              <Checkbox
                checked={doubleCard}
                onChange={() => setDouble(!doubleCard)}
              />
            }
          />
          <FormControlLabel
            label="With Print Bleed"
            control={
              <Checkbox
                checked={withBleed}
                onChange={() => setBleed(!withBleed)}
              />
            }
          />
          <FormControlLabel
            label="Set Page to Card Size"
            control={
              <Checkbox checked={!paged} onChange={() => setPaged(!paged)} />
            }
          />
        </Stack>
      </Menu >
    </>
  );
};
