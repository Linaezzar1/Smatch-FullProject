import { Team } from "./Team";
import { User } from "./User";

// Types des enums
export type TerrainType = 'indoor' | 'beach';
export type JoinRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface JoinRequest {
  user: string;  // ObjectId sous forme de string
  team: string;  // ObjectId sous forme de string
  status: JoinRequestStatus;
  requestedAt: string; // ISO date string
}

export interface SetScore {
  team1Score: number;
  team2Score: number;
}

export interface Match {
  _id?: string;  // Optionnel, ajouté après création en base
  isPublic: boolean;
  creator: User;  // ObjectId string de l'utilisateur créateur
  team1: Team;    // ObjectId string équipe 1
  team2: Team;    // ObjectId string équipe 2
  joinRequests?: JoinRequest[];
  sets: SetScore[];
  terrainType: TerrainType;
  maxSets: 3 | 5;
  date: string;
  time: string;
  location: string;
  score1: number | null;
  score2: number | null;
  kind:String;
  winner: Team | null; // Peut être null si le match n'est pas encore terminé
}
