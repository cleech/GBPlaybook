export interface DataFile {
  Guilds: Guild[];
  Models: Model[];
  "Character Plays": CharacterPlay[];
  "Character Traits": CharacterTrait[];
}

export interface Guild {
  name: string;
  minor: boolean;
  color: string;
  shadow?: string;
  darkColor?: string;
  roster: string[];
}

type TupleOf<T, N extends number> = [T, ...T[]] & { length: N };
type Playbook = TupleOf<TupleOf<string | null, 7>, 2>;

export interface Model {
  id: string;
  name: string;
  guild1: string;
  guild2?: string;
  captain?: boolean;
  mascot?: boolean;
  veteran?: boolean;
  seasoned?: boolean;
  hp: number;
  recovery: number;
  jog: number;
  sprint: number;
  tac: number;
  kickdice: number;
  kickdist: number;
  def: number;
  arm: number;
  inf: number;
  infmax: number;
  base: 30 | 40 | 50;
  reach?: boolean;
  character_plays: string[];
  character_traits: string[];
  heroic?: string;
  legendary?: string;
  types: string;
  playbook: Playbook;
  //
  gbcp?: boolean;
  benched?: string;
  dehcneb?: string;
}

export interface CharacterPlay {
  name: string;
  text: string;
  CST: string;
  RNG: string;
  SUS: boolean;
  OPT: boolean;
}

export interface CharacterTrait {
  name: string;
  active?: boolean;
  text: string;
}

export interface Manifest {
  timestamp: string;
  datafiles: {
    version: number;
    description: string;
    filename: string;
    sha256: string;
    timestamp: string;
    translations: {
      [key: string]: {
        filename: string;
        sha256: string;
        timestamp: string;
      };
    };
  }[];
}

export interface GBDataMeta {
  version: number;
  filename: string;
  sha256: string;
}

export interface Gameplan {
  title: string;
  text: string;
  detail?: string;
  initiative: number;
  influence: number;
}
