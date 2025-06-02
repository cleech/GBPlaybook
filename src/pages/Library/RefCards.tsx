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

import { AppBarContent } from "../App";
import { NavigateNext, } from "@mui/icons-material";
import { ReferenceCard } from "../../components/Gameplan";

import CarouselLayout from "./components/CarouselLayout";
import CarouselChipNavigation from "./components/CarouselChipNavigation";

export default function RefCards() {
  const { emblaRef, emblaAPI } = useOutletContext<{ emblaRef: EmblaViewportRefType, emblaAPI: EmblaCarouselType }>();

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
      <CarouselChipNavigation
        embla={emblaAPI}
        items={[
          "Playbook Results",
          "Turn Sequence",
          "Conditions",
          "Spending Momentum",
          "Actions",
        ].map((title, index) => ({ key: index, label: title }))}
      />
      <CarouselLayout
        emblaRef={emblaRef}
        slides={slides}
        largeLayout={false}
      />
    </>
  );
}