import React, {
  useState,
  useEffect,
  CSSProperties,
  useCallback,
  useRef,
} from "react";
import cloneDeep from "lodash.clonedeep";
import { Badge, Card, Checkbox, FormControlLabel } from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { CheckCircleTwoTone as Check } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useUpdateAnimation } from "../hooks/useUpdateAnimation";
import { GBGameStateDoc, GBGuild, GBModel } from "../models/gbdb";
import { reSort } from "../utils/reSort";
import { useSettings } from "../hooks/useSettings";
import { useRxData } from "../hooks/useRxQuery";
import { map } from "rxjs";

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

function checkBenched(
  roster: Roster,
  model: DraftModel,
  value: boolean,
  update: (model: DraftModel, selected: boolean) => void
) {
  if (model.dehcneb) {
    const b = roster.find((b) => b.benched && b.name === model.dehcneb);
    if (b) {
      update(b, value);
    }
  }
}

interface DraftListItemProps {
  model: DraftModel;
  disabled?: boolean;
  stateDoc: GBGameStateDoc;
  updateCounts: (m: DraftModel, v: boolean) => void;
}

function DraftListItem({
  model,
  disabled = false,
  stateDoc,
  updateCounts,
}: DraftListItemProps) {
  const [selected, setSelected] = useState(model.selected);
  useEffect(() => {
    const selected$ = stateDoc.get$("roster").pipe(
      map((r: Array<{ name: string; health: number }>) => {
        return r.map((o) => o.name).includes(model.id);
      })
    );
    const observer = selected$.subscribe((v) => {
      setSelected(v);
      if (v !== model.selected && !model.benched) {
        updateCounts(model, v);
      }
    });
    return () => observer?.unsubscribe();
  }, [stateDoc, model, updateCounts]);
  const ref = useUpdateAnimation(disabled, [selected]);
  return (
    <FormControlLabel
      ref={ref}
      label={model.id}
      control={
        <Checkbox
          size="small"
          checked={selected}
          disabled={model.disabled > 0 || disabled}
          onChange={(e) => {
            const value = e.target.checked;
            stateDoc
              .incrementalModify((state) => {
                if (value) {
                  const r = state.roster.concat({
                    name: model.id,
                    health: model.hp,
                  });
                  state.roster = r;
                } else {
                  const r = state.roster.filter((o) => o.name != model.id);
                  state.roster = r;
                }
                return state;
              })
              .catch(console.error);
          }}
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
  stateDoc: GBGameStateDoc;
  disabled?: boolean;
  ready: (team: GBModel[]) => void;
  unready: () => void;
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

export const DraftList = (props: DraftListProps) => {
  const { guild, ready: listReady, unready, disabled = false, style } = props;

  const { setting$ } = useSettings();
  const [gameSize, setGameSize] = useState<3 | 4 | 6>(6);
  useEffect(() => {
    const sub = setting$
      ?.pipe(map((s) => s?.toJSON().data.gameSize))
      .subscribe((gs) => setGameSize(gs ?? 6));
    return () => sub?.unsubscribe();
  }, [setting$]);

  // putting these behind a ref avoids stale captures in the callback
  // when db updates cause multiple callback runs in one update cycle
  const counters = useRef({ captain: 0, mascot: 0, squaddieCount: 0 });
  // but then we need to trigger a render, so use a fake state counter for that
  const [, setUpdate] = useState(0);

  const [ready, setReady] = useState(false);

  const roster = useRxData(
    async (db) => {
      const models = await db.models.find().where("id").in(guild.roster).exec();
      // need to make a copy of the roster data
      // and add in UI state for drafting
      const tmpRoster: DraftModel[] = models.map((m) =>
        Object.assign(m.toMutableJSON(), {
          selected: false,
          disabled: m.benched ? 1 : 0,
        })
      );
      reSort(tmpRoster, "id", guild.roster);
      // pre-select captain and mascot for minor guilds
      if (!disabled && guild.minor) {
        const selected: Set<string> = new Set(
          props.stateDoc.get("roster").map((m: unknown) => JSON.stringify(m))
        );
        tmpRoster.forEach((m) => {
          if (m.captain || (m.mascot && DraftLimits[gameSize].mascot > 0)) {
            selected.add(JSON.stringify({ name: m.id, health: m.hp }));
            m.disabled = 1;
          }
        });
        props.stateDoc
          .incrementalModify((state) => {
            state.roster = Array.from(selected).map((s) => JSON.parse(s));
            return state;
          })
          .catch(console.error);
      }
      // disable mascots in a 3v3 game
      if (DraftLimits[gameSize].mascot === 0) {
        tmpRoster.forEach((m) => {
          if (m.mascot) {
            m.disabled = 1;
          }
        });
      }
      return tmpRoster;
    },
    [guild, gameSize]
  );

  const onSwitch = useCallback(
    (model: DraftModel, value: boolean) => {
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
          DraftLimits[gameSize].captain
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
          DraftLimits[gameSize].mascot
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
          DraftLimits[gameSize].squaddies
        );
      }

      if (!roster) {
        return;
      }

      model.selected = value;

      const newCaptain = checkCaptains(
        roster,
        model,
        counters.current.captain,
        value
      );
      counters.current.captain = newCaptain;

      const newMascot = checkMascots(
        roster,
        model,
        counters.current.mascot,
        value
      );
      counters.current.mascot = newMascot;

      const newCount = checkSquaddieCount(
        roster,
        model,
        counters.current.squaddieCount,
        value
      );
      counters.current.squaddieCount = newCount;

      checkVeterans(roster, model, value);
      checkBenched(roster, model, value, (benched, value) => {
        if (disabled) {
          return;
        }
        benched.selected = value;
        props.stateDoc.incrementalModify((state) => {
          if (value) {
            const r = state.roster.concat({
              name: benched.id,
              health: benched.hp,
            });
            state.roster = r;
          } else {
            const r = state.roster.filter((o) => o.name != benched.id);
            state.roster = r;
          }
          return state;
        });
      });

      if (
        newCaptain === DraftLimits[gameSize].captain &&
        newMascot === DraftLimits[gameSize].mascot &&
        newCount === DraftLimits[gameSize].squaddies
      ) {
        setReady(true);
      } else {
        setReady(false);
      }

      setUpdate((old) => old + 1);
    },
    [props.stateDoc, roster, gameSize, disabled]
  );

  useEffect(() => {
    if (ready && roster) {
      const team = cloneDeep(roster.filter((m: DraftModel) => m.selected));
      listReady?.(team);
    } else {
      unready?.();
    }
  }, [ready, guild, roster, listReady, unready]);

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
              stateDoc={props.stateDoc}
              updateCounts={onSwitch}
              disabled={disabled}
            />
          ))}
          <span>Mascots :</span>
          {mascots.map((m: DraftModel) => (
            <DraftListItem
              key={m.id}
              model={m}
              stateDoc={props.stateDoc}
              updateCounts={onSwitch}
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
              stateDoc={props.stateDoc}
              updateCounts={onSwitch}
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
              stateDoc={props.stateDoc}
              updateCounts={onSwitch}
              disabled={disabled}
            />
          ))}
        </div>
      </Card>
    </StyledBadge>
  );
};

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

export const BSDraftList = (props: DraftListProps) => {
  const { guild, ready: listReady, unready, disabled = false, style } = props;

  const { setting$ } = useSettings();
  const [gameSize, setGameSize] = useState<3 | 4 | 6>(6);
  useEffect(() => {
    const sub = setting$
      ?.pipe(map((s) => s?.toJSON().data.gameSize))
      .subscribe((gs) => setGameSize(gs ?? 6));
    return () => sub?.unsubscribe();
  }, [setting$]);

  const counters = useRef({ masterCount: 0, apprenticeCount: 0 });
  const [, setUpdate] = useState(0);

  const [ready, setReady] = useState(false);

  const roster = useRxData(
    async (db) => {
      const models = await db.models.find().where("id").in(guild.roster).exec();
      // need to make a copy of the roster data
      // and add UI state for drafting
      const tmpRoster: DraftModel[] = models.map((m) =>
        Object.assign(m.toMutableJSON(), {
          selected: false,
          disabled: m.benched ? 1 : 0,
        })
      );
      reSort(tmpRoster, "id", guild.roster);
      return tmpRoster;
    },
    [guild]
  );

  const onSwitch = useCallback(
    (model: DraftModel, value: boolean) => {
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
          BSDraftLimits[gameSize].master
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
          BSDraftLimits[gameSize].apprentice
        );
      }

      if (!roster) {
        return;
      }

      model.selected = value;

      const newMasterCount = checkMasterCount(
        roster,
        model,
        counters.current.masterCount,
        value
      );
      counters.current.masterCount = newMasterCount;

      const newApprenticeCount = checkApprenticeCount(
        roster,
        model,
        counters.current.apprenticeCount,
        value
      );
      counters.current.apprenticeCount = newApprenticeCount;

      checkVeterans(roster, model, value);
      checkBenched(roster, model, value, (benched, value) => {
        if (disabled) {
          return;
        }
        benched.selected = value;
        props.stateDoc.incrementalModify((state) => {
          if (value) {
            const r = state.roster.concat({
              name: benched.id,
              health: benched.hp,
            });
            state.roster = r;
          } else {
            const r = state.roster.filter((o) => o.name != benched.id);
            state.roster = r;
          }
          return state;
        });
      });

      if (
        newMasterCount === BSDraftLimits[gameSize].master &&
        newApprenticeCount === BSDraftLimits[gameSize].apprentice
      ) {
        setReady(true);
      } else {
        setReady(false);
      }

      setUpdate((old) => old + 1);
    },
    [props.stateDoc, roster, gameSize, disabled]
  );

  useEffect(() => {
    if (ready && roster) {
      const team = cloneDeep(roster.filter((m: DraftModel) => m.selected));
      listReady?.(team);
    } else {
      unready?.();
    }
  }, [ready, guild, roster, listReady, unready]);

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
              stateDoc={props.stateDoc}
              updateCounts={onSwitch}
              disabled={disabled}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Apprentices :</span>
          {apprentices.slice(0, apprentices.length / 2).map((m: DraftModel) => (
            <DraftListItem
              key={m.id}
              model={m}
              stateDoc={props.stateDoc}
              updateCounts={onSwitch}
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
              stateDoc={props.stateDoc}
              updateCounts={onSwitch}
              disabled={disabled}
            />
          ))}
        </div>
      </Card>
    </StyledBadge>
  );
};
