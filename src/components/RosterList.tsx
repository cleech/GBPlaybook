import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListSubheader,
  ListItemIcon,
  ListItem,
  ListItemText,
  ButtonGroup,
  Button,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import MinusIcon from "@mui/icons-material/Remove";
import PlusIcon from "@mui/icons-material/Add";
import useLongPress from "../hooks/useLongPress";
import GBIcon from "./GBIcon";
import { useUpdateAnimation } from "../hooks/useUpdateAnimation";
import { GBGameStateDoc, GBModelExpanded } from "../models/gbdb";
import { useEffect, useMemo, useState } from "react";
import { map } from "rxjs";
import { useSettings } from "../hooks/useSettings";

interface RosterListProps {
  teams: GBGameStateDoc[];
  rosters: GBModelExpanded[][];
  expanded: boolean;
  onClick: (index: number, expand: boolean) => void;
  disabled: boolean[];
}

interface CounterProps<T> {
  object: T;
  label: (o: T) => string;
  value: (o: T) => number;
  setValue: (o: T, v: number) => void;
  disabled: boolean;
  longPressClear?: boolean;
}

function CounterLabel<T>(props: {
  disabled: boolean;
  object: T;
  label: (o: T) => string;
}) {
  const { disabled, object, label } = props;
  const newLabel = label(object);
  const ref = useUpdateAnimation(disabled, [newLabel]);
  return (
    <Typography ref={ref} sx={{ width: "100%", textAlign: "center" }}>
      {newLabel}
    </Typography>
  );
}

function Counter<T>({
  object,
  label,
  value,
  setValue,
  disabled = false,
  longPressClear = false,
}: CounterProps<T>) {
  const longPressDown = useLongPress({
    onLongPress: () => {
      setValue(object, 0);
    },
    onClick: (e) => {
      e.stopPropagation();
      const v = value(object);
      if (v > 0) {
        setValue(object, v - 1);
      }
    },
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CounterLabel disabled={disabled} object={object} label={label} />
      <ButtonGroup size="small" variant="contained" disabled={disabled}>
        <Button
          {...(longPressClear ? longPressDown : {})}
          onClick={(e) => {
            e.stopPropagation();
            if (!longPressClear) {
              const v = value(object);
              if (v > 0) {
                setValue(object, v - 1);
              }
            }
          }}
        >
          <MinusIcon fontSize="inherit" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            const v = value(object);
            setValue(object, v + 1);
          }}
        >
          <PlusIcon fontSize="inherit" />
        </Button>
      </ButtonGroup>
    </div>
  );
}

const HealthCounterLabel = (props: {
  health: number;
  model: GBModelExpanded;
  disabled: boolean;
}) => {
  const { model, disabled } = props;
  const ref = useUpdateAnimation<HTMLButtonElement>(disabled, [props.health]);
  return (
    <Button ref={ref} disabled size="small">
      <Typography variant="body2" color="text.primary">
        {`${String(props.health).padStart(2, "0")} / ${String(
          model.hp
        ).padStart(2, "0")}`}
      </Typography>
    </Button>
  );
};

export function HealthCounter({
  state,
  model,
  disabled = false,
  stacked = false,
}: {
  state: GBGameStateDoc;
  model: GBModelExpanded;
  disabled?: boolean;
  stacked?: boolean;
}) {
  const longPressDown = useLongPress({
    onLongPress: () => {
      state.incrementalModify((oldState) => {
        const m = oldState.roster.findIndex((_m) => _m.name === model.id);
        oldState.roster[m].health = 0;
        return oldState;
      });
    },
    onClick: () => {
      state.incrementalModify((oldState) => {
        const m = oldState.roster.findIndex((_m) => _m.name === model.id);
        if (oldState.roster[m].health > 0) {
          oldState.roster[m].health -= 1;
        }
        return oldState;
      });
    },
  });
  const longPressUp = useLongPress({
    onLongPress: () => {
      state.incrementalModify((oldState) => {
        const m = oldState.roster.findIndex((_m) => _m.name === model.id);
        if (oldState.roster[m].health < model.recovery) {
          oldState.roster[m].health = model.recovery;
        }
        return oldState;
      });
    },
    onClick: () => {
      state.incrementalModify((oldState) => {
        const m = oldState.roster.findIndex((_m) => _m.name === model.id);
        if (oldState.roster[m].health < model.hp) {
          oldState.roster[m].health += 1;
        }
        return oldState;
      });
    },
  });

  const _index = state.roster.findIndex((m) => m.name === model.id);
  const health$ = useMemo(
    () =>
      state.get$("roster").pipe(
        map((r) => {
          return r[_index].health;
        })
      ),
    [state, _index]
  );
  const [health, setHealth] = useState(model.hp);
  useEffect(() => {
    const observer = health$.subscribe((newHealth) => setHealth(newHealth));
    return () => observer.unsubscribe();
  }, [health$]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {stacked ? (
        <>
          <HealthCounterLabel
            health={health}
            model={model}
            disabled={disabled}
          />
          <ButtonGroup
            size="small"
            variant="contained"
            disabled={disabled}
            sx={{
              "& .MuiButtonGroup-grouped": { minWidth: "1rem" },
            }}
          >
            <Button {...longPressDown} onClick={(e) => e.stopPropagation()}>
              <MinusIcon fontSize="inherit" sx={{ pointerEvents: "none" }} />
            </Button>
            <Button {...longPressUp} onClick={(e) => e.stopPropagation()}>
              <PlusIcon fontSize="inherit" sx={{ pointerEvents: "none" }} />
            </Button>
          </ButtonGroup>
        </>
      ) : (
        <ButtonGroup size="small" variant="contained" disabled={disabled}>
          <Button {...longPressDown} onClick={(e) => e.stopPropagation()}>
            <MinusIcon fontSize="inherit" sx={{ pointerEvents: "none" }} />
          </Button>
          <HealthCounterLabel
            health={health}
            model={model}
            disabled={disabled}
          />
          <Button {...longPressUp} onClick={(e) => e.stopPropagation()}>
            <PlusIcon fontSize="inherit" sx={{ pointerEvents: "none" }} />
          </Button>
        </ButtonGroup>
      )}
    </div>
  );
}

function ScoreCounter(props: { state: GBGameStateDoc; disabled: boolean }) {
  const state = props.state;
  const [score, setScore] = useState(0);
  useEffect(() => {
    const observer = state.get$("score").subscribe((s) => setScore(s));
    return () => observer.unsubscribe();
  }, [state]);
  return (
    <Counter
      object={state}
      disabled={props.disabled}
      label={() => `VP: ${score}`}
      value={() => score}
      setValue={(t, v) => {
        t.incrementalModify((oldValue) => {
          oldValue.score = v;
          return oldValue;
        });
      }}
    />
  );
}

function MomentumCounter(props: { state: GBGameStateDoc; disabled: boolean }) {
  const state = props.state;
  const [momentum, setMomentum] = useState(0);
  useEffect(() => {
    const observer = state.get$("momentum").subscribe((m) => setMomentum(m));
    return () => observer.unsubscribe();
  }, [state]);
  return (
    <Counter
      object={state}
      disabled={props.disabled}
      longPressClear={true}
      label={() => `MOM: ${momentum}`}
      value={() => momentum}
      setValue={(t, v) => {
        t.incrementalModify((oldValue) => {
          oldValue.momentum = v;
          return oldValue;
        });
      }}
    />
  );
}

export default function RosterList({
  teams,
  rosters,
  expanded,
  onClick,
  disabled,
}: RosterListProps) {
  const theme = useTheme();

  const { setting$ } = useSettings();
  const [displayStatLine, setStatLine] = useState<boolean>();
  useEffect(() => {
    const sub = setting$
      ?.pipe(map((s) => s?.toJSON().data.uiPreferences.displayStatLine))
      .subscribe((sl) => setStatLine(sl));
    return () => sub?.unsubscribe();
  });

  const indexBases = teams.reduce(
    (acc, team, index) => {
      return [...acc, acc[index] + team.roster.length + 1];
    },
    [0]
  );
  return (
    <Box
      sx={{
        flexGrow: 0,
        overflow: "auto",
      }}
    >
      {teams.map((team, index) => {
        const indexBase = indexBases[index] + 1;
        return (
          <Accordion
            key={index}
            expanded={expanded === true}
            square
            sx={{
              backgroundColor: "transparent",
            }}
            disableGutters={true}
            elevation={0}
          >
            <AccordionSummary
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                padding: 0,
                borderBottom: `1px solid ${theme.palette.divider}`,
                ".MuiAccordionSummary-content": {
                  margin: 0,
                },
              }}
            >
              <ListSubheader
                onClick={() => {
                  onClick(indexBase - 1, !expanded);
                }}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <ListItemIcon sx={{ alignItems: "center" }}>
                  <div
                    style={{
                      fontSize: 36,
                      width: "1em",
                      height: "1em",
                      overflow: "visible",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <GBIcon
                      icon={team.guild}
                      // fontSize={36}
                      style={{
                        color: theme.palette.text.secondary,
                        // disable filter effects from icon specific CSS
                        filter: "unset",
                        flexShrink: 0,
                      }}
                    />
                  </div>
                </ListItemIcon>
                <ListItemText
                  primary={team.guild}
                  secondary={`${rosters[index].reduce(
                    (acc, m) => acc + (m._inf ?? m.inf),
                    0
                  )} INF`}
                />
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "4px" }}
                >
                  <ScoreCounter state={team} disabled={disabled[index]} />
                  <MomentumCounter state={team} disabled={disabled[index]} />
                </div>
              </ListSubheader>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: 0,
              }}
            >
              <List
                key={index}
                // dense
                disablePadding
                // style={{ width: "100%", maxHeight: "inherit" }}
                sx={{
                  "li:nth-of-type(odd)": {
                    "&.MuiListItem-root": {
                      backgroundColor: "rgba(100%, 100%, 100%, 5%)",
                    },
                  },
                }}
              >
                {rosters[index].map((m: GBModelExpanded, _index: number) => (
                  <ListItem
                    key={m.id}
                    secondaryAction={
                      <HealthCounter
                        state={team}
                        model={m}
                        disabled={disabled[index]}
                      />
                    }
                    onClick={() => {
                      onClick(indexBase + _index, false);
                    }}
                  >
                    <ListItemText
                      primary={m.id}
                      secondary={displayStatLine ? m.statLine : null}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
