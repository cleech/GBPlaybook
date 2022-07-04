import {
  List,
  ListSubheader,
  ListItemIcon,
  ListItem,
  ListItemText,
  ButtonGroup,
  Button,
  Box,
} from "@mui/material";
// import { model, roster } from "./Draft";
import { IGBPlayer, IGBTeam } from "../models/Root";
import GBIcon from "./GBIcon";
import { observer, Observer } from "mobx-react-lite";
import useLongPress from "../components/useLongPress";
import React from "react";

type model = IGBPlayer;
type team = IGBTeam;
type roster = model[];

interface RosterListProps {
  teams: team[];
  onClick: (event: React.MouseEvent<HTMLElement>, model: model) => void;
}

interface CounterProps {
  label: string;
  value: number;
  setValue: (v: number) => void;
}

function Counter({ label, value, setValue }: CounterProps) {
  return (
    <div>
      <span>{`${label}: ${value}`}</span>
      <ButtonGroup size="small" variant="contained">
        <Button
          size="small"
          onClick={() => {
            if (value > 0) {
              setValue(value - 1);
            }
          }}
        >
          -
        </Button>
        <Button size="small" onClick={() => setValue(value + 1)}>
          +
        </Button>
      </ButtonGroup>
    </div>
  );
}

export function HealthCounter({ model }: { model: model }) {
  const longPressDown = useLongPress({
    onLongPress: (e) => model.setHealth(0),
    onClick: (e) => {
      if (typeof model.health !== "undefined" && model.health > 0) {
        model.setHealth(model.health - 1);
      }
    },
  });
  const longPressUp = useLongPress({
    onLongPress: (e) => {
      if (
        typeof model.health !== "undefined" &&
        model.health < model.recovery
      ) {
        model.setHealth(model.recovery);
      }
    },
    onClick: (e) => {
      if (typeof model.health !== "undefined" && model.health < model.hp) {
        model.setHealth(model.health + 1);
      }
    },
  });
  return (
    <Observer>
      {() => (
        <div>
          <ListItemText
            primary={`${String(model.health).padStart(2, "0")} / ${String(
              model.hp
            ).padStart(2, "0")}`}
          />
          <ButtonGroup size="small" variant="contained">
            <Button
              size="small"
              {...longPressDown}
              onClick={(e) => e.stopPropagation()}
            >
              -
            </Button>
            <Button
              size="small"
              {...longPressUp}
              onClick={(e) => e.stopPropagation()}
            >
              +
            </Button>
          </ButtonGroup>
        </div>
      )}
    </Observer>
  );
}

export default function RosterList({ teams, onClick }: RosterListProps) {
  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      <List dense={true} style={{ width: "100%", maxHeight: "inherit" }}>
        {teams.map((team, index) => (
          <React.Fragment key={index}>
            <ListSubheader
              sx={{
                display: "flex",
                flexDirection: "row",
                border: "1px solid white",
              }}
            >
              <ListItemIcon>
                <GBIcon icon={team.name} size={34} />
              </ListItemIcon>
              <ListItemText
                primary={team.name}
                secondary={`${team.roster.reduce(
                  (acc, m) => acc + (m._inf ?? m.inf),
                  0
                )} INF`}
              />
              <Observer>
                {() => (
                  <>
                    <Counter
                      label="VP"
                      value={team.score}
                      setValue={team.setScore}
                    />
                    <Counter
                      label="MOM"
                      value={team.momentum}
                      setValue={team.setMomentum}
                    />
                  </>
                )}
              </Observer>
            </ListSubheader>
            {team.roster.map((m: model) => (
              <ListItem
                key={m.name}
                secondaryAction={<HealthCounter model={m} />}
                onClick={(e) => onClick(e, m)}
              >
                <ListItemText primary={m.name} secondary="statline" />
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
