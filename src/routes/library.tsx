import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import {
  Link,
  Outlet,
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

import { useDimensionsRef } from "rooks";
import _ from "lodash";

import { Box, Card, Chip, useTheme, useMediaQuery } from "@mui/material";

import type { Swiper as SwiperRef } from "swiper";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";

import { useData } from "../components/DataContext";
import GBIcon from "../components/GBIcon";
import { FlipCard, DoubleCard } from "../components/Card";

import { GuildGrid } from "../components/GuildGrid";
import { useStore, IGBPlayer, IGBTeam } from "../models/Root";

export default function Library() {
  const location = useLocation();
  const { setLibraryRoute } = useStore();

  useEffect(() => {
    setLibraryRoute(`#${location.pathname}${location.search}`);
  }, [location]);

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
    <GuildGrid
      pickTeam={(guild) => {
        navigate(guild);
      }}
    />
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
  if (loading) {
    return null;
  }
  const g = data.Guilds.find((g: any) => g.name === guild);
  return (
    <>
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
              }}
            >
              {large ? (
                <DoubleCard model={model} controls={undefined} />
              ) : (
                <FlipCard model={model} controls={undefined} />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
      <SwiperButtons roster={g.roster} swiper={swiper} />
    </>
  );
}

function SwiperButtons(props: {
  roster: IGBPlayer[];
  swiper: SwiperRef | null;
}) {
  const { data, loading } = useData();
  const { roster, swiper } = props;
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
