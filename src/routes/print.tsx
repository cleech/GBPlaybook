import {
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  CSSProperties,
  useEffect,
  MouseEvent,
} from "react";
import {
  ButtonGroup,
  FormControlLabel,
  Menu,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { AppBarContent } from "../App";
import { useData } from "../hooks/useData";
import "./print.css";

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
import VersionTag from "../components/VersionTag";
import GBImages from "../utils/GBImages";
import { Gameplan, Guild } from "../components/DataContext.d";
import { GameplanFront, ReferenceCardFront } from "../components/Gameplan";
import { GBGuildDoc, GBModelDoc } from "../models/gbdb";
import { reSort } from "../utils/reSort";
import { useRxData } from "../hooks/useRxQuery";
import { Settings } from "@mui/icons-material";

const PrintSettings = (props: {
  withBleed: boolean;
  setBleed: (b: boolean) => void;
  doubleCard: boolean;
  setDouble: (b: boolean) => void;
  noFun: boolean;
  setNoFun: (b: boolean) => void;
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(menuAnchor);
  const settingsClick = (e: MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  };
  const settingsClose = () => {
    setMenuAnchor(null);
  };

  const [paged, setPaged] = useState(true);

  const { doubleCard, setDouble, withBleed, setBleed, noFun, setNoFun } = props;
  useEffect(() => {
    const size = doubleCard
      ? withBleed
        ? "5.24in 3.74in"
        : "5in 3.5in"
      : withBleed
      ? "2.74in 3.74in"
      : "2.5in 3.5in";
    const style = document.createElement("style");
    if (!paged) {
      style.innerHTML = `
      @media print {
        @page {        
          size: ${size};
          margin: 0;
        }
        .Cards > .card {
          margin: 0;
        }
      }
      `;
    }
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [doubleCard, withBleed, paged]);

  return (
    <>
      <Tooltip title="Print Settings" arrow>
        <IconButton size="small" onClick={settingsClick}>
          <Settings />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={settingsOpen}
        onClose={settingsClose}
        // onClick={settingsClose}
      >
        <Stack margin={2}>
          <FormControlLabel
            label="Double Wide Cards"
            control={
              <Checkbox
                checked={doubleCard}
                onChange={() => setDouble(!doubleCard)}
              />
            }
          />
          <FormControlLabel
            label="With Print Bleed"
            control={
              <Checkbox
                checked={withBleed}
                onChange={() => setBleed(!withBleed)}
              />
            }
          />
          <FormControlLabel
            label="Set Page to Card Size"
            control={
              <Checkbox checked={!paged} onChange={() => setPaged(!paged)} />
            }
          />
          <FormControlLabel
            label="Ignore Special Themes"
            control={
              <Checkbox checked={noFun} onChange={() => setNoFun(!noFun)} />
            }
          />
        </Stack>
      </Menu>
    </>
  );
};

export const CardPrintScreen = () => {
  const { gbdb: db, gameplans } = useData();
  const ref = useRef<{
    models: Map<string, ModelCheckBoxRef>;
    guilds: Map<string, GuildCheckBoxRef>;
    gameplans: Map<string, GameplanCheckBoxRef>;
    refcards: Map<string, RefCardCheckBoxRef>;
  }>(null);
  const list = useRef<GuildListRef>();

  const [Guilds, setGuilds] = useState<string[]>();
  const [Models, setModels] = useState<string[]>();

  const [doubleCard, setDouble] = useState(true);

  const [withBleed, setBleed] = useState(false);

  const [noFun, setNoFun] = useState(false);

  useEffect(() => {
    if (!db) {
      return;
    }
    const fetchData = async () => {
      /* This is crazy, but gets all the models in a very particular order */
      const [g, m]: [GBGuildDoc[], GBModelDoc[]] = await Promise.all([
        db.guilds.find().where({ minor: false }).exec(),
        db.guilds.find().where({ minor: true }).exec(),
      ])
        .then(async ([_majors, _minors]) => {
          return Promise.all([
            _majors,
            db.models
              .find()
              .where("guild1")
              .in(_majors.map((g) => g.name))
              .exec(),
            _minors,
            db.models
              .find()
              .where("guild1")
              .in(_minors.map((g) => g.name))
              .exec(),
          ]);
        })
        .then(([_majors, _majorMs, _minors, _minorMs]) => {
          reSort(
            _majorMs,
            "id",
            _majors.flatMap((_g) => _g.roster)
          );
          reSort(
            _minorMs,
            "id",
            _minors.flatMap((_g) => _g.roster)
          );
          return [_majors.concat(_minors), _majorMs.concat(_minorMs)];
        });

      setGuilds(g.map((_g) => _g.name));
      setModels(m.map((_m) => _m.id));
    };
    fetchData().catch(console.error);
  }, [db]);

  if (!Guilds || !Models) {
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
          <Box>
            <PrintSettings
              withBleed={withBleed}
              setBleed={setBleed}
              doubleCard={doubleCard}
              setDouble={setDouble}
              noFun={noFun}
              setNoFun={setNoFun}
            />
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
          <Box sx={{ position: "relative" }}>
            <ButtonGroup variant="text" sx={{ mb: "0.5rem" }}>
              <Tooltip title="Select All" arrow>
                <Button
                  onClick={() => {
                    if (!list.current?.guild) {
                      return;
                    }
                    ref.current?.guilds
                      .get(list.current.guild)
                      ?.setChecked(true);
                    ref.current?.models.forEach((control) => {
                      if (!list.current?.guild) {
                        return;
                      }
                      if (
                        control.m.guild1 === list.current.guild ||
                        control.m.guild2 === list.current.guild
                      ) {
                        control.setChecked(true);
                      }
                    });

                    if (list.current.guild === "gameplans") {
                      ref.current?.gameplans.forEach((control) => {
                        control.setChecked(true);
                      });
                    }
                    if (list.current.guild === "refcards") {
                      ref.current?.refcards.forEach((control) => {
                        control.setChecked(true);
                      });
                    }
                  }}
                >
                  <SelectAllIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Clear All" arrow>
                <Button
                  onClick={() => {
                    if (!list.current?.guild) {
                      return;
                    }
                    ref.current?.guilds
                      .get(list.current.guild)
                      ?.setChecked(false);
                    ref.current?.models.forEach((control) => {
                      if (!list.current?.guild) {
                        return;
                      }
                      if (
                        control.m.guild1 === list.current.guild ||
                        control.m.guild2 === list.current.guild
                      ) {
                        control.setChecked(false);
                      }
                    });
                    if (list.current.guild === "gameplans") {
                      ref.current?.gameplans.forEach((control) => {
                        control.setChecked(false);
                      });
                    }
                    if (list.current.guild === "refcards") {
                      ref.current?.refcards.forEach((control) => {
                        control.setChecked(false);
                      });
                    }
                  }}
                >
                  <ClearAllIcon />
                </Button>
              </Tooltip>
            </ButtonGroup>
            <VersionTag />
          </Box>
          <ModelLists ref={ref} />
        </Box>
        <Divider />
        <Box>
          <Button
            variant="text"
            color="primary"
            startIcon={<ClearIcon />}
            onClick={() => {
              ref.current?.guilds.forEach((control) => {
                control.setChecked(false);
              });
              ref.current?.models.forEach((control) => {
                control.setChecked(false);
              });
              ref.current?.gameplans.forEach((control) => {
                control.setChecked(false);
              });
              ref.current?.refcards.forEach((control) => {
                control.setChecked(false);
              });
            }}
          >
            Clear Cards
          </Button>
        </Box>
      </Box>

      <Box className="Cards">
        {Guilds.map((g) => (
          <GuildCard
            name={g}
            key={g}
            bleed={withBleed}
            doubleCard={doubleCard}
          />
        ))}
        {Models.map((m) => (
          <ModelCard
            name={m}
            id={m}
            key={m}
            bleed={withBleed}
            noFun={noFun}
            doubleCard={doubleCard}
          />
        ))}
        {gameplans?.map((gp: Gameplan, index) => (
          <GameplanPrintCard
            gameplan={gp}
            key={`gameplan-${index}`}
            bleed={withBleed}
          />
        ))}
        {gameplans?.map((gp: Gameplan, index) => (
          <RefcardPrintCard
            index={index}
            key={`refcard-${index}`}
            bleed={withBleed}
          />
        ))}
      </Box>
    </Box>
  );
};

interface GuildListRef {
  guild: string | undefined;
}

const GuildList = forwardRef((props, ref) => {
  const [guild, setGuild] = useState<string | undefined>(undefined);

  useImperativeHandle(ref, () => ({ guild }), [guild]);

  const Guilds = useRxData((db) => db.guilds.find().exec());

  const SelectGuild = useCallback(
    (name: string) => {
      if (!Guilds) {
        return;
      }
      document
        .querySelectorAll(".model-checkbox")
        .forEach((m) => m.classList.add("hide"));

      const guild = Guilds.find((g) => g.name === name);
      if (guild) {
        const { minor } = guild;

        const e = document.querySelector<HTMLElement>(".model-list-container");
        if (minor) {
          e?.style.setProperty("--major-order", "2");
          e?.style.setProperty("--minor-order", "0");
        } else {
          e?.style.setProperty("--major-order", "0");
          e?.style.setProperty("--minor-order", "2");
        }
      }

      document
        .querySelectorAll(`.model-checkbox.${name}`)
        .forEach((m) => m.classList.remove("hide"));
    },
    [Guilds]
  );
  const handleChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setGuild(event.target.value);
      SelectGuild(event.target.value);
    },
    [SelectGuild]
  );

  if (!Guilds) {
    return;
  }

  return (
    <FormControl size="small">
      <InputLabel>Guild</InputLabel>
      <Select label="Guild" onChange={handleChange} defaultValue="">
        <MenuItem key="redcards" value="refcards" dense>
          <ListItemBanner
            text="Rules Reference Cards"
            icon="GB"
            style={{ "--color": "#333333" }}
          />
        </MenuItem>
        <MenuItem key="gameplans" value="gameplans" dense>
          <ListItemBanner
            text="Gameplans"
            icon="GB"
            style={{ "--color": "#333333" }}
          />
        </MenuItem>
        {Guilds.map((g) => (
          <MenuItem key={g.name} value={g.name} dense>
            <GuildListItem g={g} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

const GuildListItem = ({ g }: { g: Guild }) => (
  <ListItemBanner
    text={g.name}
    icon={g.name}
    style={{ "--color": g.shadow ?? g.color }}
  />
);

interface ListCSS extends CSSProperties {
  "--color": string;
}

const ListItemBanner = ({
  text,
  icon,
  style,
}: {
  text: string;
  icon: string;
  style?: ListCSS;
}) => (
  <div
    className="guild"
    key={text}
    style={
      {
        // "--color": g.shadow ?? g.color,
        width: "100%",
        fontSize: "1rem",
        ...style,
      } as CSSProperties
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
          icon={icon}
          className="dark"
          style={{
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
        {text}
      </span>
    </span>
  </div>
);

const DisplayModel = (name: string) => {
  document
    .querySelectorAll(`.card#${name}`)
    .forEach((card) => card?.classList.toggle("hide"));
};

interface CheckBoxRef {
  checked: boolean;
  setChecked: (v: boolean) => void;
}

interface GuildCheckBoxRef extends CheckBoxRef {
  g: Guild;
}

const GuildCheckBox = forwardRef<GuildCheckBoxRef, { g: Guild }>(
  (props, ref) => {
    const [checked, setChecked] = useState(false);
    const g = props.g;
    useImperativeHandle(
      ref,
      () => ({
        g: props.g,
        checked: checked,
        setChecked: (value: boolean) => {
          if (checked !== value) {
            setChecked(value);
            DisplayModel(props.g.name);
          }
        },
      }),
      [props.g, checked, setChecked]
    );
    return (
      <FormControlLabel
        sx={{
          border: 1,
          borderRadius: 1,
          borderColor: "primary.main",
        }}
        control={<Checkbox checked={checked} size="small" color="warning" />}
        label={g.name}
        className={`model-checkbox ${g.name} hide ${g.minor ? "minor" : ""}`}
        style={
          {
            "--color1": g.shadow ?? g.color + "80",
            "--color2": "var(--color1)",
          } as CSSProperties
        }
        onChange={() => {
          setChecked(!checked);
          DisplayModel(g.name);
        }}
      />
    );
  }
);

interface ModelCheckBoxRef extends CheckBoxRef {
  m: GBModelDoc;
}

const ModelCheckBox = forwardRef<ModelCheckBoxRef, { m: GBModelDoc }>(
  (props, ref) => {
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

    const m = props.m;

    const [guild1, guild2] =
      useRxData(
        async (db) =>
          Promise.all([
            db.guilds.findOne().where({ name: m.guild1 }).exec(),
            m.guild2
              ? db.guilds.findOne().where({ name: m.guild2 }).exec()
              : null,
          ]),
        [m.guild1, m.guild2]
      ) ?? [];

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
          } as CSSProperties
        }
        onChange={() => {
          setChecked(!checked);
          DisplayModel(m.id);
        }}
      />
    );
  }
);

interface GameplanCheckBoxRef extends CheckBoxRef {
  g: Gameplan;
}

const GameplanCheckBox = forwardRef<GameplanCheckBoxRef, { g: Gameplan }>(
  (props, ref) => {
    const [checked, setChecked] = useState(false);
    const g = props.g;
    useImperativeHandle(
      ref,
      () => ({
        g: props.g,
        checked: checked,
        setChecked: (value: boolean) => {
          if (checked !== value) {
            setChecked(value);
            DisplayModel(props.g.title.replace(/[^a-zA-Z0-9]+/g, ""));
          }
        },
      }),
      [props.g, checked, setChecked]
    );
    return (
      <FormControlLabel
        sx={{
          border: 1,
          borderRadius: 1,
          borderColor: "primary.main",
        }}
        control={<Checkbox checked={checked} size="small" color="warning" />}
        label={g.title}
        className={`model-checkbox gameplans ${g.title.replace(
          /[^a-zA-Z0-9]/g,
          ""
        )} hide`}
        style={
          {
            "--color1": "#333333",
            "--color2": "var(--color1)",
          } as CSSProperties
        }
        onChange={() => {
          setChecked(!checked);
          DisplayModel(props.g.title.replace(/[^a-zA-Z0-9]+/g, ""));
        }}
      />
    );
  }
);

interface RefCardCheckBoxRef extends CheckBoxRef {
  id: number;
}

const RefCardCheckBox = forwardRef<RefCardCheckBoxRef, { id: number }>(
  (props, ref) => {
    const [checked, setChecked] = useState(false);

    const titles = [
      "Playbook Results",
      "Turn Sequence",
      "Conditions",
      "Spending Momentum",
      "Actions",
    ];

    useImperativeHandle(
      ref,
      () => ({
        id: props.id,
        checked: checked,
        setChecked: (value: boolean) => {
          if (checked !== value) {
            setChecked(value);
            DisplayModel(`refcard-${props.id}`);
          }
        },
      }),
      [props.id, checked, setChecked]
    );
    return (
      <FormControlLabel
        sx={{
          border: 1,
          borderRadius: 1,
          borderColor: "primary.main",
        }}
        control={<Checkbox checked={checked} size="small" color="warning" />}
        label={titles[props.id]}
        className={`model-checkbox refcards refcard-${props.id} hide`}
        style={
          {
            "--color1": "#333333",
            "--color2": "var(--color1)",
          } as CSSProperties
        }
        onChange={() => {
          setChecked(!checked);
          DisplayModel(`refcard-${props.id}`);
        }}
      />
    );
  }
);

const ModelLists = forwardRef<{
  models: Map<string, ModelCheckBoxRef>;
  guilds: Map<string, GuildCheckBoxRef>;
  gameplans: Map<string, GameplanCheckBoxRef>;
  refcards: Map<string, RefCardCheckBoxRef>;
}>((props, ref) => {
  const { gbdb: db, gameplans } = useData();
  const checkboxes = useRef(new Map<string, ModelCheckBoxRef>());
  const guilds = useRef(new Map<string, GuildCheckBoxRef>());
  const gps = useRef(new Map<string, GameplanCheckBoxRef>());
  const refcards = useRef(new Map<string, RefCardCheckBoxRef>());
  useImperativeHandle(
    ref,
    () => ({
      models: checkboxes.current,
      guilds: guilds.current,
      gameplans: gps.current,
      refcards: refcards.current,
    }),
    [checkboxes, guilds, gps]
  );

  const [Guilds, setGuilds] = useState<GBGuildDoc[]>();
  const [Models, setModels] = useState<GBModelDoc[]>();
  useEffect(() => {
    const fetchData = async () => {
      if (!db) {
        return;
      }

      /* This is crazy, but gets all the models in a very particular order */
      const [guilds, models]: [GBGuildDoc[], GBModelDoc[]] = await Promise.all([
        db.guilds.find().where({ minor: false }).exec(),
        db.guilds.find().where({ minor: true }).exec(),
      ])
        .then(async ([_majors, _minors]) => {
          return Promise.all([
            _majors,
            db.models
              .find()
              .where("guild1")
              .in(_majors.map((g) => g.name))
              .exec(),
            _minors,
            db.models
              .find()
              .where("guild1")
              .in(_minors.map((g) => g.name))
              .exec(),
          ]);
        })
        .then(([_majors, _majorMs, _minors, _minorMs]) => {
          reSort(
            _majorMs,
            "id",
            _majors.flatMap((_g) => _g.roster)
          );
          reSort(
            _minorMs,
            "id",
            _minors.flatMap((_g) => _g.roster)
          );
          return [_majors.concat(_minors), _majorMs.concat(_minorMs)];
        });

      setGuilds(guilds);
      setModels(models);
    };
    fetchData().catch(console.error);
  }, [db]);

  if (!gameplans || !Guilds || !Models) {
    return null;
  }

  return (
    <Box
      className="model-list-container"
      style={
        {
          "--major-order": 0,
          "--minor-order": 2,
        } as CSSProperties
      }
    >
      {gameplans.map((gp: Gameplan) => (
        <GameplanCheckBox
          g={gp}
          key={gp.title}
          ref={(element) => {
            if (element) {
              gps.current.set(gp.title, element);
            } else {
              gps.current.delete(gp.title);
            }
          }}
        />
      ))}
      {[
        "Playbook Results",
        "Turn Sequence",
        "Conditions",
        "Spending Momentum",
        "Actions",
      ].map((title, index) => (
        <RefCardCheckBox
          id={index}
          key={`refcard-${index}`}
          ref={(element) => {
            if (element) {
              refcards.current.set(title, element);
            } else {
              refcards.current.delete(title);
            }
          }}
        />
      ))}
      {Guilds.map((g) => (
        <GuildCheckBox
          g={g}
          key={g.name}
          ref={(element) => {
            if (element) {
              guilds.current.set(g.name, element);
            } else {
              guilds.current.delete(g.name);
            }
          }}
        />
      ))}
      {Models.map((m) => (
        <ModelCheckBox
          m={m}
          key={m.id}
          ref={(element) => {
            if (element) {
              checkboxes.current.set(m.id, element);
            } else {
              checkboxes.current.delete(m.id);
            }
          }}
        />
      ))}
    </Box>
  );
});

const ModelCard = (props: {
  name: string;
  guild?: string;
  id: string;
  bleed: boolean;
  doubleCard: boolean;
  noFun: boolean;
}) => {
  const { name, id, bleed, doubleCard, noFun } = props;
  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList) => {
    if (mutationList && mutationList[0]) {
      const { target } = mutationList[0];
      const style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  const model = useRxData(
    async (db) => {
      const _model = await db.models.findOne().where({ id: name }).exec();
      return _model?.expand();
    },
    [name]
  );

  if (!model) {
    return null;
  }

  //   if (GBImages[`${model.id}_gbcp_front`]) {
  //     model.gbcp = true;
  //   }

  const width = bleed ? "5.24in" : "5in";
  const singleWidth = bleed ? "2.74in" : "2.5in";
  const height = bleed ? "3.74in" : "3.5in";

  return doubleCard ? (
    <div
      ref={ref}
      className={`card ${!inView ? "hide" : ""}`}
      id={id}
      style={{
        position: "relative",
        width: width,
        height: height,
        display: "inline-flex",
        flexDirection: "row",
        gap: 0,
      }}
    >
      {inView && (
        <>
          <CardFront
            className={`card-front double ${bleed ? "bleed" : ""} ${noFun ? "nofun" : ""}`}
            model={model}
            style={
              {
                width: width,
                borderRadius: 0,
                "--scale": "calc(2.5 * 96 / 500)",
                // "--scale": "calc((7/3) * 96 / 500)",
              } as GBCardCSS
            }
          />
          <CardBack
            className={`card-back print double ${bleed ? "bleed" : ""} ${noFun ? "noFun" : ""}`}
            model={model}
            style={
              {
                width: width,
                borderRadius: 0,
                "--scale": "calc(2.5 * (96 / 500))",
                // "--scale": "calc((7/3) * 96 / 500)",
              } as GBCardCSS
            }
          />
        </>
      )}
    </div>
  ) : (
    <>
      <div
        ref={ref}
        className={`card ${!inView ? "hide" : ""}`}
        id={id}
        style={{
          position: "relative",
          width: singleWidth,
          height: height,
          display: "inline-flex",
          flexDirection: "row",
          gap: 0,
        }}
      >
        {inView && (
          <CardFront
            className={`card-front print ${bleed ? "bleed" : ""} ${noFun ? "nofun" : ""}`}
            model={model}
            style={
              {
                width: singleWidth,
                borderRadius: 0,
                "--scale": "calc(2.5 * 96 / 500)",
                // "--scale": "calc((7/3) * 96 / 500)",
              } as GBCardCSS
            }
          />
        )}
      </div>
      <div
        ref={ref}
        className={`card ${!inView ? "hide" : ""}`}
        id={id}
        style={{
          position: "relative",
          width: singleWidth,
          height: height,
          display: "inline-flex",
          flexDirection: "row",
          gap: 0,
        }}
      >
        {inView && (
          <CardBack
            className={`card-back print ${bleed ? "bleed" : ""} ${noFun ? "nofun" : ""}`}
            model={model}
            style={
              {
                width: singleWidth,
                borderRadius: 0,
                "--scale": "calc(2.5 * (96 / 500))",
                // "--scale": "calc((7/3) * 96 / 500)",
              } as GBCardCSS
            }
          />
        )}
      </div>
    </>
  );
};

const GuildCard = (props: {
  name: string;
  bleed: boolean;
  doubleCard: boolean;
}) => {
  const { name, bleed, doubleCard } = props;

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList) => {
    if (mutationList && mutationList[0]) {
      const { target } = mutationList[0];
      const style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  const width = bleed ? "5.24in" : "5in";
  const height = bleed ? "3.74in" : "3.5in";
  const singleWidth = bleed ? "2.74in" : "2.5in";

  return doubleCard ? (
    <div
      ref={ref}
      className={`card ${!inView ? "hide" : ""}`}
      id={name}
      style={{
        position: "relative",
        width: width,
        height: height,
        display: "inline-flex",
        flexDirection: "row",
        gap: 0,
      }}
    >
      {inView && (
        <>
          <div
            className={`card-front double ${bleed ? "bleed" : ""}`}
            style={
              {
                backgroundImage: `url(${GBImages.get(`${name}_front`)})`,
                width: width,
                borderRadius: 0,
                // "--scale": "calc(2.5 * 96 / 500)",
              } as GBCardCSS
            }
          />
          <div
            className={`card-back double ${bleed ? "bleed" : ""}`}
            style={
              {
                backgroundImage: `url(${GBImages.get(`${name}_back`)})`,
                width: width,
                borderRadius: 0,
                // "--scale": "calc(2.5 * 96 / 500)",
              } as GBCardCSS
            }
          />
        </>
      )}
    </div>
  ) : (
    <>
      <div
        ref={ref}
        className={`card ${!inView ? "hide" : ""}`}
        id={name}
        style={{
          position: "relative",
          width: singleWidth,
          height: height,
          display: "inline-flex",
          flexDirection: "row",
          gap: 0,
        }}
      >
        {inView && (
          <>
            <div
              className={`card-front ${bleed ? "bleed" : ""}`}
              style={
                {
                  backgroundImage: `url(${GBImages.get(`${name}_front`)})`,
                  width: singleWidth,
                  borderRadius: 0,
                } as GBCardCSS
              }
            />
          </>
        )}
      </div>
      <div
        ref={ref}
        className={`card ${!inView ? "hide" : ""}`}
        id={name}
        style={{
          position: "relative",
          width: singleWidth,
          height: height,
          display: "inline-flex",
          flexDirection: "row",
          gap: 0,
        }}
      >
        {inView && (
          <>
            <div
              className={`card-back ${bleed ? "bleed" : ""}`}
              style={
                {
                  backgroundImage: `url(${GBImages.get(`${name}_back`)})`,
                  width: singleWidth,
                  borderRadius: 0,
                } as GBCardCSS
              }
            />
          </>
        )}
      </div>
    </>
  );
};

const GameplanPrintCard = (props: { gameplan: Gameplan; bleed: boolean }) => {
  const { gameplan, bleed } = props;

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList) => {
    if (mutationList && mutationList[0]) {
      const { target } = mutationList[0];
      const style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  const width = bleed ? "2.74in" : "2.5in";
  const height = bleed ? "3.74in" : "3.5in";

  return (
    <div
      ref={ref}
      className={`card ${!inView ? "hide" : ""}`}
      id={gameplan.title.replace(/[^A-Za-z0-9]+/g, "")}
      style={{
        position: "relative",
        width: width,
        height: height,
        display: "inline-flex",
        flexDirection: "row",
        gap: 0,
      }}
    >
      {inView && (
        <div
          className={`card-front ${bleed ? "bleed" : ""}`}
          style={
            {
              // backgroundImage: `url(${GBImages.get(`${name}_front`)})`,
              height: height,
              width: width,
              borderRadius: 0,
              "--scale": "calc(2.5 * 96 / 500)",
            } as GBCardCSS
          }
        >
          <GameplanFront
            gameplan={gameplan}
            style={{ borderRadius: 0 }}
            bleed={bleed}
          />
        </div>
      )}
    </div>
  );
};

const RefcardPrintCard = (props: { index: number; bleed: boolean }) => {
  const { index, bleed } = props;

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList) => {
    if (mutationList && mutationList[0]) {
      const { target } = mutationList[0];
      const style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  const width = bleed ? "2.74in" : "2.5in";
  const height = bleed ? "3.74in" : "3.5in";

  return (
    <div
      ref={ref}
      className={`card ${!inView ? "hide" : ""}`}
      id={`refcard-${index}`}
      style={{
        position: "relative",
        width: width,
        height: height,
        display: "inline-flex",
        flexDirection: "row",
        gap: 0,
      }}
    >
      {inView && (
        // <div
        //   className="card-front"
        //   style={
        //     {
        //       // backgroundImage: `url(${GBImages.get(`${name}_front`)})`,
        //       borderRadius: 0,
        //       "--scale": "calc(2.5 * 96 / 500)",
        //     } as GBCardCSS
        //   }
        // >
        <ReferenceCardFront
          index={index + 1}
          style={{ borderRadius: 0 }}
          bleed={bleed}
        />
        // </div>
      )}
    </div>
  );
};
