import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  rut: string;
  email: string;
  phone?: string;
  birthDate?: string;
  createdAt: Timestamp;
  role: 'user' | 'admin';
  balance: number;
  withdrawableBalance: number;
  kycStatus: 'unverified' | 'pending' | 'verified';
  supercellTag?: string;
  nba2kId?: string;
  eaId?: string;
  epicId?: string;
}

export interface MatchRequest {
  id?: string;
  creatorId: string;
  creatorName: string;
  gameId: string;
  modeId: string;
  targetAmount: number;
  minAmount: number;
  maxAmount: number;
  status: 'open' | 'matched' | 'cancelled';
  createdAt: Timestamp;
}

export interface MatchOffer {
  id?: string;
  requestId: string;
  offererId: string;
  offererName: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
}

export interface ActiveMatch {
  id?: string;
  requestId: string;
  gameId: string;
  modeId: string;
  player1Id: string; // creator
  player1Name: string;
  player2Id: string; // offerer
  player2Name: string;
  agreedAmount: number;
  status: 'active' | 'resolving' | 'completed' | 'disputed' | 'cancelled';
  expiresAt: Timestamp;
  createdAt: Timestamp;
  player1Report: 'win' | 'loss' | null;
  player2Report: 'win' | 'loss' | null;
  winnerId: string | null;
}

export type GameId = 'cr' | 'nba2k' | 'fortnite' | 'fifa';

export interface GameMode {
  id: string;
  name: string;
}

export interface GameDefinition {
  id: GameId;
  name: string;
  image: string;
  modes: GameMode[];
  gradient: string;
  requiredId: keyof Pick<UserProfile, 'supercellTag' | 'nba2kId' | 'eaId' | 'epicId'>;
  idLabel: string;
}

export const GAME_DEFINITIONS: GameDefinition[] = [
  {
    id: 'cr',
    name: 'Clash Royale',
    image: '/images/clash-royale.jpg',
    modes: [{ id: '1v1', name: '1 VS 1' }, { id: '2v2', name: '2 VS 2' }],
    gradient: 'from-blue-500 to-indigo-700',
    requiredId: 'supercellTag',
    idLabel: 'Supercell Tag'
  },
  {
    id: 'nba2k',
    name: 'NBA 2K',
    image: '/images/nba2k.jpg',
    modes: [{ id: 'ps5', name: 'PS5' }, { id: 'ps4', name: 'PS4' }],
    gradient: 'from-orange-500 to-red-600',
    requiredId: 'nba2kId',
    idLabel: 'PSN / Xbox ID'
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    image: '/images/fortnite.jpg',
    modes: [{ id: 'solo', name: 'Solo' }, { id: 'duo', name: 'Dúo' }],
    gradient: 'from-purple-500 to-pink-600',
    requiredId: 'epicId',
    idLabel: 'Epic Games ID'
  },
  {
    id: 'fifa',
    name: 'EA FC / FIFA',
    image: '/images/eafc.jpg',
    modes: [{ id: '1v1', name: '1 VS 1' }],
    gradient: 'from-green-500 to-emerald-700',
    requiredId: 'eaId',
    idLabel: 'EA ID'
  }
];
