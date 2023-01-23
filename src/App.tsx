import React, { createContext, ReactNode, useContext, useState } from "react";
import "./App.css";

import {
  Outlet,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  NavLink,
} from "react-router-dom";
import Link, { LinkProps } from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Box, Portal } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { useStore } from "./models/Root";

const AppBarContext = createContext<HTMLElement | null>(null);

export const AppBarContent = (props: { children?: ReactNode }) => {
  const containerRef = useContext(AppBarContext);
  return <Portal container={containerRef}>{props.children}</Portal>;
};

const MyAppBar = React.forwardRef<
  HTMLElement,
  { onClick: React.MouseEventHandler }
>((props, ref) => (
  <AppBar position="static" className="no-print">
    <Toolbar variant="dense">
      <Box
        ref={ref}
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          mr: "12px",
        }}
      />
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
));

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
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "linear-gradient(20deg, black, #121a22, #1d506f, #121a22, black)",
        },
        "@media print": {
          body: {
            background: "white",
          },
        },
      },
    },
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

const DrawerNavigationButton = (props: {
  to: string;
  onClick?: any;
  children?: React.ReactNode;
}) => {
  return (
    <NavLink
      to={props.to}
      style={{ textDecoration: "inherit", color: "inherit" }}
      onClick={props.onClick}
    >
      {({ isActive }) => (
        <ListItemButton selected={isActive}>{props.children}</ListItemButton>
      )}
    </NavLink>
  );
};

const App = () => {
  const [drawer, setDrawer] = useState(false);
  const [appBarContainer, setContainer] = useState<HTMLElement | null>(null);
  const { gamePlayRoute, libraryRoute } = useStore();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <MyAppBar
          ref={(el: HTMLElement) => setContainer(el)}
          onClick={() => setDrawer(true)}
        />
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
                alt=""
              />
              <ListItemText style={{ textAlign: "center" }}>
                GB Playbook
              </ListItemText>
            </ListItem>
            <Divider />
            <DrawerNavigationButton
              to={gamePlayRoute}
              onClick={() => setDrawer(false)}
            >
              <ListItemText>Game Play</ListItemText>
            </DrawerNavigationButton>
            <DrawerNavigationButton
              to={libraryRoute}
              onClick={() => setDrawer(false)}
            >
              <ListItemText>Library</ListItemText>
            </DrawerNavigationButton>
            <DrawerNavigationButton
              to={"/settings"}
              onClick={() => setDrawer(false)}
            >
              <ListItemText>Settings</ListItemText>
            </DrawerNavigationButton>
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemText>Experimental Tools:</ListItemText>
            </ListItem>
            <DrawerNavigationButton
              to={"/print"}
              onClick={() => setDrawer(false)}
            >
              <ListItemText>Card Printer</ListItemText>
            </DrawerNavigationButton>
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
        <AppBarContext.Provider value={appBarContainer}>
          <Outlet />
        </AppBarContext.Provider>
      </div>
    </ThemeProvider>
  );
};

export default App;
