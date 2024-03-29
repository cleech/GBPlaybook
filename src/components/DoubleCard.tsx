import {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  JSX,
  useEffect,
} from "react";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";
import GBImages from "../utils/GBImages";
import { GBModelExpanded } from "../models/gbdb";
import { useSettings } from "../hooks/useSettings";
import { map } from "rxjs";

export function DoubleCard({ model }: { model: GBModelExpanded }): JSX.Element {
  const { setting$ } = useSettings();
  const targetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.0);

  const [style, setStyle] = useState<"sfg" | "gbcp">();
  useEffect(() => {
    const sub = setting$
      ?.pipe(map((s) => s?.toJSON().data.cardPreferences.preferredStyle))
      .subscribe((style) => setStyle(style));

    return () => sub?.unsubscribe();
  }, [setting$]);

  useLayoutEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });
  const updateSize = useCallback(() => {
    if (!targetRef.current) {
      return;
    }
    const { width, height } = targetRef.current.getBoundingClientRect();
    const vertScale = width / 1000;
    const horiScale = height / 700;
    const newScale = Math.min(vertScale, horiScale, 1);
    setScale(newScale ?? 1);
  }, []);

  const key = model.id;
  const gbcp =
    style === "gbcp" &&
    (GBImages.has(`${key}_gbcp_front`) || GBImages.has(`${key}_full`));
  const image = gbcp ? GBImages.get(`${key}_full`) ?? undefined : undefined;

  return (
    <div
      ref={targetRef}
      style={{
        width: "100%",
        maxWidth: "1000px",
        height: "100%",
        maxHeight: "700px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: `${1000 * scale}px`,
          height: `${700 * scale}px`,
          // aspectRatio: 10 / 7,
          display: "flex",
          flexDirection: "row",
          ...(image
            ? {
                backgroundImage: `url(${image})`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                borderRadius: `${25 * scale}px`,
              }
            : {}),
        }}
      >
        <CardFront
          model={model}
          noBackground={!!image}
          style={{
            "--scale": scale,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
        <CardBack
          model={model}
          noBackground={!!image}
          style={{
            "--scale": scale,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        />
      </div>
    </div>
  );
}
