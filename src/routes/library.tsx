import {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  Suspense,
  useEffect,
  // useEffect,
} from "react";

import {
  Outlet,
  useParams,
  useNavigate,
  useSearchParams,
  // useLocation,
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
  Divider,
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
import { AppBarContent } from "../App";
import { NavigateNext } from "@mui/icons-material";
import { DoubleGuildCard, FlipGuildCard } from "../components/GuildCard";
import VersionTag from "../components/VersionTag";
import type { Gameplan } from "../components/DataContext.d";
import GBIcon from "../components/GBIcon";
import { GameplanCard, ReferenceCard } from "../components/Gameplan";
import { GBGuildDoc } from "../models/gbdb";
import { reSort } from "../utils/reSort";
import { useRxData } from "../hooks/useRxQuery";
// import { useSettings } from "../hooks/useSettings";
// import { SettingsDoc } from "../models/settings";

export default function Library() {
  // const location = useLocation();

  // const { setting$ } = useSettings();
  // const [settingsDoc, setSettingsDoc] = useState<SettingsDoc | null>();

  // useEffect(() => {
  //   const sub = setting$?.subscribe((s) => setSettingsDoc(s));
  //   return () => sub?.unsubscribe();
  // }, [setting$]);

  // useEffect(() => {
  //   return () => {
  //     settingsDoc?.incrementalPatch({
  //       libraryRoute: `${location.pathname}${location.search}`,
  //     });
  //   };
  // }, [location, settingsDoc]);

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
        <Outlet />
      </Suspense>
    </main>
  );
}

export function GuildList() {
  return (
    <>
      <AppBarContent>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Typography>Library</Typography>
        </Breadcrumbs>
      </AppBarContent>
      <GuildGrid
        Controller={ExtraIconsControl}
        // sizeUpdate={(size) => setSize(size)}
        // controls={ExtraIconsControl}
        // extraIcons={[
        //   {
        //     key: "gameplans",
        //     name: "Gameplans",
        //     icon: "GB",
        //     style: { color: "#f8f7f4" },
        //   },
        //   {
        //     key: "reference",
        //     name: "Rules",
        //     icon: "GB",
        //     style: { color: "#f8f7f4" },
        //   },
        // ]}
      />
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
  const { guild } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const navigate = useNavigate();

  const [g, roster] =
    useRxData(
      async (db) => {
        const [_g, _roster] = await Promise.all([
          db.guilds.findOne().where({ name: guild }).exec(),
          db.models
            .find()
            .or([{ guild1: guild }, { guild2: guild }])
            .exec(),
        ]);
        if (!_g || !_roster.length) {
          navigate("/library");
          return;
        }
        reSort(_roster, "id", _g.roster);
        const __roster = await Promise.all(_roster.map((m) => m.expand()));
        return [_g, __roster];
      },
      [guild, navigate]
    ) ?? [];

  if (!g || !roster) {
    // console.log(g);
    // console.log(roster);
    return null;
  }

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
          initialSlide={
            (g?.roster.findIndex((m) => m === searchParams.get("m")) || 0) + 1
          }
          onSlideChange={(swiper) => {
            setSearchParams(`m=${g.roster[swiper.activeIndex - 1]}`, {
              replace: true,
            });
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
  const [searchParams, setSearchParams] = useSearchParams();

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

      <GameplanButtons swiper={swiper} />

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
          initialSlide={Number(searchParams.get("m")) || 0}
          onSlideChange={(swiper) => {
            setSearchParams(`m=${swiper.activeIndex}`, {
              replace: true,
            });
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
  const [searchParams, setSearchParams] = useSearchParams();

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

      <RefCardButtons swiper={swiper} />

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
          initialSlide={Number(searchParams.get("m")) || 0}
          onSlideChange={(swiper) => {
            setSearchParams(`m=${swiper.activeIndex}`, {
              replace: true,
            });
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

function SwiperButtons(props: { guild: GBGuildDoc; swiper: SwiperRef | null }) {
  const { guild, swiper } = props;
  const roster = guild.roster;
  return (
    <div
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
          // width: "100%",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "5px",
        }}
      >
        <IconButton
          sx={{ padding: 0 }}
          onClick={() => {
            swiper?.slideTo(0);
          }}
        >
          <span>
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
              <GBIcon
                icon={guild.name}
                className="dark"
                fontSize="32px"
                style={{ flexShrink: 0 }}
              />
            </div>
          </span>
        </IconButton>
        {roster.map((m, index) => {
          return (
            <Chip
              color="primary"
              key={index}
              label={m}
              onClick={() => {
                swiper?.slideTo(index + 1);
              }}
            />
          );
        })}
      </Box>
      <div style={{ flex: "1 1" }} />
    </div>
  );
}

function GameplanButtons(props: { swiper: SwiperRef | null }) {
  const { gameplans } = useData();
  const { swiper } = props;
  if (!gameplans) {
    return null;
  }
  return (
    <div
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
          // width: "100%",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "5px",
        }}
      >
        {gameplans.map((g, index) => {
          return (
            <Chip
              color="primary"
              key={index}
              // label={model.displayName}
              label={g.title}
              onClick={() => {
                swiper?.slideTo(index);
              }}
            />
          );
        })}
      </Box>
      <div style={{ flex: "1 1" }} />
    </div>
  );
}

function RefCardButtons(props: { swiper: SwiperRef | null }) {
  const { gameplans } = useData();
  const { swiper } = props;
  if (!gameplans) {
    return null;
  }
  return (
    <div
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
          // width: "100%",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "5px",
        }}
      >
        {[
          "Playbook Results",
          "Turn Sequence",
          "Conditions",
          "Spending Momentum",
          "Actions",
        ].map((title, index) => {
          return (
            <Chip
              color="primary"
              key={index}
              // label={model.displayName}
              label={title}
              onClick={() => {
                swiper?.slideTo(index);
              }}
            />
          );
        })}
      </Box>
      <div style={{ flex: "1 1" }} />
    </div>
  );
}
