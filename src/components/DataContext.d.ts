export default interface DataFile {
  Guilds: Guild[];
  Models: Model[];
  "Character Plays": CPlay[];
  "Character Traits": CTrait[];
}

export interface Guild {
  name: string;
  minor: boolean;
  color: string;
  darkColor?: string;
  shadow?: string;
  roster: string[];
}

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
  gbcp?: boolean;
  character_plays: string[];
  character_traits: string[];
  heroic?: string;
  legendary?: string;
  types: string;
  playbook: (string | null)[][];
}

export interface CPlay {
  name: string;
  text: string;
  CST: string;
  RNG: string;
  SUS: boolean;
  OPT: boolean;
}

export interface CTrait {
  name: string;
  active: boolean;
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

export interface Gameplan {
  title: string;
  text: string;
  detail?: string;
  initiative: number;
  influence: number;
}
