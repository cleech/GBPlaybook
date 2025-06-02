import { RefObject, useRef, useEffect } from "react";
import { useTheme } from "@mui/material";
import { Box, Chip } from "@mui/material";
import { EmblaCarouselType } from 'embla-carousel';

export interface ChipItem {
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

export default function CarouselChipNavigation({
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
