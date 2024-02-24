import {
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  CSSProperties,
  useEffect,
} from "react";
import {
  ButtonGroup,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { AppBarContent } from "../App";
import { useData } from "../components/DataContext";
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
import GBImages from "../components/GBImages";
import { Gameplan, Guild } from "../components/DataContext.d";
import { GameplanFront, ReferenceCardFront } from "../components/Gameplan";
import { GBGuildDoc, GBModelDoc, GBModelExpanded } from "../models/gbdb";
import { reSort } from "../components/reSort";

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
    fetchData();
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
          <GuildCard name={g} key={g} />
        ))}
        {Models.map((m) => (
          <ModelCard name={m} id={m} key={m} />
        ))}
        {gameplans?.map((gp: Gameplan, index) => (
          <GameplanPrintCard gameplan={gp} key={`gameplan-${index}`} />
        ))}
        {gameplans?.map((gp: Gameplan, index) => (
          <RefcardPrintCard index={index} key={`refcard-${index}`} />
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

  const { gbdb: db } = useData();

  const [Guilds, setGuilds] = useState<GBGuildDoc[]>();

  useEffect(() => {
    const fetchData = async () => {
      if (!db) {
        return;
      }
      const guilds = await db.guilds.find().exec();
      setGuilds(guilds);
    };
    fetchData();
  }, [db]);

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
  const card = document.querySelector(`.card#${name}`);
  card?.classList.toggle("hide");
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
    const { gbdb: db } = useData();
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
    const [guild1, setGuild1] = useState<GBGuildDoc | null>(null);
    const [guild2, setGuild2] = useState<GBGuildDoc | null>(null);

    useEffect(() => {
      let cancled = false;
      if (!db) {
        return;
      }
      const fetchData = async () => {
        const [guild1, guild2] = await Promise.all([
          db.guilds.findOne().where({ name: m.guild1 }).exec(),
          m.guild2
            ? db.guilds.findOne().where({ name: m.guild2 }).exec()
            : null,
        ]);
        if (!cancled) {
          setGuild1(guild1);
          setGuild2(guild2);
        }
      };
      fetchData();
      return () => {
        cancled = true;
      };
    }, [db, m]);

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
    fetchData();
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

const ModelCard = (props: { name: string; guild?: string; id: string }) => {
  const { name, id } = props;
  const { gbdb: db } = useData();

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList) => {
    if (mutationList && mutationList[0]) {
      const { target } = mutationList[0];
      const style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  const [model, setModel] = useState<GBModelExpanded>();
  useEffect(() => {
    const fetchData = async () => {
      if (!db) {
        return;
      }
      const _model = await db.models.findOne().where({ id: name }).exec();
      setModel(await _model?.expand());
    };
    fetchData();
  }, [db, name]);

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
            model={model}
            style={
              {
                width: "2.5in",
                borderRadius: 0,
                "--scale": "calc(2.5 * 96 / 500)",
              } as GBCardCSS
            }
          />
          <CardBack
            model={model}
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

const GuildCard = (props: { name: string }) => {
  const { name } = props;

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList) => {
    if (mutationList && mutationList[0]) {
      const { target } = mutationList[0];
      const style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  return (
    <div
      ref={ref}
      className={`card ${!inView ? "hide" : null}`}
      id={name}
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
          <div
            className="card-front"
            style={
              {
                backgroundImage: `url(${GBImages.get(`${name}_front`)})`,
                width: "2.5in",
                borderRadius: 0,
                // "--scale": "calc(2.5 * 96 / 500)",
              } as GBCardCSS
            }
          />
          <div
            className="card-back"
            style={
              {
                backgroundImage: `url(${GBImages.get(`${name}_back`)})`,
                width: "2.5in",
                borderRadius: 0,
                // "--scale": "calc(2.5 * 96 / 500)",
              } as GBCardCSS
            }
          />
        </>
      )}
    </div>
  );
};

const GameplanPrintCard = (props: { gameplan: Gameplan }) => {
  const { gameplan } = props;

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList) => {
    if (mutationList && mutationList[0]) {
      const { target } = mutationList[0];
      const style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  return (
    <div
      ref={ref}
      className={`card ${!inView ? "hide" : null}`}
      id={gameplan.title.replace(/[^A-Za-z0-9]+/g, "")}
      style={{
        position: "relative",
        width: "2.5in",
        height: "3.5in",
        display: "inline-flex",
        flexDirection: "row",
        gap: 0,
      }}
    >
      {inView && (
        <div
          className="card-front"
          style={
            {
              // backgroundImage: `url(${GBImages.get(`${name}_front`)})`,
              width: "2.5in",
              borderRadius: 0,
              "--scale": "calc(2.5 * 96 / 500)",
            } as GBCardCSS
          }
        >
          <GameplanFront gameplan={gameplan} style={{ borderRadius: 0 }} />
        </div>
      )}
    </div>
  );
};

const RefcardPrintCard = (props: { index: number }) => {
  const { index } = props;

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList) => {
    if (mutationList && mutationList[0]) {
      const { target } = mutationList[0];
      const style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  return (
    <div
      ref={ref}
      className={`card ${!inView ? "hide" : null}`}
      id={`refcard-${index}`}
      style={{
        position: "relative",
        width: "2.5in",
        height: "3.5in",
        display: "inline-flex",
        flexDirection: "row",
        gap: 0,
      }}
    >
      {inView && (
        <div
          className="card-front"
          style={
            {
              // backgroundImage: `url(${GBImages.get(`${name}_front`)})`,
              width: "2.5in",
              borderRadius: 0,
              "--scale": "calc(2.5 * 96 / 500)",
            } as GBCardCSS
          }
        >
          <ReferenceCardFront index={index + 1} style={{ borderRadius: 0 }} />
        </div>
      )}
    </div>
  );
};
