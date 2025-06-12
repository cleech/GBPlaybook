import React, {
  ReactNode,
  use,
  useState,
  Suspense,
} from "react";

import {
  Outlet,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { LinkProps } from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Portal } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AppBarContext } from "../utils/contexts";
import LoadingSplash from "../components/LoadingSplash";

export const AppBarContent = (props: { children?: ReactNode }) => {
  const containerRef = use(AppBarContext);
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

const App = () => {
  const [appBarContainer, setContainer] = useState<HTMLElement>();
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
        <AppBarContext value={appBarContainer}>
          <Suspense fallback={<LoadingSplash />}>
            <Outlet context={{ drawer, setDrawer }} />
          </Suspense>
        </AppBarContext>
      </Box>
    </ThemeProvider>
  );
};

export default App;
