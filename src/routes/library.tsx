import React, { useState, useEffect } from "react";

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
} from "@mui/material";

import type { Swiper as SwiperRef } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { useData } from "../components/DataContext";
import { FlipCard, DoubleCard } from "../components/Card";

import { GuildGrid } from "../components/GuildGrid";
import { useStore, IGBPlayer } from "../models/Root";
import { AppBarContent } from "../App";
import { NavigateNext } from "@mui/icons-material";

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
        flexDirection: "column",
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
    </>
  );
}

export function Roster() {
  const { guild } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));

  // const ref = useRef<HTMLDivElement>(null);
  // const [cardWidth, setCardWidth] = useState(240);
  // const [cardHeight, setCardHeight] = useState(336);
  // const [slideHeight, setSlideHeight] = useState(336);
  // useLayoutEffect(() => {
  //   updateSize();
  //   window.addEventListener("resize", updateSize);
  //   return () => window.removeEventListener("resize", updateSize);
  // });
  // function updateSize() {
  //   let wrapper = ref.current?.querySelector(".swiper-wrapper");
  //   let width = wrapper?.getBoundingClientRect().width ?? 0;
  //   let height = wrapper?.getBoundingClientRect().height ?? 0;
  //   // let barHeight = large ? 56 : 112;
  //   setCardWidth(Math.min(width - 12, (height * 5) / 7 - 12));
  //   setCardHeight(Math.min(height - 12, (width * 7) / 5 - 12));
  //   setSlideHeight(height);
  // }

  const [swiper, setSwiper] = useState<SwiperRef | null>(null);

  const { data, loading } = useData();
  if (loading || !data) {
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
      <Swiper
        // ref={ref}
        onSwiper={setSwiper}
        initialSlide={g.roster.findIndex(
          (m: any) => m === searchParams.get("m")
        )}
        onSlideChange={(swiper) => {
          setSearchParams(`m=${g.roster[swiper.activeIndex]}`, {
            replace: true,
          });
        }}
        // slidesPerView="auto"
        slidesPerView={1.1}
        centeredSlides={true}
        // autoHeight={true}
        spaceBetween={0.25 * 96}
        style={{
          height: "100%",
          width: "100%",
          // flexShrink: 2,
          // display: "flex",
          // flexDirection: "column",
        }}
      >
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
              virtualIndex={index}
              style={{
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
            </SwiperSlide>
          );
        })}
      </Swiper>
      <SwiperButtons roster={g.roster as any} swiper={swiper} />
    </>
  );
}

function SwiperButtons(props: {
  roster: IGBPlayer[];
  swiper: SwiperRef | null;
}) {
  const { data } = useData();
  const { roster, swiper } = props;
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
        {roster.map((m, index) => {
          const model = data.Models.find((m2: any) => m2.id === m);
          if (!model) { return null }
          return (
            <Chip
              color="primary"
              key={model.id}
              // label={model.displayName}
              label={model.id}
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
