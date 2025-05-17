import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  Suspense,
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

import type { Swiper as SwiperRef } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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
import { firstValueFrom, Observable } from "rxjs";
import { SettingsDoc } from "../models/settings";

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
      <Suspense fallback={<p>Loading ...</p>}>
        <Outlet context={{ slideRef }} />
      </Suspense>
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

interface SwiperLayoutProps {
  navigation: (swiper: SwiperRef | null) => React.ReactNode;
  slides: React.ReactNode[];
  largeLayout?: boolean;
}

function SwiperLayout({
  navigation,
  slides,
  largeLayout = false,
}: SwiperLayoutProps) {

  const ref = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);

  const updateSize = useCallback(() => {
    const containerWidth = ref.current?.getBoundingClientRect().width ?? (largeLayout ? 1000 : 500);
    const containerHeight = ref.current?.getBoundingClientRect().height ?? 700;
    const aspectRatioMultiplier = largeLayout ? 10 : 5;
    const calculatedWidth = Math.min(containerWidth, (containerHeight * aspectRatioMultiplier) / 7) - 12;
    const calculatedHeight = Math.min(containerHeight, (containerWidth * 7) / aspectRatioMultiplier) - 12;
    setCardWidth(calculatedWidth);
    setCardHeight(calculatedHeight);
  }, [largeLayout]);

  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [updateSize]);

  const [swiper, setSwiper] = useState<SwiperRef | null>(null);
  // I don't like this, it's just triggering a re-render which then also renders the buttons
  const [, setActiveSlideIndex] = useState(0);

  const { slideRef } = useOutletContext<{ slideRef: RefObject<number> }>();

  return (
    <>
      {navigation(swiper)}
      <Box
        ref={ref}
        sx={{
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Swiper
          onSwiper={setSwiper}
          initialSlide={slideRef.current ?? 0}
          onSlideChange={(swiperInstance) => {
            slideRef.current = swiperInstance.activeIndex;
            setActiveSlideIndex(swiperInstance.activeIndex);
          }}
          slidesPerView="auto"
          centeredSlides={true}
          spaceBetween={0.25 * 96}
          style={{
            height: '100%',
            // height: cardHeight,
            overflow: 'visible',
          }}
        >
          {slides.map((slideContent, index) => (
            <SwiperSlide
              key={index}
              style={{
                width: cardWidth,
                // height: cardHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <div style={{
                height: cardHeight,
                width: cardWidth,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {slideContent}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <VersionTag />
      </Box>
    </>
  );
}

export function Roster() {
  const { guild: g, roster } = useLoaderData<{ guild: GBGuildDoc; roster: GBModelExpanded[] }>();
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));

  // Define navigation render prop
  const navigation = (swiper: SwiperRef | null) => (
    <SwiperButtons
      guild={g}
      swiper={swiper}
      activeIndex={swiper?.activeIndex ?? 0}
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

      <SwiperLayout
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
  const { gameplans } = useData();

  if (!gameplans) {
    return null;
  }

  // Define navigation render prop
  const navigation = (swiper: SwiperRef | null) => (
    <SwiperChipNavigation // Correctly call SwiperChipNavigation as a component
      swiper={swiper}
      items={gameplans.map((g, index) => ({
        key: index,
        label: g.title,
      }))}
      activeIndex={swiper?.activeIndex} // Get activeIndex from swiper
    />
  ); // End of navigation function body

  // Define slides
  const slides = gameplans.map((gameplan: Gameplan) => (
    <GameplanCard key={gameplan.title} gameplan={gameplan} />
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

      <SwiperLayout
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

  const navigation = (swiper: SwiperRef | null) => (
    <SwiperChipNavigation
      swiper={swiper}
      items={[
        "Playbook Results",
        "Turn Sequence",
        "Conditions",
        "Spending Momentum",
        "Actions",
      ].map((title, index) => ({ key: index, label: title }))}
      activeIndex={swiper?.activeIndex}
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

      <SwiperLayout
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

interface SwiperChipNavigationProps {
  swiper: SwiperRef | null;
  items: ChipItem[];
  slideOffset?: number;
  activeIndex?: number;
  leadingIcon?: React.ReactNode;
  className?: string;
}

function SwiperChipNavigation({
  swiper,
  items,
  leadingIcon,
  activeIndex,
  className,
  slideOffset = 0,
}: SwiperChipNavigationProps) {
  const theme = useTheme();
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
        {leadingIcon}
        {items.map((item, index) => {
          const isActive = index + slideOffset === activeIndex;
          return (
            <Chip
              color="primary"
              key={item.key}
              label={item.label}
              // variant={isActive ? "filled" : "outlined"} // Change variant based on active state
              clickable={false}
              onClick={() => swiper?.slideTo(index + slideOffset)}
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

function SwiperButtons(props: {
  guild: GBGuildDoc;
  swiper: SwiperRef | null;
  activeIndex: number;
}) {
  const { guild, swiper, activeIndex } = props;
  const theme = useTheme();
  const isLeadingIconActive = activeIndex === 0;
  const roster = guild.roster;

  const items: ChipItem[] = useMemo(
    () => roster.map((m, index) => ({ key: index, label: m, })),
    [roster]
  );

  const leadingIcon = (
    <IconButton
      sx={{ padding: 0, mr: 0 }}
      onClick={() => swiper?.slideTo(0)}
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
  );

  return (
    <SwiperChipNavigation
      swiper={swiper}
      items={items}
      slideOffset={1}
      activeIndex={activeIndex}
      leadingIcon={leadingIcon}
    />
  );
}
