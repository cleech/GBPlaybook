import React from "react";
import {
  List,
  ListSubheader,
  ListItemIcon,
  ListItem,
  ListItemText,
  ButtonGroup,
  Button,
  Box,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import { Observer } from "mobx-react-lite";
import { IGBPlayer, IGBTeam } from "../models/Root";
import useLongPress from "../components/useLongPress";
import GBIcon from "./GBIcon";

type model = IGBPlayer;
type team = IGBTeam;

interface RosterListProps {
  teams: team[];
  onClick: (
    event: React.MouseEvent<HTMLElement>,
    model: model,
    index: number
  ) => void;
}

interface CounterProps {
  object: any;
  label: (o: any) => string;
  value: (o: any) => number;
  setValue: (o: any, v: number) => void;
}

function Counter({ object, label, value, setValue }: CounterProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px",
      }}
    >
      <Typography variant="body2">
        <Observer>{() => <span>{label(object)}</span>}</Observer>
      </Typography>
      <ButtonGroup size="small" variant="contained">
        <Button
          onClick={() => {
            const v = value(object);
            if (v > 0) {
              setValue(object, v - 1);
            }
          }}
        >
          <Typography
            component="span"
            variant="caption"
            sx={{ lineHeight: "1" }}
          >
            -
          </Typography>
        </Button>
        <Button
          onClick={() => {
            const v = value(object);
            setValue(object, v + 1);
          }}
        >
          <Typography
            component="span"
            variant="caption"
            sx={{ lineHeight: "1" }}
          >
            +
          </Typography>
        </Button>
      </ButtonGroup>
    </div>
  );
}

export function HealthCounter({ model }: { model: model }) {
  const longPressDown = useLongPress({
    onLongPress: (e) => model.setHealth(0),
    onClick: (e) => {
      if ((model.health ?? 0) > 0) {
        model.setHealth((model.health ?? 0) - 1);
      }
    },
  });
  const longPressUp = useLongPress({
    onLongPress: (e) => {
      if ((model.health ?? 0) < model.recovery) {
        model.setHealth(model.recovery);
      }
    },
    onClick: (e) => {
      if ((model.health ?? 0) < model.hp) {
        model.setHealth((model.health ?? 0) + 1);
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
      <Observer>
        {() => (
          <Typography variant="body2">
            {`${String(model.health).padStart(2, "0")} / ${String(
              model.hp
            ).padStart(2, "0")}`}
          </Typography>
        )}
      </Observer>
      <ButtonGroup size="small" variant="contained">
        <Button {...longPressDown} onClick={(e) => e.stopPropagation()}>
          <Typography
            component="span"
            variant="caption"
            sx={{
              lineHeight: "1",
              pointerEvents: "none",
            }}
          >
            -
          </Typography>
        </Button>
        <Button {...longPressUp} onClick={(e) => e.stopPropagation()}>
          <Typography
            component="span"
            variant="caption"
            sx={{
              lineHeight: "1",
              pointerEvents: "none",
            }}
          >
            +
          </Typography>
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default function RosterList({ teams, onClick }: RosterListProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      <List
        dense
        disablePadding
        style={{ width: "100%", maxHeight: "inherit" }}
      >
        {teams.map((team, index) => (
          <React.Fragment key={index}>
            <ListSubheader
              sx={{
                display: "flex",
                flexDirection: "row",
                // border: "1px solid white",
              }}
            >
              <ListItemIcon sx={{ alignItems: "center" }}>
                <GBIcon
                  icon={team.name}
                  size={40}
                  style={{ color: theme.palette.text.secondary }}
                />
              </ListItemIcon>
              <ListItemText
                primary={team.name}
                secondary={`${team.roster.reduce(
                  (acc, m) => acc + (m._inf ?? m.inf),
                  0
                )} INF`}
              />
              <Counter
                object={team}
                label={(t) => `VP: ${t.score}`}
                value={(t) => t.score}
                setValue={(t, v) => t.setScore(v)}
              />
              <Counter
                object={team}
                label={(t) => `MOM: ${t.momentum}`}
                value={(t) => t.momentum}
                setValue={(t, v) => t.setMomentum(v)}
              />
            </ListSubheader>
            <Divider />
            {team.roster.map((m: model, index: number) => (
              <ListItem
                key={m.id}
                secondaryAction={<HealthCounter model={m} />}
                onClick={(e) => onClick(e, m, index)}
              >
                <ListItemText primary={m.displayName} secondary={m.statLine} />
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
