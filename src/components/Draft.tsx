import React, {
  useState,
  useEffect,
  CSSProperties,
  useImperativeHandle,
  useCallback,
} from "react";
import { IGBPlayer, useStore } from "../models/Root";
import { useData } from "../components/DataContext";
import cloneDeep from "lodash.clonedeep";
import { Badge, Card, Checkbox, FormControlLabel } from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { CheckCircleTwoTone as Check } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useUpdateAnimation } from "./useUpdateAnimation";
import { observer } from "mobx-react-lite";
import { GBGuildDoc, GBModelDoc, GBModel } from "../models/gbdb";
import { reSort } from "./reSort";

// import { Guild } from './DataContext.d';

export interface model extends IGBPlayer {
  selected: boolean;
  disabled: number;
  // health: number;
  // _inf?: number;
}
export type roster = model[];
type condition = (m: model) => boolean;

// enforce a limit of how many models can be selected that match a given condition
function checkCount(
  roster: roster,
  model: model,
  oldCount: number,
  value: boolean,
  condition: condition,
  limit: number
) {
  var newCount = oldCount;
  if (condition(model)) {
    newCount += value ? 1 : -1;
    if (newCount === limit) {
      roster.forEach((m) => {
        if (!m.selected && condition(m)) {
          m.disabled += 1;
        }
      });
    } else if (newCount === limit - 1 && oldCount === limit) {
      roster.forEach((m) => {
        if (!(m === model || m.selected) && condition(m)) {
          m.disabled += -1;
        }
      });
    }
  }
  return newCount;
}

function checkVeterans(roster: roster, model: model, value: boolean) {
  roster.forEach((m) => {
    if (m !== model && m.name === model.name) {
      m.disabled += value ? 1 : -1;
    }
    // special handling of vGreede / Averisse
    // for veteran of previously benched model
    if (m.dehcneb === model.name || m.name === model.dehcneb) {
      m.disabled += value ? 1 : -1;
    }
  });
}

function checkBenched(roster: roster, model: model, value: boolean) {
  if (model.dehcneb) {
    let b = roster.find((b) => b.benched && b.name === model.dehcneb);
    b && (b.selected = value);
  }
}

interface DraftListItemProps {
  model: model;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function DraftListItem({
  model,
  disabled = false,
  onChange,
}: DraftListItemProps) {
  const ref = useUpdateAnimation(disabled, [model.selected]);
  return (
    <FormControlLabel
      ref={ref}
      label={model.id}
      control={
        <Checkbox
          size="small"
          checked={model.selected}
          disabled={model.disabled > 0 || disabled}
          onChange={onChange}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<RadioButtonCheckedIcon />}
        />
      }
    />
  );
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: "2em",
    top: "2em",
  },
}));

interface DraftListProps {
  // guild: any;
  guild: GBGuildDoc;
  disabled?: boolean;
  ready: (team: GBModel[]) => void;
  unready: () => void;
  onUpdate?: (m: model, selected: boolean) => void;
  ignoreRules?: boolean;
  style?: CSSProperties;
}

const DraftLimits = {
  3: {
    captain: 1,
    mascot: 0,
    squaddies: 2,
  },
  4: {
    captain: 1,
    mascot: 1,
    squaddies: 2,
  },
  6: {
    captain: 1,
    mascot: 1,
    squaddies: 4,
  },
};

export const DraftList = observer(
  React.forwardRef((props: DraftListProps, ref) => {
    const {
      guild,
      ready: listReady,
      unready,
      onUpdate,
      disabled = false,
      ignoreRules = false,
      style,
    } = props;
    const { gbdb: db } = useData();
    const { settings } = useStore();
    let [ready, setReady] = useState(false);

    // captain and mascot get pre-selected for minor guilds
    let [captain, setCaptain] = useState(guild.minor ? 1 : 0);
    let [mascot, setMascot] = useState(
      guild.minor && DraftLimits[settings.gameSize as 3 | 4 | 6].mascot > 0
        ? 1
        : 0
    );
    let [squaddieCount, setSquadCount] = useState(0);

    let [roster, setRoster] = useState<roster>();

    useEffect(() => {
      const fetchData = async () => {
        if (!db) {
          return;
        }
        let models = await db.models
          .find()
          .where("id")
          .in(guild.roster)
          .exec()
          .then((models) => {
            // need to make a deep copy of the roster data
            let tmpRoster = models.map((m) => m.toMutableJSON()) as model[];
            reSort(tmpRoster, "id", guild.roster);
            // and add UI state
            tmpRoster.forEach((m) => {
              Object.assign(m, {
                selected: false,
                disabled: m.benched ? 1 : 0,
              });
            });
            // pre-select captain and mascot for minor guilds
            if (guild.minor) {
              tmpRoster.forEach((m) => {
                if (
                  m.captain ||
                  (m.mascot &&
                    DraftLimits[settings.gameSize as 3 | 4 | 6].mascot > 0)
                ) {
                  m.selected = true;
                  m.disabled = 1;
                }
              });
            }
            // disable mascots in a 3v3 game
            if (DraftLimits[settings.gameSize as 3 | 4 | 6].mascot === 0) {
              tmpRoster.forEach((m) => {
                if (m.mascot) {
                  m.disabled = 1;
                }
              });
            }
            setRoster(tmpRoster);
          });
      };
      fetchData();
    }, [guild, db]);

    function checkCaptains(
      roster: roster,
      model: model,
      count: number,
      value: boolean
    ) {
      return checkCount(
        roster,
        model,
        count,
        value,
        (m: model) => !!m.captain,
        DraftLimits[settings.gameSize as 3 | 4 | 6].captain
      );
    }

    function checkMascots(
      roster: roster,
      model: model,
      count: number,
      value: boolean
    ) {
      return checkCount(
        roster,
        model,
        count,
        value,
        (m: model) => !!m.mascot,
        DraftLimits[settings.gameSize as 3 | 4 | 6].mascot
      );
    }

    function checkSquaddieCount(
      roster: roster,
      model: model,
      count: number,
      value: boolean
    ) {
      return checkCount(
        roster,
        model,
        count,
        value,
        (m: model) => !(m.captain || m.mascot),
        DraftLimits[settings.gameSize as 3 | 4 | 6].squaddies
      );
    }

    const onSwitch = useCallback(
      (model: model, value: boolean) => {
        if (!roster) {
          return;
        }
        onUpdate?.(model, value);
        model.selected = value;

        let newCaptain = checkCaptains(roster, model, captain, value);
        setCaptain(newCaptain);

        let newMascot = checkMascots(roster, model, mascot, value);
        setMascot(newMascot);

        let newCount = checkSquaddieCount(roster, model, squaddieCount, value);
        setSquadCount(newCount);

        checkVeterans(roster, model, value);
        checkBenched(roster, model, value);

        if (
          (newCaptain === DraftLimits[settings.gameSize as 3 | 4 | 6].captain &&
            newMascot === DraftLimits[settings.gameSize as 3 | 4 | 6].mascot &&
            newCount ===
              DraftLimits[settings.gameSize as 3 | 4 | 6].squaddies) ||
          ignoreRules
        ) {
          setReady(true);
        } else {
          setReady(false);
        }
        setRoster(roster);
      },
      [roster, onUpdate, captain, mascot, squaddieCount, ignoreRules]
    );

    useEffect(() => {
      if (ready && roster) {
        const team = cloneDeep(roster.filter((m: model) => m.selected));
        listReady?.(team as any);
      } else {
        unready?.();
      }
    }, [ready, guild, roster, listReady, unready]);

    const setModel = useCallback(
      (id: string, value: boolean) => {
        if (!roster) {
          return;
        }
        const model: model | undefined = roster.find((m: model) => m.id === id);
        if (model) {
          onSwitch(model, value);
        } else {
          console.log(`failed to find ${id}`);
        }
      },
      // [ready, roster, onSwitch]
      [roster, onSwitch]
    );

    useImperativeHandle(ref, () => ({ setModel }), [setModel]);

    if (!roster) {
      return null;
    }

    let captains = roster.filter((m: model) => m.captain);
    let mascots = roster.filter((m: model) => m.mascot && !m.captain);
    let squaddies = roster.filter((m: model) => !m.captain && !m.mascot);

    return (
      <StyledBadge
        badgeContent={ready ? <Check color="success" /> : 0}
        style={{ overflow: "visible", ...style }}
      >
        <Card
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            border: "4px solid",
            borderColor: guild.darkColor ?? guild.color,
            borderRadius: "1em",
            padding: "1ex",
            width: "100%",
            overflow: "visible",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>Captains :</span>
            {captains.map((m: model) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={(e) => onSwitch(m, !m.selected)}
                disabled={disabled}
              />
            ))}
            <span>Mascots :</span>
            {mascots.map((m: model) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={(e) => onSwitch(m, !m.selected)}
                disabled={disabled}
              />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>Squaddies :</span>
            {squaddies.slice(0, squaddies.length / 2).map((m: model) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={(e) => onSwitch(m, !m.selected)}
                disabled={disabled}
              />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>&nbsp;</span>
            {squaddies.slice(squaddies.length / 2).map((m: model) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={(e) => onSwitch(m, !m.selected)}
                disabled={disabled}
              />
            ))}
          </div>
        </Card>
      </StyledBadge>
    );
  })
);

const BSDraftLimits = {
  3: {
    master: 1,
    apprentice: 2,
  },
  4: {
    master: 2,
    apprentice: 2,
  },
  6: {
    master: 3,
    apprentice: 3,
  },
};

export const BSDraftList = observer(
  React.forwardRef((props: DraftListProps, ref) => {
    const {
      guild,
      ready: listReady,
      unready,
      onUpdate,
      ignoreRules = false,
      disabled = false,
      style,
    } = props;
    const { gbdb: db } = useData();
    const { settings } = useStore();

    let [masterCount, setMasterCount] = useState(0);
    let [apprenticeCount, setApprenticeCount] = useState(0);
    let [ready, setReady] = useState(false);

    let [roster, setRoster] = useState<roster>();

    useEffect(() => {
      const fetchData = async () => {
        if (!db) {
          return;
        }
        let models = await db.models
          .find()
          .where("id")
          .in(guild.roster)
          .exec()
          .then((models) => {
            // need to make a deep copy of the roster data
            let tmpRoster = models.map((m) => m.toMutableJSON()) as model[];
            reSort(tmpRoster, "id", guild.roster);
            // and add UI state
            tmpRoster.forEach((m) => {
              Object.assign(m, {
                selected: false,
                disabled: m.benched ? 1 : 0,
              });
            });
            setRoster(tmpRoster);
          });
      };
      fetchData();
    }, [guild, db]);

    function checkMasterCount(
      roster: roster,
      model: model,
      count: number,
      value: boolean
    ) {
      return checkCount(
        roster,
        model,
        count,
        value,
        (m: model) => !!m.captain,
        BSDraftLimits[settings.gameSize as 3 | 4 | 6].master
      );
    }

    function checkApprenticeCount(
      roster: roster,
      model: model,
      count: number,
      value: boolean
    ) {
      return checkCount(
        roster,
        model,
        count,
        value,
        (m: model) => !m.captain,
        BSDraftLimits[settings.gameSize as 3 | 4 | 6].apprentice
      );
    }

    const onSwitch = useCallback(
      (model: model, value: boolean) => {
        if (!roster) {
          return;
        }
        onUpdate?.(model, value);
        model.selected = value;

        let newMasterCount = checkMasterCount(
          roster,
          model,
          masterCount,
          value
        );
        setMasterCount(newMasterCount);

        let newApprenticeCount = checkApprenticeCount(
          roster,
          model,
          apprenticeCount,
          value
        );
        setApprenticeCount(newApprenticeCount);

        checkVeterans(roster, model, value);
        checkBenched(roster, model, value);

        if (
          (newMasterCount ===
            BSDraftLimits[settings.gameSize as 3 | 4 | 6].master &&
            newApprenticeCount ===
              BSDraftLimits[settings.gameSize as 3 | 4 | 6].apprentice) ||
          ignoreRules
        ) {
          setReady(true);
        } else {
          setReady(false);
        }

        setRoster(roster);
      },
      [roster, onUpdate, masterCount, apprenticeCount, ignoreRules]
    );

    useEffect(() => {
      if (!roster) {
        return;
      }
      if (ready) {
        const team = cloneDeep(roster.filter((m: model) => m.selected));
        listReady?.(team as any);
      } else {
        unready?.();
      }
    }, [ready, guild, roster, listReady, unready]);

    const setModel = useCallback(
      (id: string, value: boolean) => {
        if (!roster) {
          return;
        }
        const model: model | undefined = roster.find((m: model) => m.id === id);
        if (model) {
          onSwitch(model, value);
        } else {
          console.log(`failed to find ${id}`);
        }
      },
      // [ready, roster, onSwitch]
      [roster, onSwitch]
    );

    useImperativeHandle(ref, () => ({ setModel }), [setModel]);

    if (!roster) {
      return null;
    }

    let masters = roster.filter((m: model) => m.captain);
    let apprentices = roster.filter((m: model) => !m.captain);

    return (
      <StyledBadge
        badgeContent={ready ? <Check color="success" /> : 0}
        style={{ overflow: "visible", ...style }}
      >
        <Card
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            border: "4px solid",
            borderColor: guild.darkColor ?? guild.color,
            borderRadius: "1em",
            padding: "1ex",
            width: "100%",
            overflow: "visible",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>Masters :</span>
            {masters.map((m: model) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={(e) => onSwitch(m, !m.selected)}
                disabled={disabled}
              />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>Apprentices :</span>
            {apprentices.slice(0, apprentices.length / 2).map((m: model) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={(e) => onSwitch(m, !m.selected)}
                disabled={disabled}
              />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>&nbsp;</span>
            {apprentices.slice(apprentices.length / 2).map((m: model) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={(e) => onSwitch(m, !m.selected)}
                disabled={disabled}
              />
            ))}
          </div>
        </Card>
      </StyledBadge>
    );
  })
);
