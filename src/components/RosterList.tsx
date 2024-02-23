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
import useLongPress from "../components/useLongPress";
import GBIcon from "./GBIcon";
// import { useRTC } from "../services/webrtc";
import { useUpdateAnimation } from "./useUpdateAnimation";
import { useStore } from "../models/Root";
import { GBGameStateDoc, GBModelExpanded } from "../models/gbdb";

interface RosterListProps {
  teams: GBGameStateDoc[];
  rosters: GBModelExpanded[][];
  expanded: boolean;
  onClick: (index: number, expand: boolean) => void;
}

interface CounterProps<T> {
  object: T;
  label: (o: T) => string;
  value: (o: T) => number;
  setValue: (o: T, v: number) => void;
  disabled?: boolean;
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
  // const { dc } = useRTC();
  const longPressDown = useLongPress({
    onLongPress: () => {
      state.incrementalModify((oldState) => {
        const m = oldState.roster.findIndex((_m) => _m.name === model.id);
        model.health = oldState.roster[m].health = 0;
        return oldState;
      });
      // dc?.send(JSON.stringify({ model: model.id, health: 0 }));
    },
    onClick: () => {
      state.incrementalModify((oldState) => {
        const m = oldState.roster.findIndex((_m) => _m.name === model.id);
        if (oldState.roster[m].health > 0) {
          model.health = oldState.roster[m].health -= 1;
        }
        return oldState;
      });
      // dc?.send(JSON.stringify({ model: model.id, health: h }));
    },
  });
  const longPressUp = useLongPress({
    onLongPress: () => {
      state.incrementalModify((oldState) => {
        const m = oldState.roster.findIndex((_m) => _m.name === model.id);
        if (oldState.roster[m].health < model.recovery) {
          model.health = oldState.roster[m].health = model.recovery;
        }
        return oldState;
      });
      // dc?.send(JSON.stringify({ model: model.id, health: model.recovery }));
    },
    onClick: () => {
      state.incrementalModify((oldState) => {
        const m = oldState.roster.findIndex((_m) => _m.name === model.id);
        if (oldState.roster[m].health < model.hp) {
          model.health = oldState.roster[m].health += 1;
        }
        return oldState;
      });
      // dc?.send(JSON.stringify({ model: model.id, health: h }));
    },
  });

  const health = state.roster.find((m) => m.name === model.id)?.health || 0;

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

export default function RosterList({
  teams,
  rosters,
  expanded,
  onClick,
}: RosterListProps) {
  const theme = useTheme();
  const { settings } = useStore();
  // const { dc } = useRTC();
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
                  <Counter
                    object={team}
                    disabled={team.disabled}
                    label={(t) => `VP: ${t.score}`}
                    value={(t) => t.score}
                    setValue={(t, v) => {
                      t.incrementalModify((oldValue) => {
                        oldValue.score = v;
                        return oldValue;
                      });
                      // dc?.send(JSON.stringify({ VP: v }));
                    }}
                  />
                  <Counter
                    object={team}
                    disabled={team.disabled}
                    longPressClear={true}
                    label={(t) => `MOM: ${t.momentum}`}
                    value={(t) => t.momentum}
                    setValue={(t, v) => {
                      t.incrementalModify((oldValue) => {
                        oldValue.momentum = v;
                        return oldValue;
                      });
                      // dc?.send(JSON.stringify({ MOM: v }));
                    }}
                  />
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
                {rosters[index].map((m: GBModelExpanded, index: number) => (
                  <ListItem
                    key={m.id}
                    secondaryAction={
                      <HealthCounter
                        state={team}
                        model={m}
                        disabled={team.disabled}
                      />
                    }
                    onClick={() => {
                      onClick(indexBase + index, false);
                    }}
                  >
                    <ListItemText
                      primary={m.id}
                      secondary={
                        settings.uiPreferences.displayStatLine
                          ? m.statLine
                          : null
                      }
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
