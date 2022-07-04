import React, { useRef } from "react";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";

import { useDimensionsRef } from "rooks";
import _ from "lodash";

import { Button } from "@mui/material";

import { Virtual } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/virtual";

import { useData } from "../components/DataContext";
import GBIcon from "../components/GBIcon";
import { FlipCard } from "../components/Card";
import { convertToObject } from "typescript";

import { GuildGrid } from "../components/GuildGrid";

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
  const { guild } = useParams();
  const { data, loading } = useData();
  if (loading) {
    return null;
  }
  const g = data.Guilds.find((g: any) => g.name === guild);
  return (
    <Swiper
      // modules={[Virtual]}
      slidesPerView="auto"
      // slidesPerView={1.4}
      // spaceBetween={0}
      centeredSlides
      // virtual
      // style={{overflow: "visible"}}
    >
      {g.roster.map((m: string, index: number) => {
        const model = data.Models.find((m2: any) => m2.id === m);
        // if (GBImages[`${model.id}_gbcp_front`]) {
        //   model.gbcp = true;
        // }
        return (
          <SwiperSlide
            key={m}
            virtualIndex={index}
            style={{
              width: "3in",
              height: "4in",
              // width: "auto",
              // height: "auto",
              // padding: "0.25in",
              // overflow: 'visible',
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            {/* <FlipCard name={m} /> */}
            <FlipCard model={model} controls={undefined} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
