import React from "react";
import {
  ButtonGroup,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { AppBarContent } from "../App";
import { useData } from "../components/DataContext";
import "./print.css";

import { useState, useRef, useImperativeHandle } from "react";
import { useMutationObserverRef } from "rooks";

import { CardFront, GBCardCSS } from "../components/CardFront";
import { CardBack } from "../components/CardBack";
import GBIcon from "../components/GBIcon";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Box, Button, IconButton, Divider, Checkbox } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import SelectAllIcon from "@mui/icons-material/DoneAll";
import ClearAllIcon from "@mui/icons-material/RemoveDone";
import ClearIcon from "@mui/icons-material/Clear";

export const CardPrintScreen = () => {
  const { data } = useData();
  const ref = useRef<Map<any, any>>(null);
  const list = useRef<any>(null);

  if (!data) {
    return null;
  }
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <AppBarContent>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>Card Printer</Typography>
          <Tooltip title="Print" arrow>
            <IconButton
              size="small"
              onClick={() => {
                window.print();
              }}
            >
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </AppBarContent>

      <Box className="controls no-print" sx={{ p: "1rem" }}>
        <GuildList ref={list} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            my: "0.5rem",
          }}
        >
          <ButtonGroup variant="text" sx={{ mb: "0.5rem" }}>
            <Tooltip title="Select All" arrow>
              <Button
                onClick={() => {
                  if (!list.current.guild) {
                    return;
                  }
                  ref.current?.forEach((control: any) => {
                    if (
                      control.m.guild1 === list.current.guild ||
                      control.m.guild2 === list.current.guild
                    ) {
                      control?.setChecked(true);
                    }
                  });
                }}
              >
                <SelectAllIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Clear All" arrow>
              <Button
                onClick={() => {
                  ref.current?.forEach((control: any) => {
                    if (!list.current.guild) {
                      return;
                    }
                    if (
                      control.m.guild1 === list.current.guild ||
                      control.m.guild2 === list.current.guild
                    ) {
                      control?.setChecked(false);
                    }
                  });
                }}
              >
                <ClearAllIcon />
              </Button>
            </Tooltip>
          </ButtonGroup>
          <ModelLists ref={ref} />
        </Box>
        <Divider />
        <Box>
          <Button
            variant="text"
            color="primary"
            startIcon={<ClearIcon />}
            onClick={() => {
              ref.current?.forEach((control: any) => {
                control?.setChecked(false);
              });
            }}
          >
            Clear Cards
          </Button>
        </Box>
      </Box>

      <Box className="Cards">
        {data.Models.map((m: any) => (
          <Content name={m.id} id={m.id} key={m.id} />
        ))}
      </Box>
    </Box>
  );
};

const SelectGuild = (guild: any) => {
  const { name, minor } = guild;

  document
    .querySelectorAll(".model-checkbox")
    .forEach((m) => m.classList.add("hide"));

  let e = document.querySelector<HTMLElement>(".model-list-container");
  if (minor) {
    e?.style.setProperty("--major-order", "2");
    e?.style.setProperty("--minor-order", "0");
  } else {
    e?.style.setProperty("--major-order", "0");
    e?.style.setProperty("--minor-order", "2");
  }

  document
    .querySelectorAll(`.model-checkbox.${name}`)
    .forEach((m) => m.classList.remove("hide"));
};

const GuildList = React.forwardRef((props, ref) => {
  const [guild, setGuild] = React.useState<string | undefined>(undefined);

  useImperativeHandle(ref, () => ({ guild }), [guild]);

  const { data } = useData();
  if (!data) {
    return null;
  }

  const handleChange = (event: SelectChangeEvent<any>) => {
    setGuild(event.target.value.name);
    SelectGuild(event.target.value);
  };

  return (
    <FormControl size="small">
      <InputLabel>Guild</InputLabel>
      <Select label="Guild" onChange={handleChange}>
        {data.Guilds.map((g: any) => (
          <MenuItem key={g.name} value={g} dense>
            <GuildListItem g={g} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

const GuildListItem = ({ g }: { g: any }) => (
  <div
    className="guild"
    key={g.name}
    style={
      {
        "--guild-color": g.shadow ?? g.color,
        width: "100%",
        fontSize: "1rem",
      } as React.CSSProperties
    }
  >
    <span style={{ display: "inline-flex" }}>
      <div
        style={{
          backgroundColor: "black",
          fontSize: "2em",
          width: "1em",
          height: "1em",
          borderRadius: "1em",
          display: "flex",
          overflow: "visible",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GBIcon
          icon={g.name}
          style={{
            // FIXME, this is only working if the
            // svg doesn't have fill color
            color: g.darkColor ?? g.color,
            flexShrink: 0,
          }}
        />
      </div>
      <span
        style={{
          color: "white",
          alignSelf: "center",
          marginLeft: "1em",
          marginRight: "1em",
        }}
      >
        {g.name}
      </span>
    </span>
  </div>
);

const DisplayModel = (name: string) => {
  var card = document.querySelector(`.card#${name}`);
  card?.classList.toggle("hide");
  // var check = document.getElementById(name + "-check") as HTMLInputElement;
  // if (check?.checked === true) {
  //   card?.classList.remove("hide");
  // } else {
  //   card?.classList.add("hide");
  // }
};

const ModelCheckBox = React.forwardRef((props: { m: any }, ref) => {
  const { data } = useData();
  const [checked, setChecked] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      m: props.m,
      checked: checked,
      setChecked: (value: boolean) => {
        if (checked !== value) {
          setChecked(value);
          DisplayModel(props.m.id);
        }
      },
    }),
    [props.m, checked, setChecked]
  );

  if (!data) {
    return null;
  }
  const m = props.m;
  const guild1 = data.Guilds.find((g: any) => g.name === m.guild1);
  const guild2 = data.Guilds.find((g: any) => g.name === m.guild2);
  if (!guild1) {
    return null;
  }
  return (
    <FormControlLabel
      sx={{
        border: 1,
        borderRadius: 1,
        borderColor: "primary.main",
      }}
      control={<Checkbox checked={checked} size="small" color="warning" />}
      label={m.id}
      className={`model-checkbox ${m.guild1} ${m.guild2} ${m.id} hide ${
        guild1.minor ? "minor" : ""
      }`}
      style={
        {
          "--color1": guild1.shadow ?? guild1.color + "80",
          "--color2": guild2
            ? guild2.shadow ?? guild2.color + "80"
            : "var(--color1)",
          // backgroundColor: guild1.shadow ?? guild1.color + "80",
        } as React.CSSProperties
      }
      onChange={() => {
        setChecked(!checked);
        DisplayModel(m.id);
      }}
    />
  );
});

const ModelLists = React.forwardRef<Map<string, any>>((props, ref) => {
  const { data } = useData();
  const checkboxes = useRef(new Map());
  React.useImperativeHandle(ref, () => checkboxes.current, [checkboxes]);
  if (!data) {
    return null;
  }
  return (
    <Box
      className="model-list-container"
      style={
        {
          "--major-order": 0,
          "--minor-order": 2,
        } as React.CSSProperties
      }
    >
      {data.Models.map((m: any, index: number) => {
        return (
          <ModelCheckBox
            m={m}
            key={m.id}
            ref={(element) => checkboxes.current.set(m.id, element)}
          />
        );
      })}
    </Box>
  );
});

const Content = (props: { name: string; guild?: string; id: string }) => {
  const { name, id } = props;
  const { data } = useData();

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList, observer) => {
    if (mutationList && mutationList[0]) {
      let { target } = mutationList[0];
      let style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  if (!data) {
    return null;
  }
  const model = data.Models.find((m: any) => m.id === name);
  if (!model) {
    return null;
  }

  //   if (GBImages[`${model.id}_gbcp_front`]) {
  //     model.gbcp = true;
  //   }

  return (
    <div
      ref={ref}
      className={`card ${!inView ? "hide" : null}`}
      id={id}
      style={{
        position: "relative",
        width: "5in",
        height: "3.5in",
        display: "inline-flex",
        flexDirection: "row",
        gap: 0,
      }}
    >
      {inView && (
        <>
          <CardFront
            model={model as any}
            style={
              {
                width: "2.5in",
                borderRadius: 0,
                "--scale": "calc(2.5 * 96 / 500)",
              } as GBCardCSS
            }
          />
          <CardBack
            model={model as any}
            style={
              {
                width: "2.5in",
                borderRadius: 0,
                "--scale": "calc(2.5 * 96 / 500)",
              } as GBCardCSS
            }
          />
        </>
      )}
    </div>
  );
};
