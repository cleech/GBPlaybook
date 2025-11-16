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

const MyAppBar = ({ ref, onClick }: { ref: React.Ref<HTMLElement>, onClick: React.MouseEventHandler }) => (
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
      <IconButton size="small" color="inherit" onClick={onClick}>
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
      // main: "#ba9d4e",
      main: "#5578a6",
    },
    secondary: {
      // main: "#ffb300",
      main: '#ffca28',
    },
    // background: {
    //   default: "#121a22",
    // },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // need this hackery to allow nested backdrop-filters ...
          '&::before': {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            backdropFilter: "blur(2px)",
            zIndex: -99,
          },
          // overflow: "hidden",
          backgroundColor: "#400",
          backgroundImage:
            // "linear-gradient(20deg, black, #121a22, #1d506f, #121a22, black)",
            // "linear-gradient(120deg, black, #221a22, #5f405f, #221a22, black)",
            // "linear-gradient(45deg, black, #5a1616, #734930, #5a1616, black)",
            "repeating-linear-gradient(45deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5) 70px, transparent 0px, transparent 140px)," +
            "repeating-linear-gradient(-45deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6) 70px, transparent 0px, transparent 140px)," +
            "linear-gradient(-45deg, #c33, 10%, #400, 90%, #c33)",
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
    MuiInputBase: {
      styleOverrides: {
        input: {
          background: "rgba(100%, 100%, 100%, 10%)",
          backdropFilter: "blur(10px)",
        }
      }
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
          // paddingTop: 'env(safe-area-inset-top)',
          // paddingLeft: 'env(safe-area-inset-left)',
          // paddingRight: 'env(safe-area-inset-right)',
          paddingBottom: 'env(safe-area-inset-bottom)',
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
