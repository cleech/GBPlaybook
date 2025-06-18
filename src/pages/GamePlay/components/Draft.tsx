import {
  useState,
  useEffect,
  CSSProperties
} from "react";
import { Badge, Card, Checkbox, FormControlLabel } from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { CheckCircleTwoTone as Check } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useUpdateAnimation } from "../../../hooks/useUpdateAnimation";
import { Model, Guild } from "../../../components/DataTypes";
import { GBGameStateDoc } from "../../../models/gbdbTypes";
import { map, Observable } from "rxjs";
import { useRouteLoaderData } from "react-router-dom";
import { SettingsDoc } from "../../../models/settings";

export interface DraftModel extends Model {
  disabled: number;
}
export type Roster = DraftModel[];

interface DraftListItemProps {
  model: DraftModel;
  disabled?: boolean;
  stateDoc: GBGameStateDoc;
}

function DraftListItem({
  model,
  disabled = false,
  stateDoc,
}: DraftListItemProps) {
  const [selected, setSelected] = useState(false);
  const ref = useUpdateAnimation(disabled, [selected]);

  useEffect(() => {
    const selected$ = stateDoc.get$("roster").pipe(
      map((r: Array<{ name: string; health: number }>) => {
        return r.map((o) => o.name).includes(model.id);
      })
    );
    const observer = selected$.subscribe((v) => {
      setSelected(v);
    });
    return () => observer?.unsubscribe();
  }, [stateDoc, model.id]);

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
  guild: Guild;
  roster: Roster;
  stateDoc: GBGameStateDoc;
  disabled?: boolean;
  // ready: (team: Model[]) => void;
  ready?: () => void;
  unready?: () => void;
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
  const { guild, ready: listReady, unready, disabled = false, style, stateDoc } = props;

  const [ready, setReady] = useState(false);

  const setting$ = useRouteLoaderData<Observable<SettingsDoc | null>>("settings");
  const [gameSize, setGameSize] = useState<3 | 4 | 6>();
  useEffect(() => {
    const sub = setting$
      ?.pipe(map((s) => s?.toJSON().data.gameSize))
      .subscribe((gs) => {
        if (gs && !disabled) {
          stateDoc.incrementalPatch({ roster: [] })
            .then(() => setGameSize(gs))
            .catch(console.error);
        } else {
          setGameSize(gs);
        }
      });
    return () => sub?.unsubscribe();
  }, [setting$, stateDoc, disabled]);

  const [oldRoster, setRoster] = useState(props.roster);
  const roster = structuredClone(oldRoster);

  useEffect(() => {
    if (!gameSize) { return; }
    const observer = stateDoc.roster$
      .pipe(map(l => l.map(m => m.name)))
      .subscribe((r) => {
        const roster = structuredClone(oldRoster);
        const lineup = roster
          .filter((m) => r.includes(m.id))
          .filter((m) => !m.benched);
        // model categories limit checks
        const captainSet = lineup.filter((m) => m.captain).length === DraftLimits[gameSize].captain;
        const mascotSet = lineup.filter((m) => m.mascot).length === DraftLimits[gameSize].mascot;
        const squaddiesSet = lineup.filter((m) => !m.captain && !m.mascot).length === DraftLimits[gameSize].squaddies;
        const isReady = captainSet && mascotSet && squaddiesSet;
        setReady(isReady);
        // reset and re-calculate the disabled counts of each model
        for (const m of roster) {
          m.disabled = 0;
          const selected = r.includes(m.id);
          if (m.benched) { m.disabled += 1; }
          if (captainSet && m.captain && !selected) { m.disabled += 1; }
          if (mascotSet && m.mascot && !selected) { m.disabled += 1; }
          if (squaddiesSet && !m.captain && !m.mascot && !selected) { m.disabled += 1; }
        }
        // process disabled counts for veteran models (seasoned models so far are always on a different guild)
        for (const v of roster.filter(m => m.veteran)) {
          const vSelected = r.includes(v.id);
          for (const o of roster.filter(m => m.name === v.name && m !== v)) {
            const oSelected = r.includes(o.id);
            if (oSelected) { v.disabled += 1; }
            if (vSelected) { o.disabled += 1; }
          }
          // vGreede and Avarisse
          for (const o of roster.filter(m => m.dehcneb === v.name)) {
            const oSelected = r.includes(o.id);
            if (oSelected) { v.disabled += 1; }
            if (vSelected) { o.disabled += 1; }
          }
        }
        // only make automatic changes if !disabled (not network opponent)
        if (!disabled) {
          let needsUpdate = false;
          let updatedLineup = structuredClone(stateDoc.getLatest().roster);
          // make sure selected state of benched models is correct
          for (const m of roster.filter(m => m.benched)) {
            const o = roster.find(o => o.id === m.benched);
            if (!o) { continue; }
            const mSelected = r.includes(m.id);
            const oSelected = r.includes(o.id);
            if (oSelected && !mSelected) {
              needsUpdate = true;
              updatedLineup.push({ name: m.id, health: m.hp });
            }
            if (!oSelected && mSelected) {
              needsUpdate = true;
              updatedLineup = updatedLineup.filter((_m) => _m.name != m.id);
            }
          }
          // force selection of Captain and Mascot for minor guilds
          if (guild.minor) {
            for (const m of roster) {
              if (m.captain || (m.mascot && !m.disabled)) {
                if (!r.includes(m.id)) {
                  needsUpdate = true;
                  updatedLineup.push({ name: m.id, health: m.hp });
                }
              }
            }
          }
          if (needsUpdate) {
            stateDoc.incrementalPatch({ roster: updatedLineup }).catch(console.error);
          }
        }
        setRoster(roster);
      });
    return () => observer?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSize]);

  useEffect(() => {
    if (ready && roster) {
      // const team = structuredClone(roster.filter((m: DraftModel) => m.selected));
      // listReady?.(team);
      listReady?.();
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
      badgeContent={ready ? <Check color="success" /> : null}
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
              stateDoc={stateDoc}
              disabled={disabled}
            />
          ))}
          <span>Mascots :</span>
          {mascots.map((m: DraftModel) => (
            <DraftListItem
              key={m.id}
              model={m}
              stateDoc={stateDoc}
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
              stateDoc={stateDoc}
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
              stateDoc={stateDoc}
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
  const { guild, ready: listReady, unready, disabled = false, style, stateDoc } = props;

  const [ready, setReady] = useState(false);

  const setting$ = useRouteLoaderData<Observable<SettingsDoc | null>>("settings");
  const [gameSize, setGameSize] = useState<3 | 4 | 6>();
  useEffect(() => {
    const sub = setting$
      ?.pipe(map((s) => s?.toJSON().data.gameSize))
      .subscribe((gs) => {
        if (gs && !disabled) {
          stateDoc.incrementalPatch({ roster: [] })
            .then(() => setGameSize(gs))
            .catch(console.error);
        } else {
          setGameSize(gs);
        }
      });
    return () => sub?.unsubscribe();
  }, [setting$, stateDoc, disabled]);

  const [oldRoster, setRoster] = useState(props.roster);
  const roster = structuredClone(oldRoster);

  useEffect(() => {
    if (!gameSize) { return; }
    const observer = stateDoc.roster$
      .pipe(map(l => l.map(m => m.name)))
      .subscribe((r) => {
        const roster = structuredClone(oldRoster);
        const lineup = roster
          .filter((m) => r.includes(m.id))
          .filter((m) => !m.benched);
        // model categories limit checks
        const masterSet = lineup.filter((m) => m.captain).length === BSDraftLimits[gameSize].master;
        const apprenticeSet = lineup.filter((m) => !m.captain).length === BSDraftLimits[gameSize].apprentice;
        const isReady = masterSet && apprenticeSet;
        setReady(isReady);
        // reset and re-calculate the disabled counts of each model
        for (const m of roster) {
          m.disabled = 0;
          const selected = r.includes(m.id);
          if (masterSet && m.captain && !selected) { m.disabled += 1; }
          if (apprenticeSet && !m.captain && !selected) { m.disabled += 1; }
        }
        // process disabled counts for veteran models (seasoned models so far are always on a different guild)
        for (const v of roster.filter(m => m.veteran)) {
          const vSelected = r.includes(v.id);
          for (const o of roster.filter(m => m.name === v.name && m !== v)) {
            const oSelected = r.includes(o.id);
            if (oSelected) { v.disabled += 1; }
            if (vSelected) { o.disabled += 1; }
          }
        }
        setRoster(roster);
      });
    return () => observer?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSize]);

  useEffect(() => {
    if (ready && roster) {
      // const team = structuredClone(roster.filter((m: DraftModel) => m.selected));
      // listReady?.(team);
      listReady?.();
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
      badgeContent={ready ? <Check color="success" /> : null}
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
              stateDoc={stateDoc}
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
              stateDoc={stateDoc}
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
              stateDoc={stateDoc}
              disabled={disabled}
            />
          ))}
        </div>
      </Card>
    </StyledBadge>
  );
};
