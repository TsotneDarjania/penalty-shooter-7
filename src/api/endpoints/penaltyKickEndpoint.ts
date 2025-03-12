import { Endpoint } from "../api.ts";

export type PenaltyKickResponse = {
  isGoal: true;
  gameState: string;
  goalsScored: number;
  kicksRemaining: number;
  requiredGoalsToWin: number;
};

export class PenaltyKickEndpoint extends Endpoint<
  PenaltyKickResponse,
  undefined
> {
  constructor() {
    super(undefined);
  }
  baseUrl?: string;
  method: "GET" | "POST" = "POST";
  path: string = `/Game/PenaltyKick`;
}
