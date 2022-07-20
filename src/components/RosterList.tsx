import React, { useState } from "react";
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
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import MinusIcon from "@mui/icons-material/Remove";
import PlusIcon from "@mui/icons-material/Add";
import { Observer } from "mobx-react-lite";
import { IGBPlayer, IGBTeam } from "../models/Root";
import useLongPress from "../components/useLongPress";
import GBIcon from "./GBIcon";

type model = IGBPlayer;
type team = IGBTeam;

interface RosterListProps {
  teams: team[];
  expanded: boolean;
  onClick: (
    // event: React.MouseEvent<HTMLElement>,
    // model: model,
    index: number,
    expand: boolean
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
      }}
    >
      <Typography variant="body2">
        <Observer>{() => <span>{label(object)}</span>}</Observer>
      </Typography>
      <ButtonGroup size="small" variant="contained">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            const v = value(object);
            if (v > 0) {
              setValue(object, v - 1);
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
          <MinusIcon fontSize="inherit" />
        </Button>
        <Button {...longPressUp} onClick={(e) => e.stopPropagation()}>
          <PlusIcon fontSize="inherit" />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default function RosterList({
  teams,
  expanded,
  onClick,
}: RosterListProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        flexGrow: 0,
        overflow: "auto",
      }}
    >
      {teams.map((team, index) => {
        const indexBase = teams
          .slice(0, index)
          .map((t) => t.roster.length)
          .reduce((acc, l) => acc + l, 0);
        return (
          <Accordion
            key={index}
            expanded={expanded === true}
            square
            sx={{
              backgroundColor: "transparent",
            }}
            disableGutters={true}
          >
            <AccordionSummary
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                padding: 0,
                borderBottom: `1px solid ${theme.palette.divider}`,
                "& .MuiAccordionSummary-content": {
                  margin: 0,
                },
              }}
            >
              <ListSubheader
                onClick={() => {
                  onClick(0, true);
                }}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <ListItemIcon sx={{ alignItems: "center" }}>
                  <GBIcon
                    icon={team.name}
                    size={36}
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
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "4px" }}
                >
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
                dense
                disablePadding
                style={{ width: "100%", maxHeight: "inherit" }}
              >
                {team.roster.map((m: model, index: number) => (
                  <ListItem
                    key={m.id}
                    secondaryAction={<HealthCounter model={m} />}
                    onClick={(e) => {
                      onClick(indexBase + index, false);
                    }}
                  >
                    <ListItemText
                      primary={m.displayName}
                      secondary={m.statLine}
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
