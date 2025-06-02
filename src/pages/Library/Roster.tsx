import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect,
  RefObject,
  useMemo,
} from "react";

import {
  useOutletContext,
  useLoaderData,
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

import { EmblaCarouselType } from 'embla-carousel';
import { EmblaViewportRefType } from "embla-carousel-react";

import { css, cx } from "@emotion/css";

import { FlipCard } from "../../components/FlipCard";
import { DoubleCard } from "../../components/DoubleCard";

import { AppBarContent } from "../App";
import { NavigateNext, } from "@mui/icons-material";
import { DoubleGuildCard, FlipGuildCard } from "../../components/GuildCard";
import VersionTag from "../../components/VersionTag";
import GBIcon from "../../components/GBIcon";
import { GBGuildDoc, GBModelExpanded } from "../../models/gbdbTypes";

import useResizeObserver from "@react-hook/resize-observer";
import { useDebounceCallback } from "@react-hook/debounce";

const CAROUSEL_GAP = "5vw";
const CAROUSEL_PADDING = 4;

const emblaStyles = {
  viewport: css({
    overflow: "hidden",
    flex: "0 1 100%",
    minHeight: 0,
    position: "relative",
    padding: `${CAROUSEL_PADDING}px`,
    // border: "2px solid red"
  }),
  container: css({
    height: "100%",
    display: "flex",
    gap: CAROUSEL_GAP,
    // border: "2px solid yellow"
  }),
  slide: css({
    flex: "0 0 100%",
    minWidth: 0,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // border: "2px solid blue"
  }),
  card: css({
    // border: "2px solid green"
  })
};

interface CarouselLayoutProps {
  emblaRef: EmblaViewportRefType;
  slides: React.ReactNode[];
  largeLayout?: boolean;
}

function CarouselLayout({
  emblaRef,
  slides,
  largeLayout = false,
}: CarouselLayoutProps) {
  const maxWidth = largeLayout ? 1000 : 500;
  const maxHeight = 700;
  const [slideWidth, setSlideWidth] = useState(maxWidth);
  const [slideHieght, setSlideHieght] = useState(maxHeight);

  const _updateSize = useCallback(({ width, height }: DOMRectReadOnly) => {
    const aspectRatioMultiplier = largeLayout ? 10 : 5;
    const calculatedWidth = Math.min(width, (height * aspectRatioMultiplier) / 7, maxWidth);
    setSlideWidth(calculatedWidth);
    const calculatedHeight = Math.min(height, (width * 7) / aspectRatioMultiplier, maxHeight);
    setSlideHieght(calculatedHeight);
    // console.log(`container {width: ${width}, height: ${height}`);
    // console.log(`card {width: ${calculatedWidth}, height: ${calculatedHeight}`);
  }, [largeLayout, maxWidth, maxHeight]);

  const updateSize = useDebounceCallback(_updateSize, 32, true);

  const sizeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sizeRef.current)
      return;
    const rect = sizeRef.current.getBoundingClientRect();
    updateSize(DOMRectReadOnly.fromRect({
      width: rect.width - (2 * CAROUSEL_PADDING),
      height: rect.height - (2 * CAROUSEL_PADDING),
    }));
  }, [sizeRef, updateSize]);

  useResizeObserver(sizeRef, (entry) => updateSize(entry.contentRect));

  return (
    <div
      className={cx("embla__viewport", emblaStyles.viewport)}
      ref={(el) => { sizeRef.current = el; emblaRef(el); }}
    >
      <div className={cx("embla__container", emblaStyles.container)}>
        {slides.map((slideContent, index) => (
          <div key={index}
            className={cx("embla__slide", emblaStyles.slide)}
            style={{
              maxWidth: `${slideWidth}px`
            }}
          >
            <div
              className={emblaStyles.card}
              style={{
                height: `${slideHieght}px`,
                width: `${slideWidth}px`,
              }}
            >
              {slideContent}
            </div>
          </div>
        ))}
      </div>
      <VersionTag />
    </div>
  );
}

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

      <CarouselButtons
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

interface ChipItem {
  key: string | number;
  label: string;
}

interface CarouselChipNavigationProps {
  embla: EmblaCarouselType | undefined;
  items: ChipItem[];
  slideOffset?: number;
  leadingIcon?: (props: { ref: React.Ref<HTMLDivElement> | undefined }) => React.ReactNode;
  className?: string;
}

function CarouselChipNavigation({
  embla,
  items,
  leadingIcon,
  className,
  slideOffset = 0,
}: CarouselChipNavigationProps) {
  const theme = useTheme();

  const chipRefs: RefObject<HTMLDivElement[]> = useRef([]);
  const activeSlideRef = useRef(0);

  useEffect(() => {
    if (!embla) return;
    activeSlideRef.current = embla.selectedScrollSnap();
    chipRefs.current[activeSlideRef.current]?.classList.add("activeSlide");
    const callback = (e: EmblaCarouselType) => {
      chipRefs.current[activeSlideRef.current]?.classList.remove("activeSlide");
      activeSlideRef.current = e.selectedScrollSnap();
      chipRefs.current[activeSlideRef.current]?.classList.add("activeSlide");
    };
    embla.on('select', callback);
    return () => { embla.off('select', callback) };
  }, [embla]);

  return (
    <div
      className={className}
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
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "5px",
          my: 1, // Added margin for consistent spacing
          '& .activeSlide': {
            boxShadow: `0 0 10px ${theme.palette.warning.main}`
          }
        }}
      >
        {leadingIcon?.({
          ref: (el: HTMLDivElement) => { chipRefs.current[0] = el }
        })}
        {items.map((item, index) => {
          return (
            <Chip
              ref={(el: HTMLDivElement) => { chipRefs.current[index + slideOffset] = el }}
              color="primary"
              key={item.key}
              label={item.label}
              // variant={isActive ? "filled" : "outlined"} // Change variant based on active state
              clickable={false}
              onClick={() => embla?.scrollTo(index + slideOffset)}
            />
          )
        })}
      </Box>
      <div style={{ flex: "1 1" }} />
    </div>
  );
}

function CarouselButtons(props: {
  guild: GBGuildDoc;
  embla: EmblaCarouselType | undefined;
}) {
  const { guild, embla } = props;
  const roster = guild.roster;

  const items: ChipItem[] = useMemo(
    () => roster.map((m, index) => ({ key: index, label: m, })),
    [roster]
  );

  const leadingIcon = (props: { ref: React.Ref<HTMLDivElement> | undefined }) => {
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
        <GBIcon icon={guild.name} className="dark" fontSize="32px" style={{ flexShrink: 0 }} />
      </div>
    </IconButton>
  };

  return (
    <CarouselChipNavigation
      embla={embla}
      items={items}
      slideOffset={1}
      leadingIcon={leadingIcon}
    />
  );
}
