import React, { useRef, useState, useLayoutEffect } from "react";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";

import { useDimensionsRef } from "rooks";
import _ from "lodash";

import { Box, Card, Chip, useTheme, useMediaQuery } from "@mui/material";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";

import { useData } from "../components/DataContext";
import GBIcon from "../components/GBIcon";
import { FlipCard, DoubleCard } from "../components/Card";

import { GuildGrid } from "../components/GuildGrid";
import { IGBPlayer, IGBTeam } from "../models/Root";

export default function Library() {
  return (
    <main
      style={{
        display: "flex",
        // flexDirection: "column",
        flexDirection: "row",
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
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));
  const { guild } = useParams();

  const ref = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(240);
  const [cardHeight, setCardHeight] = useState(336);
  const [slideHeight, setSlideHeight] = useState(336);
  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });
  function updateSize() {
    let width = ref.current?.getBoundingClientRect().width ?? 0;
    let height = ref.current?.getBoundingClientRect().height ?? 0;
    let barHeight = large ? 56 : 112;
    setCardWidth(Math.min(width - 12, ((height - barHeight) * 5) / 7 - 12));
    setCardHeight(Math.min(height - barHeight - 12, (width * 7) / 5 - 12));
    setSlideHeight(height - barHeight);
  }

  const { data, loading } = useData();
  if (loading) {
    return null;
  }
  const g = data.Guilds.find((g: any) => g.name === guild);
  return (
    <Swiper
      // slidesPerView="auto"
      slidesPerView={1.1}
      centeredSlides={true}
      autoHeight={true}
      spaceBetween={0.25 * 96}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
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
              paddingTop: "0.25in",
              paddingBottom: "0.25in",
              display: "flex",
              justifyContent: "center",
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
      <SwiperButtons roster={g.roster} />
    </Swiper>
  );
}

function SwiperButtons(props: { roster: IGBPlayer[] }) {
  const { data, loading } = useData();
  const swiper = useSwiper();
  const { roster } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ flex: "1 1" }} />
      <Box
        slot="container-end"
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
                swiper.slideTo(index);
              }}
            />
          );
        })}
      </Box>
      <div style={{ flex: "1 1" }} />
    </div>
  );
}
