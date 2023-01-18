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
import { Box, Breadcrumbs } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Home, NavigateNext } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { useStore } from "./models/Root";
import _ from "lodash";

const breadCrumbNameMap: { [key: string]: string | JSX.Element } = {
  "/game": <Home />,
  "/game/draft": "Draft",
  "/game/draft/play": "Play",
  "/library": "Library",
  "/settings": "Settings",
};

function PathBreadCrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
      {pathnames.map((pathComponent, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        return last ? (
          <Typography color="text.primary" key={to}>
            {breadCrumbNameMap[to] || pathComponent}
          </Typography>
        ) : (
          <Link underline="hover" color="inherit" key={to} href={to}>
            {breadCrumbNameMap[to] || pathComponent}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

function MyAppBar(props: any) {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Box>
          <PathBreadCrumbs />
        </Box>
        <div style={{ flexGrow: 1 }} />
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          onClick={props.onClick}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
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
      // main: "#3399FF",
    },
    secondary: {
      main: "#ffb300",
    },
    background: {
      default: "#121a22",
      // default: 'rgb(15%, 20%, 25%)',
      // paper: 'rgb(15%, 20%, 25%)',
      // paper: "#344556",
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
  const { gamePlayRoute, libraryRoute } = useStore();
  const location = useLocation();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <MyAppBar onClick={() => setDrawer(true)} />
        <Drawer
          anchor="right"
          open={drawer}
          onClose={() => setDrawer(false)}
          PaperProps={{ sx: { width: "225px" } }}
          ModalProps={{ keepMounted: true }}
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
            <ListItemButton
              href={gamePlayRoute}
              selected={location.pathname.startsWith("/game")}
              onClick={() => setDrawer(false)}
            >
              <ListItemText>GamePlay</ListItemText>
            </ListItemButton>
            <ListItemButton
              href={libraryRoute}
              selected={location.pathname.startsWith("/library")}
              onClick={() => setDrawer(false)}
            >
              <ListItemText>Library</ListItemText>
            </ListItemButton>
            <ListItemButton
              href={"#/settings"}
              selected={location.pathname.startsWith("/settings")}
              onClick={() => setDrawer(false)}
            >
              <ListItemText>Settings</ListItemText>
            </ListItemButton>
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
                  Season 4 Core Rules
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link
                  component="a"
                  href="https://www.longshanks.org/systems/guildball/tools/documents/rules/faq_s4_20191220.pdf"
                >
                  Season 4 FAQ
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
