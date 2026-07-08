export type FactionId = "chatou" | "imperiale";
export type OwnerId = FactionId | "uncontrolled";
export type Phase =
  | "home"
  | "select-source"
  | "select-action"
  | "select-exchange-city"
  | "select-exchange-bastion"
  | "confirm-exchange"
  | "select-attack-city"
  | "select-target-bastion"
  | "capital-relocation"
  | "confirm-attack"
  | "game-over";

export type ActionKind = "exchange" | "attack";

export type Bastion = {
  id: string;
  cityId: string;
  owner: OwnerId;
  soldiers: number;
  isCapital: boolean;
};

export type City = {
  id: string;
  name: string;
  originalFaction: FactionId;
  owner: OwnerId;
  polygon: string;
  label: { x: number; y: number };
  bastions: Bastion[];
};

export type BattleReport = {
  attackerLoss: number;
  defenderLoss: number;
  attackerDestroyed: boolean;
  defenderDestroyed: boolean;
  capitalDestroyed?: string;
  conqueredCity?: string;
};

export type GameState = {
  cities: Record<string, City>;
  turn: FactionId;
  selectedFaction: FactionId | null;
  humanFaction: FactionId | null;
  phase: Phase;
  selectedCityId: string | null;
  selectedBastionId: string | null;
  targetCityId: string | null;
  targetBastionId: string | null;
  pendingCapitalCityId: string | null;
  winner: FactionId | null;
  message: string;
  log: string[];
  lastBattle: BattleReport | null;
};

export type CitySeed = {
  id: string;
  name: string;
  faction: FactionId;
  bastions: number;
  soldiers: number;
  polygon: string;
  label: { x: number; y: number };
};
