import React, {
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Outlet,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  NavLink,
  useOutlet,
  useOutletContext,
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
import { useSettings } from "../hooks/useSettings";
import { map } from "rxjs";
import { AppBarContext } from "../utils/contexts";
import { SettingsProvider } from "../models/settings";
import { DataProvider } from "../components/DataContext";

export const AppBarContent = (props: { children?: ReactNode }) => {
  const containerRef = useContext(AppBarContext);
  return <Portal container={containerRef}>{props.children}</Portal>;
};

const MyAppBar = (props: { onClick: React.MouseEventHandler, ref: React.Ref<HTMLElement> }) => (
  <AppBar position="static" className="no-print">
    <Toolbar variant="dense">
      <Box
        ref={props.ref}
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
);

const LinkBehavior = (
  props: Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"], ref: React.Ref<HTMLAnchorElement> }
) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink to={href} {...other} role={undefined} />;
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      // main: "#4e91ba",
      main: "#ba9d4e",
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
            // "linear-gradient(20deg, black, #121a22, #1d506f, #121a22, black)",
            // "linear-gradient(120deg, black, #221a22, #5f405f, #221a22, black)",
            "linear-gradient(45deg, black, #5a1616, #734930, #5a1616, black)",
        },
        "@media print": {
          body: {
            background: "white",
          },
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        sx: { textShadow: "1px 1px 2px black" },
      }
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
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MyAppBar
          ref={(el: HTMLElement) => setContainer(el)}
          onClick={() => setDrawer(true)}
        />
        <AppBarContext.Provider value={appBarContainer}>
          <Outlet context={{ drawer, setDrawer }} />
        </AppBarContext.Provider>
      </Box>
    </ThemeProvider>
  );
};

export const AppContent = () => {
  const { drawer, setDrawer } = useOutletContext<{ drawer: boolean; setDrawer: React.Dispatch<React.SetStateAction<boolean>> }>();
  return (
    <SettingsProvider>
      <AppDrawer drawer={drawer} setDrawer={setDrawer} />
      <DataProvider>
        <Outlet />
      </DataProvider>
    </SettingsProvider>
  )
}

export default App;

interface NavItem {
  type: "nav";
  text: string;
  to: string | ((props: { gamePlayRoute?: string; libraryRoute?: string; }) => string | undefined); // Allow function for dynamic routes
  defaultTo: string;
}

interface ExternalLinkItem {
  type: "external";
  text: string;
  href: string;
}

interface AboutLinkItem {
  type: "about";
  text: string;
  href: string;
}

type DrawerItem = NavItem | ExternalLinkItem | AboutLinkItem;

const mainNavItems: DrawerItem[] = [
  { type: "nav", text: "Game Play", to: (props) => props.gamePlayRoute, defaultTo: "/game" },
  { type: "nav", text: "Library", to: (props) => props.libraryRoute, defaultTo: "/library" },
  { type: "nav", text: "Card Printer", to: "/print", defaultTo: "/print" },
  { type: "nav", text: "Settings", to: "/settings", defaultTo: "/settings" },
  { type: "about", text: "About", href: "https://github.com/cleech/GBPlaybook/blob/pwa/README.md" },
];

const rulesLinks: ExternalLinkItem[] = [
  { type: "external", text: "Season 4 Core Rulebook", href: "https://docs.guildball.app/GB-S4-Rulebook-4.1.pdf" },
  { type: "external", text: "Season 4 FAQ", href: "https://docs.guildball.app/GB-S4-FAQ-19-12-20.pdf" },
  { type: "external", text: "Organized Play Rules", href: "https://docs.guildball.app/GB-S4-RegionalCup-Rules-200128__1.pdf" },
];

const communityLinks: ExternalLinkItem[] = [
  { type: "external", text: "Steamforged Games", href: "https://steamforged.com/pages/guild-ball" },
  { type: "external", text: "Guild Ball Community Project", href: "https://discord.gg/fvpFSfm976" },
  { type: "external", text: "Longshanks", href: "https://www.longshanks.org/systems/guildball/" },
];


// Helper to resolve dynamic routes
const resolveRoute = (to: NavItem['to'], props: { gamePlayRoute?: string; libraryRoute?: string; }): string | undefined => typeof to === 'function' ? to(props) : to;

function AppDrawerContent(props: {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  gamePlayRoute?: string;
  libraryRoute?: string;
}) {
  const { setDrawer } = props;
  return (
    <>
      <List>
        <ListItem>
          <img
            src={new URL("../assets/img/logo.png", import.meta.url).href}
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
        {mainNavItems.map((item, index) => {
          if (item.type === "nav") {
            const route = resolveRoute(item.to, props) ?? item.defaultTo;
            return (
              <DrawerNavigationButton
                key={index}
                to={route}
                onClick={() => setDrawer(false)}
              >
                <ListItemText>{item.text}</ListItemText>
              </DrawerNavigationButton>
            );
          }
          if (item.type === "about") {
            return (
              <ListItem key={index} disablePadding sx={{ ml: "1em" }}>
                {/* Using ListItemButton for consistent hover/focus styles */}
                <ListItemButton
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ py: 0.5 }} // Adjust padding as needed
                >
                  <ListItemText primary={item.text} sx={{ m: 0 }} />
                </ListItemButton>
              </ListItem>
            );
          }
          return null; // Should not happen with defined types
        })}
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText>Rules Documents:</ListItemText>
        </ListItem>
        <LinkList items={rulesLinks} />
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText>Community Links:</ListItemText>
        </ListItem>
        <LinkList items={communityLinks} />
      </List>
    </>
  );
}

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
  }, [setting$]);
  return (
    <Drawer
      anchor="right"
      open={drawer}
      onClose={() => setDrawer(false)}
      ModalProps={{ keepMounted: true }}
      slotProps={{
        paper: { sx: { width: "275px" } }
      }}
    >
      <AppDrawerContent
        setDrawer={setDrawer}
        gamePlayRoute={gamePlayRoute}
        libraryRoute={libraryRoute}
      />
    </Drawer>
  );
}

// Generic component to render lists of external links
function LinkList({ items }: { items: ExternalLinkItem[] }) {
  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        marginLeft: "2em",
      }}
    >
      {items.map((item) => (
        <ListItem key={item.href} disablePadding>
          <Link component="a" target="_blank" rel="noopener noreferrer" href={item.href}>
            {item.text}
          </Link>
        </ListItem>
      ))}
    </nav>
  );
}
