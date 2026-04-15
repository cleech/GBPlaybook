import {
  useEffect,
  RefObject,
} from "react";

import {
  Outlet,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from "embla-carousel-react";

export default function LibraryCarousel() {
  const slideRef = useOutletContext<{ slideRef: RefObject<number> }>().slideRef;
  const [, setSearchParams] = useSearchParams();

  const [emblaRef, emblaAPI] = useEmblaCarousel({
    align: 'center',
    containScroll: false,
    // skipSnaps: true,
    startIndex: slideRef.current,
    watchSlides: false,
  });

  useEffect(() => {
    if (!emblaAPI) return;
    const callback = (e: EmblaCarouselType) => {
      const index = e.selectedScrollSnap();
      slideRef.current = index;
      setSearchParams(
        (prev) => {
          prev.set("m", index.toString());
          return prev;
        },
        { replace: true }
      );
    };
    emblaAPI.on('select', callback);
    return () => { emblaAPI.off('select', callback) };
  }, [emblaAPI, slideRef, setSearchParams]);

  return (
    <Outlet context={{ emblaRef, emblaAPI }} />
  );
}
