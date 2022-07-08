import React, { useRef } from "react";
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
      {/* <h2>Card Library</h2> */}
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
  // const swiperRef = useRef<SwiperClass>(null);
  // const swiperRef = useRef<any>(null);
  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));
  const { guild } = useParams();
  const { data, loading } = useData();
  if (loading) {
    return null;
  }
  const g = data.Guilds.find((g: any) => g.name === guild);
  return (
    <Swiper
      // modules={[Grid]}
      // grid={{rows: 2}}
      // ref={swiperRef}
      slidesPerView="auto"
      centeredSlides={true}
      autoHeight={true}
      spaceBetween={0.25 * 96}
      style={{
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
              // height: "5in",
              // width: "6in",
              // width: "100%",
              // height: "4in",
              width: "500px",
              // height: "700px",
              // height: "auto",
              // maxWidth: "500px",
              // maxHeight: "700px",
              paddingTop: "0.25in",
              paddingBottom: "0.25in",
              // overflow: 'visible',
              // alignItems: "center",
              // justifyContent: "center",
              // display: "flex",
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
