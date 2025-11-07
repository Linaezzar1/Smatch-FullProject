import { Tournament } from './Tournament';
import { Team } from './Team';

export interface Set {
  [key: string]: number;
}

export interface TournamentMatch {
  _id?: string;
  tournament: string | Tournament;
  round: number;
  matchNumber: number;
  groupName?: string | null;
  team1?: string | Team | null;
  team2?: string | Team | null;
  sets: Set[];
  terrainType: string; 
  maxSets: number;
  nextMatch?: string | TournamentMatch | null;
}
