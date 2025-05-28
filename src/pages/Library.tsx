import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect,
  RefObject,
  useMemo,
} from "react";

import {
  Outlet,
  useNavigate,
  useSearchParams,
  useLocation,
  useOutletContext,
  useLoaderData,
  useRouteLoaderData,
} from "react-router-dom";

import {
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
} from "@mui/material";

import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from "embla-carousel-react";

import { css, cx } from "@emotion/css";

import { useData } from "../hooks/useData";
import { FlipCard } from "../components/FlipCard";
import { DoubleCard } from "../components/DoubleCard";

import {
  ControlProps,
  GridIconButton,
  GuildGrid,
} from "../components/GuildGrid";
import { AppBarContent } from "./App";
import { NavigateNext } from "@mui/icons-material";
import { DoubleGuildCard, FlipGuildCard } from "../components/GuildCard";
import VersionTag from "../components/VersionTag";
import type { Gameplan } from "../components/DataTypes";
import GBIcon from "../components/GBIcon";
import { GameplanCard, ReferenceCard } from "../components/Gameplan";
import { GBGuildDoc, GBModelExpanded } from "../models/gbdbTypes";
import { firstValueFrom, fromEventPattern, Observable } from "rxjs";
import { SettingsDoc } from "../models/settings";

import useResizeObserver from "@react-hook/resize-observer";
import { useDebounceCallback } from "@react-hook/debounce";

export default function Library() {
  const location = useLocation();
  const setting$ = useRouteLoaderData<Observable<SettingsDoc | null>>("settings");
  const [searchParams] = useSearchParams();
  const slideRef = useRef<number>(
    Number.parseInt(searchParams.get("m") ?? "0") || 0
  );

  useEffect(() => {
    if (!setting$) return;
    const patchRoute = () => {
      firstValueFrom(setting$)
        .then((settingsDoc) =>
          settingsDoc?.incrementalPatch({
            libraryRoute: `${location.pathname}?m=${slideRef.current}`,
          })
        )
        .catch(console.error);
    };
    patchRoute();
    return patchRoute
  }, [location, setting$]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
        height: "100%",
      }}
    >
      <Outlet context={{ slideRef }} />
    </main>
  );
}

export function GuildList() {
  const { slideRef } = useOutletContext<{
    slideRef: RefObject<number>;
  }>();

  const guilds = useLoaderData<GBGuildDoc[]>();
  slideRef.current = 0;

  return (
    <>
      <AppBarContent>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Typography>Library</Typography>
        </Breadcrumbs>
      </AppBarContent>
      <GuildGrid guilds={guilds} Controller={ExtraIconsControl} />
      <VersionTag />
    </>
  );
}

function ExtraIconsControl(props: ControlProps) {
  const navigate = useNavigate();
  useEffect(() => {
    const sub = props.update$.subscribe((g) => navigate(g));
    return () => sub.unsubscribe();
  }, [navigate, props.update$]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        margin: "5px",
      }}
    >
      <GridIconButton
        g={{
          key: "gameplans",
          name: "gameplans",
          icon: "GB",
          style: { color: "#f8f7f4" },
        }}
        pickTeam={() => navigate("gameplans")}
        size={props.size}
      />
      <GridIconButton
        g={{
          key: "refcards",
          name: "Rules",
          icon: "GB",
          style: { color: "#f8f7f4" },
        }}
        pickTeam={() => navigate("refcards")}
        size={props.size}
      />
    </div>
  );
}

interface CarouselLayoutProps {
  navigation: (
    embla: RefObject<EmblaCarouselType | undefined>,
    index$: Observable<number>) => React.ReactNode;
  slides: React.ReactNode[];
  largeLayout?: boolean;
}

function CarouselLayout({
  navigation,
  slides,
  largeLayout = false,
}: CarouselLayoutProps) {
  const [slideWidth, setSlideWidth] = useState(500);

  const _updateSize = useCallback(({ width: containerWidth, height: containerHeight }: DOMRectReadOnly) => {
    const maxWidth = (largeLayout ? 1000 : 500) + 24; // +24 for padding
    const aspectRatioMultiplier = largeLayout ? 10 : 5;
    const calculatedWidth = Math.min(containerWidth, (containerHeight * aspectRatioMultiplier) / 7, maxWidth);
    // const calculatedHeight = Math.min(containerHeight, (containerWidth * 7) / aspectRatioMultiplier, 724);
    setSlideWidth(calculatedWidth);
    // console.log(`container {width: ${containerWidth}, height: ${containerHeight}`);
    // console.log(`card {width: ${calculatedWidth}, height: ${calculatedHeight}`);
  }, [largeLayout]);

  const updateSize = useDebounceCallback(_updateSize, 32, true);

  const sizeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (sizeRef.current)
      updateSize(sizeRef.current.getBoundingClientRect());
  }, [sizeRef, updateSize]);

  useResizeObserver(sizeRef, (entry) => updateSize(entry.contentRect));

  const observers = useMemo<Set<(e: number) => void>>(() => new Set(), []);

  const event$ = fromEventPattern<number>(
    (handler) => {
      observers.add(handler);
      handler(emblaAPI?.selectedScrollSnap() ?? 0);
    },
    (handler) => observers.delete(handler)
  );

  const emitEvent = useCallback(
    (e: EmblaCarouselType) => {
      observers.forEach((handler) => handler(e.selectedScrollSnap()));
    }, [observers]);

  const { slideRef } = useOutletContext<{ slideRef: RefObject<number> }>();

  const [emblaRef, emblaAPI] = useEmblaCarousel({
    align: 'center',
    containScroll: false,
    // skipSnaps: true,
    startIndex: slideRef.current,
    watchSlides: false,
  });

  useEffect(() => {
    emblaAPI?.on('select', emitEvent);
    return () => { emblaAPI?.off('select', emitEvent); }
  }, [emblaAPI, emitEvent]);

  const emblaAPIRef = useRef(emblaAPI);

  useEffect(() => {
    emblaAPIRef.current = emblaAPI;
  }, [emblaAPI]);

  return (
    <>
      {navigation(emblaAPIRef, event$)}

      <div className={cx("embla__viewport", css({
        overflow: "hidden",
        flex: "0 1 100%",
        minHeight: 0,
        position: "relative",
      }))}
        ref={(el) => { sizeRef.current = el; return emblaRef(el) }}
      >
        <div
          className={cx("embla__container", css({
            height: "100%",
            display: "flex",
            gap: "5vw"
          }))}
        >
          {slides.map((slideContent, index) => (
            <div key={index} className={cx("embla__slide", css({
              flex: "0 0 100%",
              minWidth: 0,
              maxWidth: `${slideWidth}px`,
              height: "100%",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }))}>
              {slideContent}
            </div>
          ))}
        </div>
        <VersionTag />
      </div>
    </>
  );
}

export function Roster() {
  const { guild: g, roster } = useLoaderData<{ guild: GBGuildDoc; roster: GBModelExpanded[] }>();
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));

  // Define navigation render prop
  const navigation = (embla: RefObject<EmblaCarouselType | undefined>, index$: Observable<number>) => (
    <CarouselButtons
      guild={g}
      embla={embla}
      index$={index$}
    />
  );

  // Define slides
  const slides = [
    // Guild Card Slide
    large ? <DoubleGuildCard key={g.name} guild={g.name} /> : <FlipGuildCard key={g.name} guild={g.name} />,
    // Roster Card Slides
    ...roster.map((model) =>
      large ? <DoubleCard key={model.id} model={model} /> : <FlipCard key={model.id} model={model} />
    ),
  ];

  return (
    <>
      <AppBarContent>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Link underline="hover" color="inherit" href={"/library"}>
            Library
          </Link>
          <Typography>{g.name}</Typography>
        </Breadcrumbs>
      </AppBarContent>

      <CarouselLayout
        navigation={navigation}
        slides={slides}
        largeLayout={large}
      />
    </>
  );
}

export function GamePlans() {
  // const large = useMediaQuery(theme.breakpoints.up("sm"));
  const largeLayout = false; // Gameplans always use small layout
  const { gameplans, gameplanYear } = useData();

  if (!gameplans) {
    return null;
  }

  // Define navigation render prop
  const navigation = (embla: RefObject<EmblaCarouselType | undefined>, index$: Observable<number>) => (
    <CarouselChipNavigation // Correctly call CarouselChipNavigation as a component
      embla={embla}
      index$={index$}
      items={gameplans.map((g, index) => ({
        key: index,
        label: g.title,
      }))}
    />
  ); // End of navigation function body

  // Define slides
  const slides = gameplans.map((gameplan: Gameplan) => (
    <GameplanCard key={gameplan.title} gameplan={gameplan} year={gameplanYear || 2018} />
  ));

  return (
    <>
      <AppBarContent>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Link underline="hover" color="inherit" href={"/library"}>
            Library
          </Link>
          <Typography>Gameplan Cards</Typography>
        </Breadcrumbs>
      </AppBarContent>

      <CarouselLayout
        navigation={navigation}
        slides={slides}
        largeLayout={largeLayout}
      />
    </>
  );
}

export function RefCards() {
  // const large = useMediaQuery(theme.breakpoints.up("sm"));
  const largeLayout = false; // RefCards always use small layout

  const navigation = (embla: RefObject<EmblaCarouselType | undefined>, index$: Observable<number>) => (
    <CarouselChipNavigation
      embla={embla}
      index$={index$}
      items={[
        "Playbook Results",
        "Turn Sequence",
        "Conditions",
        "Spending Momentum",
        "Actions",
      ].map((title, index) => ({ key: index, label: title }))}
    />
  );

  const slides = [...Array(5).keys()]
    .map((i) => i + 1)
    .map((i) => <ReferenceCard key={i} index={i} />);

  return (
    <>
      <AppBarContent>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Link underline="hover" color="inherit" href={"/library"}>
            Library
          </Link>
          <Typography>Rules Reference Cards</Typography>
        </Breadcrumbs>
      </AppBarContent>

      <CarouselLayout
        navigation={navigation}
        slides={slides}
        largeLayout={largeLayout}
      />
    </>
  );
}

interface ChipItem {
  key: string | number;
  label: string;
}

interface CarouselChipNavigationProps {
  embla: RefObject<EmblaCarouselType | undefined>;
  index$: Observable<number>;
  items: ChipItem[];
  slideOffset?: number;
  leadingIcon?: () => React.ReactNode;
  className?: string;
}

function CarouselChipNavigation({
  embla,
  index$,
  items,
  leadingIcon,
  className,
  slideOffset = 0,
}: CarouselChipNavigationProps) {
  const theme = useTheme();

  const [activeIndex, setActiveIndex] = useState(embla.current?.selectedScrollSnap() ?? 0);
  useEffect(() => {
    const sub = index$.subscribe((index) => setActiveIndex(index));
    return () => { sub.unsubscribe(); }
  }, [index$]);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ flex: "1 1" }} />
      <Box
        sx={{
          display: "flex",
          flex: "1 1 500px",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "5px",
          my: 1, // Added margin for consistent spacing
        }}
      >
        {leadingIcon?.()}
        {items.map((item, index) => {
          const isActive = index + slideOffset === activeIndex;
          return (
            <Chip
              color="primary"
              key={item.key}
              label={item.label}
              // variant={isActive ? "filled" : "outlined"} // Change variant based on active state
              clickable={false}
              onClick={() => embla.current?.scrollTo(index + slideOffset)}
              sx={{
                boxShadow: isActive ? `0 0 10px ${theme.palette.warning.main}` : "none",
              }}
            />
          )
        })}
      </Box>
      <div style={{ flex: "1 1" }} />
    </div>
  );
}

function CarouselButtons(props: {
  guild: GBGuildDoc;
  embla: RefObject<EmblaCarouselType | undefined>;
  index$: Observable<number>;
}) {
  const { guild, embla, index$ } = props;
  const [activeIndex, setActiveIndex] = useState(embla.current?.selectedScrollSnap() ?? 0);
  useEffect(() => {
    const sub = index$.subscribe((index) => setActiveIndex(index));
    return () => { sub.unsubscribe(); }
  }, [index$]);
  const theme = useTheme();
  const isLeadingIconActive = activeIndex === 0;
  const roster = guild.roster;

  const items: ChipItem[] = useMemo(
    () => roster.map((m, index) => ({ key: index, label: m, })),
    [roster]
  );

  const leadingIcon = () => {
    return <IconButton
      sx={{ padding: 0, mr: 0 }}
      onClick={() => embla.current?.scrollTo(0)}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          backgroundColor: "black",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
          // Add visual indication if active
          boxShadow: isLeadingIconActive ? `0 0 10px ${theme.palette.warning.main}` : "none",
        }}
      >
        <GBIcon icon={guild.name} className="dark" fontSize="32px" style={{ flexShrink: 0 }} />
      </div>
    </IconButton>
  };

  return (
    <CarouselChipNavigation
      embla={embla}
      index$={index$}
      items={items}
      slideOffset={1}
      leadingIcon={leadingIcon}
    />
  );
}
