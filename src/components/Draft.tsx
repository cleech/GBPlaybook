import React, {
  useState,
  useEffect,
  CSSProperties,
  useImperativeHandle,
  useCallback,
} from "react";
import { IGBPlayer } from "../models/Root";
import { useData } from "../components/DataContext";
import cloneDeep from "lodash.clonedeep";
import { Badge, Card, Checkbox, FormControlLabel } from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { CheckCircleTwoTone as Check, PropaneSharp } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { connectStorageEmulator } from "firebase/storage";

// import { Guild } from './DataContext.d';

export interface model extends IGBPlayer {
  selected: boolean;
  disabled: number;
}
export type roster = model[];
type condition = (m: model) => boolean;

function checkSingleton(
  roster: roster,
  model: model,
  value: boolean,
  condition: condition
) {
  if (condition(model)) {
    roster.forEach((m) => {
      if (condition(m) && m !== model) {
        m.disabled += value ? 1 : -1;
      }
    });
    return value;
  }
  return undefined;
}

// returns true/false when captain is set/unset
// returns undefined on other switch events
function checkCaptains(roster: roster, model: model, value: boolean) {
  return checkSingleton(roster, model, value, (m: model) => m.captain);
}

// returns true/false when mascot is set/unset
// returns undefined on other switch events
function checkMascots(roster: roster, model: model, value: boolean) {
  return checkSingleton(roster, model, value, (m: model) => m.mascot);
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

// 4 squaddies
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
    4
  );
}

// 3 masters
function checkMasterCount(
  roster: roster,
  model: model,
  count: number,
  value: boolean
) {
  return checkCount(roster, model, count, value, (m: model) => m.captain, 3);
}

// 3 apprentices
function checkApprenticeCount(
  roster: roster,
  model: model,
  count: number,
  value: boolean
) {
  return checkCount(roster, model, count, value, (m: model) => !m.captain, 3);
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
  return (
    <FormControlLabel
      // label={model.id}
      // label={model.displayName}
      label={
        (model.veteran ? "v" : "") + (model.seasoned ? "s" : "") + model.name
      }
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
  guild: any;
  disabled?: boolean;
  ready: (team: roster) => void;
  unready: () => void;
  onUpdate?: (m: model, selected: boolean) => void;
  ignoreRules?: boolean;
  style?: CSSProperties;
}

export const DraftList = React.forwardRef((props: DraftListProps, ref) => {
  const {
    guild,
    ready: listReady,
    unready,
    onUpdate,
    disabled = false,
    ignoreRules = false,
    style,
  } = props;
  const { data } = useData();
  const Models = data?.Models;

  let [ready, setReady] = useState(false);

  const onSwitch = useCallback(
    (model: model, value: boolean) => {
      console.log(`onSwitch: ${model.id} ${value}`);
      onUpdate?.(model, value);
      model.selected = value;

      captain = checkCaptains(roster, model, value) ?? captain;
      setCaptain(captain);

      mascot = checkMascots(roster, model, value) ?? mascot;
      setMascot(mascot);

      squaddieCount = checkSquaddieCount(roster, model, squaddieCount, value);
      setSquadCount(squaddieCount);

      checkVeterans(roster, model, value);
      checkBenched(roster, model, value);

      console.log("checking ready state");
      if ((captain && mascot && squaddieCount === 4) || ignoreRules) {
        console.log(`ready!!!`);
        setReady(true);
      } else {
        setReady(false);
      }
      // } else if (ready) {
      //   console.log("NOT ready!!!");
      //   setReady(false);
      // } else {
      //   console.log(`whats going on? ready = ${ready}`);
      // }

      setRoster(roster);
    },
    [ready, onUpdate]
  );

  // captain and mascot get pre-selected for minor guilds
  let [captain, setCaptain] = useState(guild.minor ? true : false);
  let [mascot, setMascot] = useState(guild.minor ? true : false);
  let [squaddieCount, setSquadCount] = useState(0);

  let [roster, setRoster] = useState<roster>(() => {
    // need to make a deep copy of the roster data
    let tmpRoster = cloneDeep(
      // Models.filter((m) => guild.roster.includes(m.id)),
      guild.roster.map((name: string) => Models?.find((m) => m.id === name))
    );
    // and add UI state
    tmpRoster.forEach((m: model) => {
      Object.assign(m, { selected: false, disabled: m.benched ? 1 : 0 });
    });
    // pre-select captain and mascot for minor guilds
    if (guild.minor) {
      tmpRoster.forEach((m: model) => {
        if (m.captain || m.mascot) {
          m.selected = true;
          m.disabled = 1;
        }
      });
    }
    return tmpRoster;
  });

  useEffect(() => {
    if (ready) {
      let team = cloneDeep(guild);
      team.roster = cloneDeep(roster.filter((m: model) => m.selected));
      listReady?.(team.roster);
    } else {
      unready?.();
    }
  }, [ready, guild, roster, listReady, unready]);

  const setModel = useCallback(
    (id: string, value: boolean) => {
      console.log(`updating ${id}: ${value}`);
      const model: model | undefined = roster.find((m: model) => m.id === id);
      if (model) {
        onSwitch(model, value);
      } else {
        console.log(`failed to find ${id}`);
      }
    },
    [ready, roster, onSwitch]
  );

  useImperativeHandle(ref, () => ({ setModel }), [setModel]);

  if (!data) {
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
});

export const BSDraftList = React.forwardRef((props: DraftListProps, ref) => {
  const {
    guild,
    ready: listReady,
    unready,
    onUpdate,
    ignoreRules = false,
    disabled = false,
    style,
  } = props;
  const { data } = useData();
  const Models = data?.Models;

  const onSwitch = (model: model, value: boolean) => {
    onUpdate?.(model, value);
    model.selected = value;

    masterCount = checkMasterCount(roster, model, masterCount, value);
    setMasterCount(masterCount);

    apprenticeCount = checkApprenticeCount(
      roster,
      model,
      apprenticeCount,
      value
    );
    setApprenticeCount(apprenticeCount);

    checkVeterans(roster, model, value);
    checkBenched(roster, model, value);

    if ((masterCount === 3 && apprenticeCount === 3) || ignoreRules) {
      setReady(true);
    } else {
      setReady(false);
    }

    setRoster(roster);
  };

  let [masterCount, setMasterCount] = useState(0);
  let [apprenticeCount, setApprenticeCount] = useState(0);
  let [ready, setReady] = useState(false);

  let [roster, setRoster] = useState(() => {
    // need to make a deep copy of the roster data
    let tmpRoster = cloneDeep(
      // Models.filter((m) => guild.roster.includes(m.id)),
      guild.roster.map((name: string) => Models?.find((m) => m.id === name))
    );
    // and add UI state
    tmpRoster.forEach((m: model) => {
      Object.assign(m, { selected: false, disabled: m.benched ? 1 : 0 });
    });
    return tmpRoster;
  });

  useEffect(() => {
    if (ready) {
      let team = cloneDeep(guild);
      team.roster = cloneDeep(roster.filter((m: model) => m.selected));
      listReady?.(team.roster);
    } else {
      unready?.();
    }
  }, [ready, guild, roster, listReady, unready]);

  const setModel = useCallback(
    (id: string, value: boolean) => {
      const model: model | undefined = roster.find((m: model) => m.id === id);
      if (model) {
        onSwitch(model, value);
      } else {
        console.log(`failed to find ${id}`);
      }
    },
    [ready, roster, onSwitch]
  );

  useImperativeHandle(ref, () => ({ setModel }), [setModel]);

  if (!data) {
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
});
