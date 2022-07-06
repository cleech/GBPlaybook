import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";

import { useDimensionsRef } from "rooks";
import _ from "lodash";

import { Button } from "@mui/material";

import { useData } from "../components/DataContext";
import GBIcon from "../components/GBIcon";

export const itemSize = ({ width, height }: any, count: number, extra = 0) => {
  if (!width || !height) {
    return undefined;
  }

  const layout = (w: number, h: number) => {
    // the 10 here it 2 * margin, or minimal spacing to use
    const iw = Math.floor((width - w * 10) / w);
    const ih = Math.floor((height - h * 10) / h);
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

  return _.maxBy(
    // no more guessing, just check every possible layout
    _.range(1, count + 1).map((n) => layout(n, Math.ceil(count / n) + extra)),
    (layout) => layout.size
  );
};

export interface ControlProps {
  size: number;
}

interface GuildGridProps {
  pickTeam?: (guild: string) => void;
  // controls?: (props: ControlProps) => JSX.Element;
  controls?: (props: ControlProps) => [JSX.Element, ((guild: string) => void)?];
}

export function GuildGrid({ pickTeam, controls }: GuildGridProps) {
  const [ref, dimensions, node] = useDimensionsRef();
  const { data, loading } = useData();
  const [size, setSize] = useState(0);

  const [controlElement, controlCallback] = controls
    ? controls({ size })
    : [undefined, undefined];

  useEffect(() => {
    if (!loading && dimensions)
      setSize(itemSize(dimensions, data.Guilds.length, 1)?.size ?? 0);
  }, [data, dimensions]);

  if (loading) {
    return null;
  }

  return (
    <>
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          // alignContent: "flex-start",
          alignContent: "space-evenly",
          justifyContent: "space-evenly",
          width: "100%",
          height: "100%",
          // gap: "10px",
          // padding: "5px",
        }}
      >
        {size > 0 && (
          <GuildGridInner
            dimensions={dimensions}
            pickTeam={controlCallback ?? pickTeam}
            controls={controls}
            size={size}
          />
        )}
      </div>
      {controlElement ?? null}
    </>
  );
}

export function GuildGridInner({ dimensions, pickTeam, controls, size }: any) {
  const { data, loading } = useData();
  if (loading || !dimensions) {
    return null;
  }

  return (
    <>
      {data.Guilds.map((g: any) => (
        <Button
          key={g.name}
          variant="outlined"
          onClick={() => {
            pickTeam && pickTeam(g.name);
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: size,
            minHeight: size,
            maxWidth: size,
            maxHeight: size,
          }}
        >
          <GBIcon icon={g.name} size={size} />
          {g.name}
        </Button>
      ))}
    </>
  );
}
