import { css, cx } from "@emotion/css";
import { useDebounceCallback } from "@react-hook/debounce";
import useResizeObserver from "@react-hook/resize-observer";
import { EmblaViewportRefType } from "embla-carousel-react";
import { useState, useCallback, useRef, useLayoutEffect } from "react";
import VersionTag from "../../../components/VersionTag";

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

export default function CarouselLayout({
  emblaRef,
  slides,
  largeLayout = false,
}: CarouselLayoutProps) {
  const maxWidth = largeLayout ? 1000 : 500;
  const maxHeight = 700;
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);

  const _updateSize = useCallback(({ width, height }: DOMRectReadOnly) => {
    const aspectRatioMultiplier = largeLayout ? 10 : 5;
    const calculatedWidth = Math.min(width, (height * aspectRatioMultiplier) / 7, maxWidth);
    setSlideWidth(calculatedWidth);
    const calculatedHeight = Math.min(height, (width * 7) / aspectRatioMultiplier, maxHeight);
    setSlideHeight(calculatedHeight);
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
        {(slideWidth > 0 && slideHeight > 0) && slides.map((slideContent, index) => (
          <div key={index}
            className={cx("embla__slide", emblaStyles.slide)}
            style={{
              maxWidth: `${slideWidth}px`
            }}
          >
            <div
              className={emblaStyles.card}
              style={{
                height: `${slideHeight}px`,
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
