import { Fragment, useState } from "react";
import {
  Checkbox,
  Divider,
  Typography,
  ButtonGroup,
  Button,
  IconButton,
  Menu,
} from "@mui/material";

import { Remove, Add, CasinoTwoTone } from "@mui/icons-material";

import "./Calc.css";

const formatter = new Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function fact(n: number): number {
  if (n === 0) {
    return 1;
  }
  return n * fact(n - 1);
}

function OddsToHit(target: number, pool: number, reroll: Boolean): number[] {
  if (!target || !pool) {
    return [];
  }
  const n = pool;
  // odds of a single die failing to hit
  const q = Math.pow((target - 1) / 6, reroll ? 2 : 1);
  // odds of a single die hitting target
  const p = 1 - q;
  const exact_odds =
    // array of possible hit counts
    [...Array(pool).keys()]
      .map((k) => k + 1)
      .map(
        (k) =>
          // mapped into odds of hitting exactly that many
          (fact(n) / (fact(k) * fact(n - k))) *
          Math.pow(p, k) *
          Math.pow(1 - p, n - k)
      );
  const cumulative_odds = [...Array(pool).keys()]
    // sum to provide odds of "at least" k hits
    .map((i) => exact_odds.slice(i).reduce((acc, x) => acc + x, 0))
    // limit to 99.9 to prevent floating point rounding errors going to 100% or higher
    .map((n) => Math.min(n, 0.999));
  return cumulative_odds;
}

interface CounterProps {
  value: number;
  setValue: (n: number) => void;
  clamp: (n: number) => boolean;
}

function Counter(props: CounterProps) {
  const { value, setValue, clamp } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ButtonGroup size="small" variant="contained">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (clamp(value - 1)) {
              setValue(value - 1);
            }
          }}
        >
          <Remove fontSize="inherit" sx={{ pointerEvents: "none" }} />
        </Button>

        <Button disabled size="small">
          <Typography variant="body2" color="text.primary">
            {value}
          </Typography>
        </Button>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (clamp(value + 1)) {
              setValue(value + 1);
            }
          }}
        >
          <Add fontSize="inherit" sx={{ pointerEvents: "none" }} />
        </Button>
      </ButtonGroup>
    </div>
  );
}

function OddsCalc() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [target, setTarget] = useState<number>(4);
  const [pool, setPool] = useState<number>(4);
  const [reroll, setReroll] = useState(false);
  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => {
          setAnchorEl(anchorEl ? null : e.currentTarget);
        }}
      >
        <CasinoTwoTone />
      </IconButton>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <Typography variant="h5" textAlign="center">
          Dice Odds
        </Typography>
        <Divider />
        <div
          style={{
            margin: "1em",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5em",
          }}
        >
          <Typography>Target Number :</Typography>
          <Counter
            value={target}
            setValue={setTarget}
            clamp={(n) => n > 1 && n < 7}
          />
          <Typography>Dice Pool :</Typography>
          <Counter value={pool} setValue={setPool} clamp={(n) => n > 0} />
          <Typography>Reroll :</Typography>
          <Checkbox
            value={reroll}
            onChange={(_e, checked) => {
              setReroll(checked);
            }}
            sx={{ padding: 0 }}
          />
        </div>
        <Divider />
        <div
          style={{
            margin: "1em",
            display: "grid",
            gap: "0em 1em",
            justifyContent: "center",
            justifyItems: "center",
            gridTemplateColumns: "auto auto",
          }}
        >
          <Typography sx={{ textDecoration: "underline" }}>Hits</Typography>
          <Typography sx={{ textDecoration: "underline" }}>Chance</Typography>
          {
            // [.95, .85, .75, .65, .55, .45, .35, .25, .15, .05]
            OddsToHit(target, pool, reroll)
            .map((n, i) => (
              <Fragment key={i}>
                <div>{i + 1}+</div>
                <div
                  className={`dice-bin-${Math.floor(n * 10)}`}
                  style={{ padding: "0 1em", margin: "1px", width: "100%" }}
                >
                  {formatter.format(n)}
                </div>
              </Fragment>
            ))
          }
        </div>
      </Menu>
    </>
  );
}
export default OddsCalc;
