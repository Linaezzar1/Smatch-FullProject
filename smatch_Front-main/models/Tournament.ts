import { User } from './User';
import { Team } from './Team';
import { TournamentMatch } from './TournamentMatch';

export type TournamentType =
  | 'SingleElimination'
  | 'DoubleElimination'
  | 'RoundRobin'
  | 'League'
  | 'GroupKnockout';

export type JoinRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface JoinRequest {
  team: string | Team;
  status: JoinRequestStatus;
  requestedAt?: string;
}

export interface Group {
  _id?: string;
  groupName: string;
  teams: Array<string | Team>;
  matches: Array<string | TournamentMatch>;
}

export interface TournamentStructure {
  matches: Array<string | TournamentMatch>;
  groups: Group[];
  rounds: number;
}

export interface Tournament {
  _id?: string;
  name: string;
  organizer: Array<string | User>;
  startDate: string; 
  endDate: string;   
  location: string;
  numberTeam: number;
  teams: Array<string | Team>;
  prize: string;
  tournamentType: TournamentType;
  joinRequests: JoinRequest[];
  structure: TournamentStructure;
  createdAt?: string; 
  updatedAt?: string;
  photo?: string;
}

//   status?: 'Ongoing' | 'Finished' | 'Upcoming';
//   image?: string;
//   description?: string;
// }
