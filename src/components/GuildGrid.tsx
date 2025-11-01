import React, { ComponentType, useCallback, useLayoutEffect, useEffect, useState, useRef } from "react";
import useResizeObserver from "@react-hook/resize-observer";

import { Button, Divider, Typography } from "@mui/material";

import GBIcon from "../components/GBIcon";
import { GBGuildDoc } from "../models/gbdbTypes";
import { Observable, fromEventPattern } from "rxjs";

import { closestCenter, DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useData } from "../hooks/useData";
import { css, cx, keyframes } from "@emotion/css";
import { AppBarContent } from "../pages/App";
import GridSettingsMenu from "./GridSettingsMenu";

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
  id: string;
  key: string;
  name: string;
  icon: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

interface GuildGridProps {
  guilds: GBGuildDoc[];
  Controller: ComponentType<ControlProps>;
}

const wiggle = css({
  '&> :nth-child(odd) > button': {
    animationName: keyframes({
      '0%': {
        transform: 'rotate(-1deg)',
        animationTimingFunction: 'ease-in',
      },
      '50%': {
        transform: 'rotate(1.5deg)',
        animationTimingFunction: 'ease-out',
      }
    }),
    transformOrigin: '50% 10%',
  },
  '&> :nth-child(even) > button': {
    animationName: keyframes({
      '0%': {
        transform: 'rotate(1deg)',
        animationTimingFunction: 'ease-in',
      },
      '50%': {
        transform: 'rotate(-1.5deg)',
        animationTimingFunction: 'ease-out',
      }
    }),
    transformOrigin: '30% 5%',
  },
  '&> div > button': {
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
  },
  '&> :nth-child(3n) > button': { animationDelay: '0s' },
  '&> :nth-child(3n-1) > button': { animationDelay: '-0.1s' },
  '&> :nth-child(3n-2) > button': { animationDelay: '-0.2s' },
  '&> :nth-child(5n) > button': { animationDuration: '.45s' },
  '&> :nth-child(5n-1) > button': { animationDuration: '.2s' },
  '&> :nth-child(5n-2) > button': { animationDuration: '.3s' },
  '&> :nth-child(5n-3) > button': { animationDuration: '.4s' },
  '&> :nth-child(5n-4) > button': { animationDuration: '.33s' },
});

export function GuildGrid({
  guilds,
  Controller,
}:
  GuildGridProps) {

  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState<number>(0);
  const updateSize = useCallback(({ width, height }: DOMRectReadOnly) => {
    const count = guilds.length;
    const size = itemSize({ width, height }, count, 1)?.size ?? 0;
    setSize(size);
  }, [guilds]);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    updateSize(rect);
  }, [updateSize]);
  useResizeObserver(ref, (entry) => updateSize(entry.contentRect));

  const observers = useRef<Set<(e: string) => void>>(new Set());
  const [event$, setEvent$] = useState<Observable<string>>();

  useEffect(() => {
    const event$ = fromEventPattern<string>(
      (handler) => observers.current.add(handler),
      (handler) => observers.current.delete(handler)
    );
    setEvent$(event$);
  }, [observers]);

  const emitEvent = useCallback(
    (e: string) => {
      observers.current.forEach((handler) => handler(e));
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
      {size && event$ && <>
        <GuildGridInner guilds={guilds} size={size} pickTeam={emitEvent} />
        <Divider />
        <Controller size={size} update$={event$} />
      </>}
    </div>
  );
}

const GuildGridInner = React.memo(
  (props: {
    guilds: GBGuildDoc[];
    pickTeam?: (guild: string) => void;
    size: number;
  }) => {
    const { pickTeam, size, guilds } = props;
    const { gbdb } = useData();

    const [edit, setEdit] = useState(false);

    const sensors = useSensors(
      useSensor(TouchSensor),
      useSensor(MouseSensor),
      // useSensor(PointerSensor),
      // useSensor(KeyboardSensor, {
      //   coordinateGetter: sortableKeyboardCoordinates
      // }),
    );

    const [list, setList] = useState(
      (guilds).map((g) => ({
        key: g.name,
        id: g.name,
        name: g.name,
        icon: g.name,
        disabled: g.roster.length === 0,
      }))
    );

    const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) {
        return;
      }
      if (active.id !== over.id) {
        const oldIndex = list.findIndex((element) => element.id === active.id);
        const newIndex = list.findIndex((element) => element.id === over.id);
        const newList = arrayMove(list, oldIndex, newIndex);
        setList(newList);
        const settings = await gbdb?.getLocal("settings");
        await settings?.incrementalPatch({
          customListOrder: newList.map((g) => g.name)
        }).catch(console.error);
      }
    }

    return (
      <>
        <AppBarContent>
          <GridSettingsMenu edit={edit} setEdit={setEdit}
            list={list} setList={async (gs) => {
              setList(gs);
              const settings = await gbdb?.getLocal("settings");
              await settings?.incrementalPatch({
                customListOrder: gs.map((g) => g.name)
              }).catch(console.error);
            }}
          />
        </AppBarContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext disabled={!edit} items={list} strategy={rectSortingStrategy}>
            <div
              className={cx({ [wiggle]: edit })}
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
          </SortableContext>
        </DndContext>
      </>
    );
  }
);

export function GridIconButton(props: {
  g: GridIcon;
  pickTeam?: (guild: string) => void;
  size: number;
}) {
  const { g, pickTeam, size } = props;
  const sortable = useSortable({ id: g.id });
  return (
    <div ref={sortable.setNodeRef}
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      {...sortable.listeners}
      {...sortable.attributes}
    >
      <Button
        key={g.key}
        disabled={props.g.disabled}
        variant="outlined"
        onClick={() => pickTeam?.(g.key)}
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size,
          background: "rgba(100%, 100%, 100%, 15%)",
          backdropFilter: "blur(10px)",
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
            filter: (props.g.disabled ? "grayscale(0.8)" : "unset"),
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
            color: props.g.disabled ? "darkgrey" : "whitesmoke",
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
    </div >
  );
}
