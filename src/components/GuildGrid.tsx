import React, { useEffect, useState } from "react";
// import { Link, Outlet, useParams } from "react-router-dom";

import { useDimensionsRef } from "rooks";
import _ from "lodash";

import { Button, Typography, Divider } from "@mui/material";

import { useData } from "../components/DataContext";
import GBIcon from "../components/GBIcon";

export const itemSize = ({ width, height }: any, count: number, extra = 0) => {
  if (!width || !height) {
    return undefined;
  }

  const layout = (w: number, h: number) => {
    // the # here is equal to the grid gap, or minimal spacing to use
    // const iw = Math.floor((width - w * 10) / w);
    // const ih = Math.floor((height - h * 10) / h);
    const iw = (width - w * 10) / w;
    // extra 5px is for the divider
    const ih = (height - (h * 10) - 5) / h;
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
  controls?: (props: ControlProps) => [JSX.Element, ((guild: string) => void)?];
}

export function GuildGrid({ pickTeam, controls }: GuildGridProps) {
  const [ref, dimensions] = useDimensionsRef();
  const { data, loading } = useData();
  const [size, setSize] = useState(0);

  const [controlElement, controlCallback] = controls
    ? controls({ size })
    : [undefined, undefined];

  useEffect(() => {
    if (!loading && dimensions)
      setSize(itemSize(dimensions, data.Guilds.length, 1)?.size ?? 0);
  }, [data, dimensions, loading]);

  if (loading) {
    return null;
  }

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignContent: "flex-start",
          justifyContent: "space-evenly",
          width: "100%",
          height: "100%",
          gap: "10px",
          padding: "5px",
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
      <Divider />
      {controlElement ?? null}
    </div>
  );
}

export function GuildGridInner({ dimensions, pickTeam, size }: any) {
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
            background: "rgba(100%, 100%, 100%, 5%)",
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
              icon={g.name}
              className="dark"
              style={{
                flexShrink: 0,
                // zIndex: 1,
                // filter: "drop-shadow(0 0 3px black)",
                filter: "drop-shadow(0 0 0.03em black)",
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
            }}
          >
            {g.name}
          </Typography>
        </Button>
      ))}
    </>
  );
}
