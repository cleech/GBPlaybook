import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
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
import { Box, Portal, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useSettings } from "./hooks/useSettings";
import { map } from "rxjs";

export const AppBarContext = createContext<HTMLElement | null>(null);

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
        }}
      />
      <IconButton size="small" color="inherit" onClick={props.onClick}>
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
  return <RouterLink ref={ref} to={href} {...other} role={undefined} />;
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
  onClick?: () => void;
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
  const [appBarContainer, setContainer] = useState<HTMLElement | null>(null);
  const [drawer, setDrawer] = useState(false);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <MyAppBar
          ref={(el: HTMLElement) => setContainer(el)}
          onClick={() => setDrawer(true)}
        />
        <AppDrawer drawer={drawer} setDrawer={setDrawer} />
        <AppBarContext.Provider value={appBarContainer}>
          <Outlet />
        </AppBarContext.Provider>
      </div>
    </ThemeProvider>
  );
};

export default App;

function AppDrawer(props: {
  drawer: boolean;
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { drawer, setDrawer } = props;
  const { setting$ } = useSettings();
  const [gamePlayRoute, setGamePlayRoute] = useState<string>();
  const [libraryRoute, setLibraryRoute] = useState<string>();
  useEffect(() => {
    const sub1 = setting$
      ?.pipe(map((s) => s?.toJSON().data.gamePlayRoute))
      .subscribe((route) => setGamePlayRoute(route));
    const sub2 = setting$
      ?.pipe(map((s) => s?.toJSON().data.libraryRoute))
      .subscribe((route) => setLibraryRoute(route));
    return () => {
      sub1?.unsubscribe();
      sub2?.unsubscribe();
    };
  });
  return (
    <Drawer
      anchor="right"
      open={drawer}
      onClose={() => setDrawer(false)}
      PaperProps={{ sx: { width: "275px" } }}
      ModalProps={{ keepMounted: true }}
    >
      <List>
        <ListItem>
          <img
            src={new URL("./assets/img/logo.png", import.meta.url).href}
            style={{ borderRadius: 5.4 }}
            alt=""
          />
          <ListItemText style={{ textAlign: "center" }}>
            <Typography variant="h6" fontFamily="Comfortaa">
              GB Playbook
            </Typography>
          </ListItemText>
        </ListItem>
        <Divider />
        <DrawerNavigationButton
          to={gamePlayRoute ?? "/game"}
          onClick={() => setDrawer(false)}
        >
          <ListItemText>Game Play</ListItemText>
        </DrawerNavigationButton>
        <DrawerNavigationButton
          to={libraryRoute ?? "/library"}
          onClick={() => setDrawer(false)}
        >
          <ListItemText>Library</ListItemText>
        </DrawerNavigationButton>
        <DrawerNavigationButton to={"/print"} onClick={() => setDrawer(false)}>
          <ListItemText>Card Printer</ListItemText>
        </DrawerNavigationButton>
        <DrawerNavigationButton
          to={"/settings"}
          onClick={() => setDrawer(false)}
        >
          <ListItemText>Settings</ListItemText>
        </DrawerNavigationButton>
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "1em",
          }}
        >
          <ListItem disablePadding>
            <Link
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/cleech/GBPlaybook/blob/pwa/README.md"
            >
              About
            </Link>
          </ListItem>
        </nav>
      </List>

      <Divider />
      <List>
        <ListItem>
          <ListItemText>Rules Documents:</ListItemText>
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
              target="_blank"
              rel="noopener noreferrer"
              href="/docs/GB-S4-Rulebook-4.1.pdf"
            >
              Season 4 Core Rulebook
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              href="/docs/GB-S4-FAQ-19-12-20.pdf"
            >
              Season 4 FAQ
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              href="/docs/GB-S4-RegionalCup-Rules-200128__1.pdf"
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
            <Link
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://steamforged.com/pages/guild-ball"
            >
              Steamforged Games
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.gg/fvpFSfm976"
            >
              Guild Ball Community Project
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.longshanks.org/systems/guildball/"
            >
              Longshanks
            </Link>
          </ListItem>
        </nav>
      </List>
    </Drawer>
  );
}
