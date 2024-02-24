import React, {
  useState,
  useEffect,
  CSSProperties,
  useImperativeHandle,
  useCallback,
} from "react";
import { useStore } from "../models/Root";
import { useData } from "../components/DataContext";
import cloneDeep from "lodash.clonedeep";
import { Badge, Card, Checkbox, FormControlLabel } from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { CheckCircleTwoTone as Check } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useUpdateAnimation } from "./useUpdateAnimation";
import { observer } from "mobx-react-lite";
import { GBGuild, GBModel } from "../models/gbdb";
import { reSort } from "./reSort";

export interface DraftModel extends GBModel {
  selected: boolean;
  disabled: number;
}
export type Roster = DraftModel[];
type condition = (m: DraftModel) => boolean;

// enforce a limit of how many models can be selected that match a given condition
function checkCount(
  roster: Roster,
  model: DraftModel,
  oldCount: number,
  value: boolean,
  condition: condition,
  limit: number
) {
  let newCount = oldCount;
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

function checkVeterans(roster: Roster, model: DraftModel, value: boolean) {
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

function checkBenched(roster: Roster, model: DraftModel, value: boolean) {
  if (model.dehcneb) {
    const b = roster.find((b) => b.benched && b.name === model.dehcneb);
    b && (b.selected = value);
  }
}

interface DraftListItemProps {
  model: DraftModel;
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

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    right: "2em",
    top: "2em",
  },
}));

interface DraftListProps {
  guild: GBGuild;
  disabled?: boolean;
  ready: (team: GBModel[]) => void;
  unready: () => void;
  onUpdate?: (m: DraftModel, selected: boolean) => void;
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
    const [ready, setReady] = useState(false);

    // captain and mascot get pre-selected for minor guilds
    const [captain, setCaptain] = useState(guild.minor ? 1 : 0);
    const [mascot, setMascot] = useState(
      guild.minor && DraftLimits[settings.gameSize as 3 | 4 | 6].mascot > 0
        ? 1
        : 0
    );
    const [squaddieCount, setSquadCount] = useState(0);

    const [roster, setRoster] = useState<Roster>();

    useEffect(() => {
      const fetchData = async () => {
        if (!db) {
          return;
        }
        const models = await db.models
          .find()
          .where("id")
          .in(guild.roster)
          .exec();
        // need to make a deep copy of the roster data
        // and add in UI state for drafting
        const tmpRoster: DraftModel[] = models.map((m) =>
          Object.assign(m.toMutableJSON(), {
            selected: false,
            disabled: m.benched ? 1 : 0,
          })
        );
        reSort(tmpRoster, "id", guild.roster);
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
      };
      fetchData().catch(console.error);
    }, [guild, db, settings.gameSize]);

    function checkCaptains(
      roster: Roster,
      model: DraftModel,
      count: number,
      value: boolean
    ) {
      return checkCount(
        roster,
        model,
        count,
        value,
        (m: DraftModel) => !!m.captain,
        DraftLimits[settings.gameSize as 3 | 4 | 6].captain
      );
    }

    function checkMascots(
      roster: Roster,
      model: DraftModel,
      count: number,
      value: boolean
    ) {
      return checkCount(
        roster,
        model,
        count,
        value,
        (m: DraftModel) => !!m.mascot,
        DraftLimits[settings.gameSize as 3 | 4 | 6].mascot
      );
    }

    function checkSquaddieCount(
      roster: Roster,
      model: DraftModel,
      count: number,
      value: boolean
    ) {
      return checkCount(
        roster,
        model,
        count,
        value,
        (m: DraftModel) => !(m.captain || m.mascot),
        DraftLimits[settings.gameSize as 3 | 4 | 6].squaddies
      );
    }

    const onSwitch = useCallback(
      (model: DraftModel, value: boolean) => {
        if (!roster) {
          return;
        }
        onUpdate?.(model, value);
        model.selected = value;

        const newCaptain = checkCaptains(roster, model, captain, value);
        setCaptain(newCaptain);

        const newMascot = checkMascots(roster, model, mascot, value);
        setMascot(newMascot);

        const newCount = checkSquaddieCount(
          roster,
          model,
          squaddieCount,
          value
        );
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
        const team = cloneDeep(roster.filter((m: DraftModel) => m.selected));
        listReady?.(team);
      } else {
        unready?.();
      }
    }, [ready, guild, roster, listReady, unready]);

    const setModel = useCallback(
      (id: string, value: boolean) => {
        if (!roster) {
          return;
        }
        const model: DraftModel | undefined = roster.find(
          (m: DraftModel) => m.id === id
        );
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

    const captains = roster.filter((m: DraftModel) => m.captain);
    const mascots = roster.filter((m: DraftModel) => m.mascot && !m.captain);
    const squaddies = roster.filter((m: DraftModel) => !m.captain && !m.mascot);

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
            {captains.map((m: DraftModel) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={() => onSwitch(m, !m.selected)}
                disabled={disabled}
              />
            ))}
            <span>Mascots :</span>
            {mascots.map((m: DraftModel) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={() => onSwitch(m, !m.selected)}
                disabled={disabled}
              />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>Squaddies :</span>
            {squaddies.slice(0, squaddies.length / 2).map((m: DraftModel) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={() => onSwitch(m, !m.selected)}
                disabled={disabled}
              />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>&nbsp;</span>
            {squaddies.slice(squaddies.length / 2).map((m: DraftModel) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={() => onSwitch(m, !m.selected)}
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

    const [masterCount, setMasterCount] = useState(0);
    const [apprenticeCount, setApprenticeCount] = useState(0);
    const [ready, setReady] = useState(false);

    const [roster, setRoster] = useState<Roster>();

    useEffect(() => {
      const fetchData = async () => {
        if (!db) {
          return;
        }
        const models = await db.models
          .find()
          .where("id")
          .in(guild.roster)
          .exec();
        // need to make a deep copy of the roster data
        // and add UI state for drafting
        const tmpRoster: DraftModel[] = models.map((m) =>
          Object.assign(m.toMutableJSON(), {
            selected: false,
            disabled: m.benched ? 1 : 0,
          })
        );
        reSort(tmpRoster, "id", guild.roster);
        setRoster(tmpRoster);
      };
      fetchData().catch(console.error);
    }, [guild, db]);

    function checkMasterCount(
      roster: Roster,
      model: DraftModel,
      count: number,
      value: boolean
    ) {
      return checkCount(
        roster,
        model,
        count,
        value,
        (m: DraftModel) => !!m.captain,
        BSDraftLimits[settings.gameSize as 3 | 4 | 6].master
      );
    }

    function checkApprenticeCount(
      roster: Roster,
      model: DraftModel,
      count: number,
      value: boolean
    ) {
      return checkCount(
        roster,
        model,
        count,
        value,
        (m: DraftModel) => !m.captain,
        BSDraftLimits[settings.gameSize as 3 | 4 | 6].apprentice
      );
    }

    const onSwitch = useCallback(
      (model: DraftModel, value: boolean) => {
        if (!roster) {
          return;
        }
        onUpdate?.(model, value);
        model.selected = value;

        const newMasterCount = checkMasterCount(
          roster,
          model,
          masterCount,
          value
        );
        setMasterCount(newMasterCount);

        const newApprenticeCount = checkApprenticeCount(
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
        const team = cloneDeep(roster.filter((m: DraftModel) => m.selected));
        listReady?.(team);
      } else {
        unready?.();
      }
    }, [ready, guild, roster, listReady, unready]);

    const setModel = useCallback(
      (id: string, value: boolean) => {
        if (!roster) {
          return;
        }
        const model: DraftModel | undefined = roster.find(
          (m: DraftModel) => m.id === id
        );
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

    const masters = roster.filter((m: DraftModel) => m.captain);
    const apprentices = roster.filter((m: DraftModel) => !m.captain);

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
            {masters.map((m: DraftModel) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={() => onSwitch(m, !m.selected)}
                disabled={disabled}
              />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>Apprentices :</span>
            {apprentices
              .slice(0, apprentices.length / 2)
              .map((m: DraftModel) => (
                <DraftListItem
                  key={m.id}
                  model={m}
                  onChange={() => onSwitch(m, !m.selected)}
                  disabled={disabled}
                />
              ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>&nbsp;</span>
            {apprentices.slice(apprentices.length / 2).map((m: DraftModel) => (
              <DraftListItem
                key={m.id}
                model={m}
                onChange={() => onSwitch(m, !m.selected)}
                disabled={disabled}
              />
            ))}
          </div>
        </Card>
      </StyledBadge>
    );
  })
);
