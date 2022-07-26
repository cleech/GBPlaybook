import React from "react";
import "./App.css";

import {
  Outlet,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import Link, { LinkProps } from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useLocation } from "react-router-dom";
import { CssBaseline } from "@mui/material";

// let hideAppBar = false;
// export const setHideAppBar = (hide: boolean) => {
//   hideAppBar = hide;
// };

function MyAppBar(props: any) {
  const location = useLocation();
  // const [hideAppBar, setHideAppBar] = useState(false);
  return (
    // <Slide appear={false} direction="down" in={!hideAppBar}>
    <AppBar position="static">
      <Toolbar variant="dense" sx={{ flexDirection: "row-reverse" }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          onClick={props.onClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography>{location.pathname}</Typography>
      </Toolbar>
    </AppBar>
    // </Slide>
  );
}

const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3d708f",
    },
    secondary: {
      main: "#ffb300",
    },
    background: {
      default: "#121a22",
      paper: "#344556",
      // paper: "#121212",
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});

function App() {
  const [drawer, setDrawer] = React.useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <MyAppBar onClick={() => setDrawer(true)} />
        <Drawer
          // variant="persistent"
          anchor="right"
          open={drawer}
          onClose={() => setDrawer(false)}
        >
          <List>
            <ListItem>
              <img
                src={require("./assets/img/logo.png")}
                style={{ borderRadius: 5.4 }}
              />
              <ListItemText style={{ textAlign: "center" }}>
                GB Playbook
              </ListItemText>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                href="/#/GamePlay"
                onClick={() => setDrawer(false)}
              >
                <ListItemText>GamePlay</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                href="/#/Library"
                onClick={() => setDrawer(false)}
              >
                <ListItemText>Library</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemText>External Resources:</ListItemText>
            </ListItem>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "2em",
              }}
            >
              <ListItem disablePadding>
                <Link
                  component="a"
                  href="https://www.longshanks.org/systems/guildball/tools/documents/rules/rules_s4.pdf"
                >
                  Core Rules
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link
                  component="a"
                  href="https://www.longshanks.org/systems/guildball/tools/documents/opd/"
                >
                  Organized Play Rules
                </Link>
              </ListItem>
            </nav>
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemText>Community Links:</ListItemText>
            </ListItem>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "2em",
              }}
            >
              <ListItem disablePadding>
                <Link component="a" href="https://discord.gg/fvpFSfm976">
                  GBCP Discord
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link
                  component="a"
                  href="https://www.longshanks.org/systems/guildball/"
                >
                  Longshanks
                </Link>
              </ListItem>
            </nav>
          </List>
        </Drawer>
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;
