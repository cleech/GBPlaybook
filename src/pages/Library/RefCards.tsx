import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect,
  RefObject,
} from "react";

import {
  useOutletContext,
} from "react-router-dom";

import {
  Box,
  Chip,
  useTheme,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";

import { EmblaCarouselType } from 'embla-carousel';
import { EmblaViewportRefType } from "embla-carousel-react";

import { css, cx } from "@emotion/css";

import { AppBarContent } from "../App";
import { NavigateNext, } from "@mui/icons-material";
import VersionTag from "../../components/VersionTag";
import { ReferenceCard } from "../../components/Gameplan";

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