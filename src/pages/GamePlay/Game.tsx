import {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useBlocker } from "react-router-dom";
import type { BlockerFunction } from "react-router";
import {
  Button,
  Divider,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  Link,
  Breadcrumbs,
  IconButton,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import RosterList, { HealthCounter } from "./components/RosterList";
import { FlipCard } from "../../components/FlipCard";

import useEmblaCarousel from "embla-carousel-react";

import { Home, NavigateNext } from "@mui/icons-material";
import { AppBarContent } from "../App";

import { FlipGuildCard } from "../../components/GuildCard";
import { GBGameStateDoc, GBModelExpanded } from "../../models/gbdbTypes";
import { reSort } from "../../utils/reSort";
import { firstValueFrom, map } from "rxjs";
import { useRxData } from "../../hooks/useRxQuery";
import { NetworkGame } from "./components/NetworkGame";
import { useNetworkState } from "../../hooks/useNetworkState";
import { useGameState } from "../../hooks/useGameState";

import useResizeObserver from "@react-hook/resize-observer";
import { useDebounceCallback } from '@react-hook/debounce';

import { css, cx } from "@emotion/css";

export default function Game() {
  const [showSnack, setShowSnack] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const blocker = useBlocker(
    useCallback<BlockerFunction>(
      (args) => {
        if (args.nextLocation.pathname.startsWith("/game")) {
          setShowSnack(true);
          return true;
        }
        return false;
      },
      [setShowSnack]
    )
  );

  /* useBlocker doesn't seem to work unless some state is updated */
  useEffect(() => {
    setBlocked(true);
  }, [blocked, setBlocked]);

  const { active: networkActive } = useNetworkState();

  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <AppBarContent>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            <IconButton
              color="inherit"
              href={`/game`}
              size="small"
              disabled={networkActive}
            >
              <Home />
            </IconButton>
            {networkActive ? (
              <Typography>Draft</Typography>
            ) : (
              <Link underline="hover" color="inherit" href={`/game/draft`}>
                Draft
              </Link>
            )}
            <Typography>Play</Typography>
          </Breadcrumbs>
          <NetworkGame />
        </Box>
      </AppBarContent>

      <GameInner />

      <Snackbar
        open={showSnack}
        onClose={() => setShowSnack(false)}
        autoHideDuration={5000}
      >
        <Alert
          severity="warning"
          action={
            <Button size="small" onClick={blocker.proceed}>
              Exit Game
            </Button>
          }
        >
          Making changes to the team selections will reset the game state.
        </Alert>
      </Snackbar>
    </Box>
  );
}

function GameInner() {
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));

  // const navigate = useNavigate();

  const { active: networkActive } = useNetworkState();

  const { gameState1$, gameState2$ } = useGameState();

  const [team1, setGameState1] = useState<GBGameStateDoc | null>();
  useEffect(() => {
    if (!gameState1$) {
      return;
    }
    let canceled = false;
    const snapshot = async () => {
      const doc = await firstValueFrom(gameState1$);
      if (!canceled) {
        setGameState1(doc);
      }
    };
    snapshot();
    return () => {
      canceled = true;
    };
  }, [gameState1$]);

  const [team2, setGameState2] = useState<GBGameStateDoc | null>();
  useEffect(() => {
    if (!gameState2$) {
      return;
    }
    let canceled = false;
    const snapshot = async () => {
      const doc = await firstValueFrom(gameState2$);
      if (!canceled) {
        setGameState2(doc);
      }
    };
    snapshot();
    return () => {
      canceled = true;
    };
  }, [gameState2$]);

  const [roster1, roster2] =
    useRxData(
      async (db) => {
        // kick out if there's a problem getting the data
        if (!team1 || !team2) {
          // navigate("/game");
          return;
        }

        const _roster1 = await db.models
          .find()
          .where("id")
          .in(team1.roster.map((r) => r.name))
          .exec();

        const __roster1 = await Promise.all(_roster1.map((m) => m.expand()));
        reSort(
          __roster1,
          "id",
          team1.roster.map((r) => r.name)
        );

        const _roster2 = await db.models
          .find()
          .where("id")
          .in(team2.roster.map((r) => r.name))
          .exec();

        const __roster2 = await Promise.all(_roster2.map((m) => m.expand()));
        reSort(
          __roster2,
          "id",
          team2.roster.map((r) => r.name)
        );
        return [__roster1, __roster2];
      },
      [team1, team2 /*, navigate */]
    ) ?? [];

  if (!team1 || !team2) {
    return null;
  }
  if (!roster1 || !roster2) {
    return null;
  }

  return large ? (
    <>
      <GameList teams={[team1]} rosters={[roster1]} disabled={[false]} />
      <Divider orientation="vertical" />
      <GameList
        teams={[team2]}
        rosters={[roster2]}
        disabled={[Boolean(networkActive)]}
      />
    </>
  ) : (
    <GameList
      teams={[team1, team2]}
      rosters={[roster1, roster2]}
      disabled={[false, Boolean(networkActive)]}
    />
  );
}

const GameList = ({
  teams,
  rosters,
  disabled,
}: {
  teams: GBGameStateDoc[];
  rosters: GBModelExpanded[][];
  disabled: boolean[];
}) => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [index, setIndex] = useState(0);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <RosterList
        disabled={disabled}
        teams={teams}
        rosters={rosters}
        expanded={expanded}
        onClick={(i, expandList) => {
          setIndex(i);
          setExpanded(expandList);
          setOpen(!expandList);
        }}
      />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          flexGrow: 1,
        }}
      >
        <Modal
          disablePortal={true}
          sx={{
            /* same as app bar, bellow the drawer */
            zIndex: 1100,
          }}
          open={open}
          onClose={() => {
            setOpen(false);
            setExpanded(true);
          }}
          slotProps={{
            root: {
              style: {
                position: "absolute",
              },
            },
            backdrop: {
              style: {
                position: "absolute",
              },
            },
          }}
        >
          <CardCarousel
            teams={teams}
            rosters={rosters}
            disabled={disabled}
            index={index}
          />
        </Modal>
      </div>
    </div>
  );
};

const CAROUSEL_GAP = "28px";
const CAROUSEL_PADDING = "4px";

const emblaStyles = {
  viewport: css({
    overflow: "hidden",
    height: "100%",
    pointerEvents: "none",
    padding: CAROUSEL_PADDING,
    // border: "2px solid red"
  }),
  container: css({
    height: '100%',
    display: "flex",
    flexDirection: "column",
    gap: CAROUSEL_GAP,
    // border: "2px solid yellow"
  }),
  slide: css({
    flex: '0 0 100%',
    minHeight: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // border: "2px solid blue"
  }),
  card: css({
    pointerEvents: "initial",
    // border: "2px solid green"
  })
};

const maxHeight = 700;
const maxWidth = 500;

function CardCarousel({
  teams,
  rosters,
  disabled,
  index
}: {
  teams: GBGameStateDoc[];
  rosters: GBModelExpanded[][];
  disabled: boolean[];
  index: number;
}) {
  const [slideHeight, setSlideHeight] = useState(maxHeight);
  const [slideWidth, setSlideWidth] = useState(maxWidth);

  const _updateSize = useCallback(({ width, height }: DOMRectReadOnly) => {
    const calculatedWidth = Math.min(width, (height * 5) / 7, maxWidth);
    const calculatedHeight = Math.min(height, (width * 7) / 5, maxHeight);
    setSlideHeight(calculatedHeight);
    setSlideWidth(calculatedWidth);
    // console.log(`container {width: ${containerWidth}, height: ${containerHeight}`);
    // console.log(`card {width: ${calculatedWidth}, height: ${calculatedHeight}`);
  }, []);

  const updateSize = useDebounceCallback(_updateSize, 32, true);

  const sizeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (sizeRef.current)
      updateSize(sizeRef.current.getBoundingClientRect());
  }, [sizeRef, updateSize]);

  useResizeObserver(sizeRef, (entry) => updateSize(entry.contentRect));

  const [emblaRef] = useEmblaCarousel({
    startIndex: index,
    align: 'center',
    axis: 'y',
    containScroll: false,
    skipSnaps: true,
    watchSlides: false,
  });

  const cards = teams
    .flatMap((t, index) => [
      // Guild Rules Card
      <FlipGuildCard key={`guild-${index}`} guild={t.guild} />,
      // Model Cards
      ...rosters[index].map((m, _index) =>
        <FlipCard
          key={`model-${index}-${_index}`}
          model={m}
          health$={t.get$("roster").pipe(
            map((r) => {
              return r[_index].health;
            })
          )}
        >
          <CardControls
            model={m}
            state={teams[index]}
            disabled={disabled[index]}
          />
        </FlipCard>
      ),
    ]);

  return (
    <div
      className={cx("embla__viewport", emblaStyles.viewport)}
      ref={(el) => { sizeRef.current = el; emblaRef(el); }}
    >
      <div className={cx("embla__container", emblaStyles.container)}>
        {cards.map((component, index) => (
          <div key={index} className={cx("embla__slide", emblaStyles.slide)}>
            <div
              className={emblaStyles.card}
              style={{
                height: `${slideHeight}px`,
                width: `${slideWidth}px`,
              }}
            >
              {component}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CardControls({
  state,
  model,
  disabled = false,
}: {
  state: GBGameStateDoc;
  model: GBModelExpanded;
  disabled: boolean;
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        position: "absolute",
        right: 0,
        bottom: 0,
        // bottom: `calc(22px * ${scale})`,
        // transform: `scale(${scale ?? 1})`,
        // transformOrigin: "bottom right",
      }}
    >
      <HealthCounter state={state} model={model} disabled={disabled} stacked />
    </Paper>
  );
}
