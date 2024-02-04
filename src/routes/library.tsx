import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";

import {
  Outlet,
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
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

import { useData } from "../components/DataContext";
import { FlipCard } from "../components/FlipCard";
import { DoubleCard } from "../components/DoubleCard";

import { GuildGrid } from "../components/GuildGrid";
import { useStore, IGBPlayer } from "../models/Root";
import { AppBarContent } from "../App";
import { NavigateNext } from "@mui/icons-material";
import { DoubleGuildCard, FlipGuildCard } from "../components/GuildCard";
import VersionTag from "../components/VersionTag";
import { Guild } from "../components/DataContext.d";
import GBIcon from "../components/GBIcon";

export default function Library() {
  const location = useLocation();
  const { setLibraryRoute } = useStore();

  useEffect(() => {
    setLibraryRoute(`${location.pathname}${location.search}`);
  }, [location, setLibraryRoute]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
        height: "100%",
      }}
    >
      <Outlet />
    </main>
  );
}

export function GuildList() {
  const navigate = useNavigate();
  return (
    <>
      <AppBarContent>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Typography>Library</Typography>
        </Breadcrumbs>
      </AppBarContent>
      <GuildGrid
        pickTeam={(guild) => {
          navigate(guild);
        }}
      />
      <VersionTag />
    </>
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
    let width = ref.current?.getBoundingClientRect().width ?? 0;
    let height = ref.current?.getBoundingClientRect().height ?? 0;
    setCardWidth(Math.min(width, (height * (large ? 10 : 5)) / 7) - 12);
    setCardHeight(Math.min(height, (width * 7) / 5) - 12);
  }, []);

  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });

  const [swiper, setSwiper] = useState<SwiperRef | null>(null);

  const { data } = useData();

  useEffect(() => {
    const savedPosition = searchParams.get("m");
    if (savedPosition && data) {
      const g = data.Guilds.find((g: Guild) => g.name === guild);
      const index = g?.roster.findIndex((m: any) => m === savedPosition);
      if (index) {
        swiper?.slideTo(index + 1);
      }
    }
  }, [swiper, searchParams, data, guild]);

  if (!data) {
    return null;
  }
  const g = data.Guilds.find((g: any) => g.name === guild);
  if (!g) {
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
        }}
      >
        <Swiper
          onSwiper={setSwiper}
          onSlideChange={(swiper) => {
            setSearchParams(`m=${g.roster[swiper.activeIndex - 1]}`, {
              replace: true,
            });
          }}
          slidesPerView="auto"
          spaceBetween={0.25 * 96}
          centeredSlides
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <SwiperSlide
            key={g.name}
            style={{
              width: "auto",
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

          {g.roster.map((m: string, index: number) => {
            const model = data.Models.find((m2: any) => m2.id === m);
            if (!model) {
              return null;
            }
            // if (GBImages[`${model.id}_gbcp_front`]) {
            //   model.gbcp = true;
            // }
            return (
              <SwiperSlide
                key={model.id}
                style={{
                  width: "auto",
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
                    <DoubleCard model={model as any} controls={undefined} />
                  ) : (
                    <FlipCard model={model as any} controls={undefined} />
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

function SwiperButtons(props: { guild: Guild; swiper: SwiperRef | null }) {
  const { data } = useData();
  const { guild, swiper } = props;
  const roster = guild.roster;
  if (!data) {
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
        <IconButton
          sx={{ padding: 0 }}
          onClick={() => {
            swiper?.slideTo(0);
          }}
        >
          <GBIcon
            icon={guild.name}
            className="dark"
            fontSize="32px"
            style={{
              backgroundColor: "black",
              borderRadius: "50%",
            }}
          />
        </IconButton>
        {roster.map((m, index) => {
          const model = data.Models.find((m2: any) => m2.id === m);
          if (!model) {
            return null;
          }
          return (
            <Chip
              color="primary"
              key={model.id}
              // label={model.displayName}
              label={model.id}
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
