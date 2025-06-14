import React, { ComponentType, useCallback, useLayoutEffect, useMemo, useRef } from "react";
import useResizeObserver from "@react-hook/resize-observer";

import { Button, Divider, Typography } from "@mui/material";

import GBIcon from "../components/GBIcon";
import { GBGuildDoc } from "../models/gbdbTypes";
import { Observable, fromEventPattern } from "rxjs";

function maxBy<T>(data: Array<T>, by: (v: T) => number) {
  return data.reduce((a, b) => (by(a) >= by(b) ? a : b));
}

function itemSize(
  { width, height }: { width: number; height: number },
  count: number,
  extra: number = 0
) {
  if (!width || !height || count <= 0) {
    return undefined;
  }

  const layout = (w: number, h: number) => {
    // the # here is equal to the grid gap, or minimal spacing to use
    // const iw = Math.floor((width - w * 10) / w);
    // const ih = Math.floor((height - h * 10) / h);
    const iw = (width - w * 10) / w;
    // extra 5px is for the divider
    const ih = (height - h * 10 - 5) / h;
    const size = Math.min(iw, ih);
    const margin = (iw - size) / 2;
    return {
      w: iw,
      h: ih,
      size: size,
      margin: margin,
      wx: w,
      hx: h,
    };
  };

  return maxBy(
    // no more guessing, just check every possible layout
    // _.range(1, count + 1)
    Array.from({ length: count }, (_, i) => i + 1).map((n) =>
      layout(n, Math.ceil(count / n) + extra)
    ),
    (layout) => layout.size
  );
}

export interface ControlProps {
  size: number;
  // Inner: ComponentType<GuildGridInnerProps>;
  update$: Observable<string>;
}

interface GridIcon {
  key: string;
  name: string;
  icon: string;
  style?: React.CSSProperties;
}

interface GuildGridProps {
  guilds: GBGuildDoc[];
  Controller: ComponentType<ControlProps>;
}

export function GuildGrid({
  guilds,
  Controller,
}:
  GuildGridProps) {

  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState<number>(0);
  const updateSize = useCallback(({ width, height }: DOMRectReadOnly) => {
    const count = guilds?.length ?? 0;
    const size = itemSize({ width, height }, count, 1)?.size ?? 0;
    setSize(size);
  }, [guilds]);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    updateSize(rect);
  }, [updateSize]);
  useResizeObserver(ref, (entry) => updateSize(entry.contentRect));

  const observers = useMemo<Set<(e: string) => void>>(() => new Set(), []);
  const event$ = fromEventPattern<string>(
    (handler) => observers.add(handler),
    (handler) => observers.delete(handler)
  );
  const emitEvent = useCallback(
    (e: string) => {
      observers.forEach((handler) => handler(e));
    },
    [observers]
  );

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        // width: "100%",
        height: "100%",
        // background: "cadetblue",
        alignContent: "flex-start",
        justifyContent: "space-evenly",
      }}
    >
      {size && <>
        <GuildGridInner guilds={guilds} size={size} pickTeam={emitEvent} />
        <Divider />
        <Controller size={size} update$={event$} />
      </>}
    </div>
  );
}

const GuildGridInner = React.memo(
  (props: {
    guilds?: GBGuildDoc[];
    pickTeam?: (guild: string) => void;
    size: number;
  }) => {
    const { pickTeam, size, guilds } = props;

    if (!guilds) {
      return null;
    }

    const list: GridIcon[] = (guilds as GBGuildDoc[]).map((g: GBGuildDoc) => ({
      key: g.name,
      name: g.name,
      icon: g.name,
    }));

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignContent: "flex-start",
          justifyContent: "space-evenly",
          // width: "100%",
          // height: "100%",
          gap: "10px",
          padding: "5px",
          // flexBasis: "100%",
          // flexShrink: 1,
          overflow: "clip",
        }}
      >
        {list.map((g) => (
          <GridIconButton key={g.key} g={g} pickTeam={pickTeam} size={size} />
        ))}
      </div>
    );
  }
);

export function GridIconButton(props: {
  g: GridIcon;
  pickTeam?: (guild: string) => void;
  size: number;
}) {
  const { g, pickTeam, size } = props;
  return (
    <Button
      key={g.key}
      variant="outlined"
      onClick={() => pickTeam?.(g.key)}
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size,
        background: "rgba(100%, 100%, 100%, 5%)",
      }}
      sx={{
        "@media (hover: hover)": {
          "& > div": {
            transition: "transform .25s",
          },
          "&:hover > div": {
            transform: "scale(1.2)",
          },
        },
      }}
    >
      <div
        style={{
          display: "flex",
          placeContent: "center",
          placeItems: "center",
          fontSize: size * 0.7,
          // fontSize: size / 1.3125,
          width: "1em",
          height: "1em",
          borderRadius: "50%",
          padding: "0.0625em",
          background: "content-box linear-gradient(to bottom, #000, #333)",
        }}
      >
        <GBIcon
          icon={g.icon}
          className="dark"
          style={{
            flexShrink: 0,
            // zIndex: 1,
            // filter: "drop-shadow(0 0 3px black)",
            filter: "drop-shadow(0 0 0.03em black)",
            ...(g.style || {}),
          }}
        />
      </div>
      <Typography
        variant="caption"
        style={{
          color: "whitesmoke",
          // letterSpacing: "normal",
          textTransform: "capitalize",
          textShadow:
            "1px 1px 1px black, -1px -1px 1px black, 1px -1px 1px black, -1px 1px 1px black, 0 1px 1px black, 1px 0 1px black, 0 -1px 1px black, -1px 0 1px black",
          zIndex: 1,
        }}
      >
        {g.name}
      </Typography>
    </Button>
  );
}
