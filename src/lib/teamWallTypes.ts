import type { UserId } from "./types";

export interface ReactionCounts {
  heart: number;
  clap: number;
  fire: number;
}

export interface TeamMessage {
  id: string;
  userId: UserId;
  text: string;
  createdAt: string; // ISO timestamp
  reactions: ReactionCounts;
}
