import { User } from './User';

export interface Team {
  _id?: string;
  teamName: string;
  teamLeader: string | User | null;
  players: Array<string | User>; 
  teamType: 'quick' | 'fixed';
  createdAt?: string;
  updatedAt?: string;
  logo?: string;
}
