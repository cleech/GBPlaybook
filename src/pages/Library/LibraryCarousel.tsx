import {
  useEffect,
  RefObject,
} from "react";

import {
  Outlet,
  useOutletContext,
} from "react-router-dom";

import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from "embla-carousel-react";

export default function LibraryCarousel() {
  const slideRef = useOutletContext<{ slideRef: RefObject<number> }>().slideRef;

  const [emblaRef, emblaAPI] = useEmblaCarousel({
    align: 'center',
    containScroll: false,
    // skipSnaps: true,
    startIndex: slideRef.current,
    watchSlides: false,
  });

  useEffect(() => {
    if (!emblaAPI) return;
    const callback = (e: EmblaCarouselType) => { slideRef.current = e.selectedScrollSnap() };
    emblaAPI.on('select', callback);
    return () => { emblaAPI.off('select', callback) };
  }, [emblaAPI, slideRef]);

  return (
    <Outlet context={{ emblaRef, emblaAPI }} />
  );
}
