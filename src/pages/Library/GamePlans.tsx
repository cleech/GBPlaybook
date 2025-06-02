import {
  useOutletContext,
} from "react-router-dom";

import {
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";

import { EmblaCarouselType } from 'embla-carousel';
import { EmblaViewportRefType } from "embla-carousel-react";

import { useData } from "../../hooks/useData";

import { AppBarContent } from "../App";
import { NavigateNext, } from "@mui/icons-material";
import type { Gameplan } from "../../components/DataTypes";
import { GameplanCard } from "../../components/Gameplan";
import CarouselLayout from "./components/CarouselLayout";
import CarouselChipNavigation from "./components/CarouselChipNavigation";

export default function GamePlans() {
  const { gameplans, gameplanYear } = useData();
  const { emblaRef, emblaAPI } = useOutletContext<{ emblaRef: EmblaViewportRefType, emblaAPI: EmblaCarouselType }>();

  if (!gameplans) {
    return null;
  }

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
      <CarouselChipNavigation
        embla={emblaAPI}
        items={gameplans.map((g, index) => ({
          key: index,
          label: g.title,
        }))}
      />
      <CarouselLayout
        emblaRef={emblaRef}
        slides={slides}
        largeLayout={false}
      />
    </>
  );
}
