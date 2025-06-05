import React, {
  useMemo,
} from "react";

import {
  useOutletContext,
  useLoaderData,
} from "react-router-dom";

import {
  useTheme,
  useMediaQuery,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
} from "@mui/material";

import { EmblaCarouselType } from 'embla-carousel';
import { EmblaViewportRefType } from "embla-carousel-react";

import { FlipCard } from "../../components/FlipCard";
import { DoubleCard } from "../../components/DoubleCard";

import { AppBarContent } from "../App";
import { NavigateNext, } from "@mui/icons-material";
import { DoubleGuildCard, FlipGuildCard } from "../../components/GuildCard";
import GBIcon from "../../components/GBIcon";
import { GBGuildDoc, GBModelExpanded } from "../../models/gbdbTypes";

import CarouselLayout from "./components/CarouselLayout";
import CarouselChipNavigation, { ChipItem } from "./components/CarouselChipNavigation";

export default function Roster() {
  const { guild: g, roster } = useLoaderData<{ guild: GBGuildDoc; roster: GBModelExpanded[] }>();
  const { emblaRef, emblaAPI } = useOutletContext<{ emblaRef: EmblaViewportRefType, emblaAPI: EmblaCarouselType }>();

  const theme = useTheme();
  const large = useMediaQuery(theme.breakpoints.up("sm"));

  const slides = [
    // Guild Card Slide
    large ? <DoubleGuildCard key={g.name} guild={g.name} /> : <FlipGuildCard key={g.name} guild={g.name} />,
    // Roster Card Slides
    ...roster.map((model) =>
      large ? <DoubleCard key={model.id} model={model} /> : <FlipCard key={model.id} model={model} />
    ),
  ];

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

      <RosterButtons
        guild={g}
        embla={emblaAPI}
      />
      <CarouselLayout
        emblaRef={emblaRef}
        slides={slides}
        largeLayout={large}
      />
    </>
  );
}

const createLeadingIcon = (guild: string, embla?: EmblaCarouselType) =>
  (props: { ref?: React.Ref<HTMLDivElement> }) => {
    return <IconButton
      sx={{ padding: 0, mr: 0 }}
      onClick={() => embla?.scrollTo(0)}
    >
      <div
        ref={props.ref}
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
        <GBIcon icon={guild} className="dark" fontSize="32px" style={{ flexShrink: 0 }} />
      </div>
    </IconButton>
  };

function RosterButtons(props: {
  guild: GBGuildDoc;
  embla: EmblaCarouselType | undefined;
}) {
  const { guild, embla } = props;
  const roster = guild.roster;

  const items: ChipItem[] = useMemo(
    () => roster.map((m, index) => ({ key: index, label: m, })),
    [roster]
  );

  const leadingIcon = useMemo(
    () => createLeadingIcon(guild.name, embla),
    [guild, embla]
  )

  return (
    <CarouselChipNavigation
      embla={embla}
      items={items}
      slideOffset={1}
      leadingIcon={leadingIcon}
    />
  );
}
