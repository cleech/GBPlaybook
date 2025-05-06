import {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  Suspense,
  useEffect,
  RefObject,
} from "react";

import {
  Outlet,
  useNavigate,
  useSearchParams,
  useLocation,
  useOutletContext,
  useLoaderData,
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
import type { Gameplan } from "../components/DataContext.d";
import GBIcon from "../components/GBIcon";
import { GameplanCard, ReferenceCard } from "../components/Gameplan";
import { GBGuildDoc, GBModelExpanded } from "../models/gbdb";
import { useSettings } from "../hooks/useSettings";
import { firstValueFrom } from "rxjs";

export default function Library() {
  const location = useLocation();
  const { setting$ } = useSettings();
  const [searchParams] = useSearchParams();
  const slideRef = useRef(searchParams.get("m"));

  useEffect(() => {
    if (!setting$) return;
    firstValueFrom(setting$)
      .then((settingsDoc) =>
        settingsDoc?.incrementalPatch({
          libraryRoute: `${location.pathname}?m=${slideRef.current}`,
        })
      )
      .catch(console.error);
    return () => {
      firstValueFrom(setting$)
        .then((settingsDoc) =>
          settingsDoc?.incrementalPatch({
            // eslint-disable-next-line react-hooks/exhaustive-deps
            libraryRoute: `${location.pathname}?m=${slideRef.current}`,
          })
        )
        .catch(console.error);
    };
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

  const guilds = useLoaderData() as GBGuildDoc[];

  slideRef.current = 0;

  return (
    <>
      <AppBarContent>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Typography>Library</Typography>
        </Breadcrumbs>
      </AppBarContent>
      <GuildGrid Controller={ExtraIconsControl}>
        {guilds}
      </GuildGrid>
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

export function Roster() {
  const { guild: g, roster } = useLoaderData() as { guild: GBGuildDoc; roster: GBModelExpanded[] };
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));

  const ref = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(large ? 1000 : 500);
  const [cardHeight, setCardHeight] = useState(700);

  const updateSize = useCallback(() => {
    const width = ref.current?.getBoundingClientRect().width ?? 0;
    const height = ref.current?.getBoundingClientRect().height ?? 0;
    setCardWidth(Math.min(width, (height * (large ? 10 : 5)) / 7) - 12);
    setCardHeight(Math.min(height, (width * 7) / 5) - 12);
  }, [large]);

  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });

  const [swiper, setSwiper] = useState<SwiperRef | null>(null);

  const { slideRef } = useOutletContext<{
    slideRef: RefObject<number>;
  }>();

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
      <SwiperButtons guild={g} swiper={swiper} />
      <Box
        ref={ref}
        sx={{
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Swiper
          onSwiper={setSwiper}
          initialSlide={slideRef.current}
          onSlideChange={(swiper) => {
            slideRef.current = swiper.activeIndex;
          }}
          slidesPerView="auto"
          centeredSlides={true}
          spaceBetween={0.25 * 96}
          style={{
            // height: "100%",
            // width: "100%",
            height: cardHeight,
          }}
        >
          <SwiperSlide
            key={g.name}
            style={{
              width: cardWidth,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                height: cardHeight,
                width: cardWidth,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {large ? (
                <DoubleGuildCard guild={g.name} />
              ) : (
                <FlipGuildCard guild={g.name} />
              )}
            </div>
          </SwiperSlide>

          {roster.map((model) => {
            // if (GBImages[`${model.id}_gbcp_front`]) {
            //   model.gbcp = true;
            // }
            return (
              <SwiperSlide
                key={model.id}
                style={{
                  width: cardWidth,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    height: cardHeight,
                    width: cardWidth,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {large ? (
                    <DoubleCard model={model} />
                  ) : (
                    <FlipCard model={model} />
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <VersionTag />
      </Box>
    </>
  );
}

export function GamePlans() {
  // const large = useMediaQuery(theme.breakpoints.up("sm"));
  const large = false;

  const ref = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(large ? 1000 : 500);
  const [cardHeight, setCardHeight] = useState(700);

  const updateSize = useCallback(() => {
    const width = ref.current?.getBoundingClientRect().width ?? 0;
    const height = ref.current?.getBoundingClientRect().height ?? 0;
    setCardWidth(Math.min(width, (height * (large ? 10 : 5)) / 7) - 12);
    setCardHeight(Math.min(height, (width * 7) / 5) - 12);
  }, [large]);

  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });

  const [swiper, setSwiper] = useState<SwiperRef | null>(null);

  const { slideRef } = useOutletContext<{
    slideRef: RefObject<number>;
  }>();

  const { gameplans } = useData();

  if (!gameplans) {
    return null;
  }

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

      <SwiperChipNavigation
        swiper={swiper}
        items={gameplans.map((g, index) => ({
          key: index,
          label: g.title,
        }))}
      />

      <Box
        ref={ref}
        sx={{
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Swiper
          onSwiper={setSwiper}
          initialSlide={slideRef.current}
          onSlideChange={(swiper) => {
            slideRef.current = swiper.activeIndex;
          }}
          slidesPerView="auto"
          centeredSlides={true}
          spaceBetween={0.25 * 96}
          style={{
            // height: "100%",
            // width: "100%",
            // width: cardWidth,
            height: cardHeight,
            // aspectRatio: 5 / 7,
          }}
        >
          {gameplans.map((gameplan: Gameplan, index: number) => (
            <SwiperSlide
              key={`gameplan-${index}`}
              style={{
                // width: "auto",
                width: cardWidth,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  height: cardHeight,
                  width: cardWidth,
                  // aspectRatio: 5 / 7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GameplanCard gameplan={gameplan} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <VersionTag />
      </Box>
    </>
  );
}

export function RefCards() {
  // const large = useMediaQuery(theme.breakpoints.up("sm"));
  const large = false;

  const ref = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(large ? 1000 : 500);
  const [cardHeight, setCardHeight] = useState(700);

  const updateSize = useCallback(() => {
    const width = ref.current?.getBoundingClientRect().width ?? 0;
    const height = ref.current?.getBoundingClientRect().height ?? 0;
    setCardWidth(Math.min(width, (height * (large ? 10 : 5)) / 7) - 12);
    setCardHeight(Math.min(height, (width * 7) / 5) - 12);
  }, [large]);

  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });

  const [swiper, setSwiper] = useState<SwiperRef | null>(null);

  const { slideRef } = useOutletContext<{
    slideRef: RefObject<number>;
  }>();

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

      <SwiperChipNavigation
        swiper={swiper}
        items={[
          "Playbook Results",
          "Turn Sequence",
          "Conditions",
          "Spending Momentum",
          "Actions",
        ].map((title, index) => ({ key: index, label: title }))}
      />

      <Box
        ref={ref}
        sx={{
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Swiper
          onSwiper={setSwiper}
          initialSlide={slideRef.current}
          onSlideChange={(swiper) => {
            slideRef.current = swiper.activeIndex;
          }}
          slidesPerView="auto"
          centeredSlides={true}
          spaceBetween={0.25 * 96}
          style={{
            // height: "100%",
            // width: "100%",
            // width: cardWidth,
            height: cardHeight,
            // aspectRatio: 5 / 7,
          }}
        >
          {[...Array(5).keys()]
            .map((i) => i + 1)
            .map((i) => (
              <SwiperSlide
                key={`ref-${i}`}
                style={{
                  // width: "auto",
                  width: cardWidth,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    height: cardHeight,
                    width: cardWidth,
                    // aspectRatio: 5 / 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ReferenceCard index={i} />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
        <VersionTag />
      </Box>
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
  leadingIcon?: React.ReactNode;
  className?: string;
}

function SwiperChipNavigation({
  swiper,
  items,
  leadingIcon,
  className,
  slideOffset = 0,
}: SwiperChipNavigationProps) {
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
        {items.map((item, index) => (
          <Chip
            color="primary"
            key={item.key}
            label={item.label}
            onClick={() => swiper?.slideTo(index + slideOffset)}
          />
        ))}
      </Box>
      <div style={{ flex: "1 1" }} />
    </div>
  );
}

function SwiperButtons(props: { guild: GBGuildDoc; swiper: SwiperRef | null }) {
  const { guild, swiper } = props;
  const roster = guild.roster;

  const items: ChipItem[] = roster.map((m, index) => ({
    key: index,
    label: m,
  }));

  const leadingIcon = (
    <IconButton
      sx={{ padding: 0, mr: 0.5 }} // Added margin
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
      leadingIcon={leadingIcon}
    />
  );
}
