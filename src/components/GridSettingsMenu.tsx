import { useState, MouseEvent } from "react";
import { IconButton, Menu, Tooltip, Typography, List, ListItemButton, ListItemText, Divider } from "@mui/material";
import { Apps as Icon } from "@mui/icons-material";
import { reSort } from "../utils/reSort";

interface GuildInfo {
  key: string,
  id: string,
  name: string,
  icon: string,
  disabled: boolean,
}

const pairedOrder = [
  'Alchemists', 'Lamplighters', 'Blacksmiths', 'Brewers', 'Butchers', 'Cooks', 'Engineers', 'Miners', 'Farmers', 'Shepherds', 'Fishermen', 'Navigators', 'Hunters', 'Falconers', 'Masons', 'Lumberjacks', 'Morticians', 'Ratcatchers', 'Union', 'Order'
];

export default function GridSettingsMenu(props: {
  list: GuildInfo[],
  setList: (arg: GuildInfo[]) => void,
  edit: boolean,
  setEdit: (arg: boolean) => void,
}) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();
  const menuOpen = Boolean(menuAnchor);

  const menuIconClick = (e: MouseEvent<HTMLElement>) => {
    if (props.edit)
      props.setEdit(false);
    else
      setMenuAnchor(e.currentTarget);
  }

  const menuClose = () => {
    setMenuAnchor(undefined);
  }

  const [tipShown, setTipShown] = useState(false);

  return (
    <>
      <Tooltip arrow
        title={props.edit ? "Done Editing" : "Grid Customization"}
        placement="left"
        open={tipShown || props.edit}
        onOpen={() => setTipShown(true)}
        onClose={() => setTipShown(false)}
      >
        <IconButton size="small" onClick={menuIconClick}>
          <Icon {...(props.edit ? { color: 'success' } : {})} />
        </IconButton>
      </Tooltip >
      <Menu
        open={menuOpen}
        onClose={menuClose}
        anchorEl={menuAnchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Typography variant="h5" textAlign="center">
          Grid Layout
        </Typography>
        <Divider />
        <List>
          <ListItemButton onClick={() => {
            props.setList([...props.list].sort((a, b) => a.id.localeCompare(b.id)));
          }}>
            <ListItemText>
              Reset to Alphabetical
            </ListItemText>
          </ListItemButton>

          <ListItemButton onClick={() => {
            props.setList(reSort([...props.list], "id", pairedOrder));
          }}>
            <ListItemText>
              Pair Minors with Majors
            </ListItemText>
          </ListItemButton>

          <ListItemButton onClick={() => {
            props.setEdit(true);
            menuClose();
          }}>
            <ListItemText>
              Custom Order
            </ListItemText>
          </ListItemButton>
        </List>
      </Menu >
    </>
  )
}
