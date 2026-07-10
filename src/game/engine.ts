import { ADJACENCY, CITY_SEEDS } from "./data";
import type { Bastion, BattleReport, City, FactionId, GameState, OwnerId } from "./types";

const opponentOf = (faction: FactionId): FactionId => (faction === "chatou" ? "imperiale" : "chatou");

export function createInitialState(): GameState {
  const cities = Object.fromEntries(
    CITY_SEEDS.map((seed) => {
      const bastions = Array.from({ length: seed.bastions }, (_, index) => ({
        id: `${seed.id}-b${index + 1}`,
        cityId: seed.id,
        owner: seed.faction,
        soldiers: seed.soldiers,
        isCapital: index === 0
      }));
      const city: City = {
        id: seed.id,
        name: seed.name,
        originalFaction: seed.faction,
        owner: seed.faction,
        polygon: seed.polygon,
        label: seed.label,
        bastions
      };
      return [seed.id, city];
    })
  );

  return {
    cities,
    turn: "chatou",
    selectedFaction: null,
    humanFaction: null,
    phase: "home",
    selectedCityId: null,
    selectedBastionId: null,
    targetCityId: null,
    targetBastionId: null,
    pendingCapitalCityId: null,
    winner: null,
    message: "Choisissez votre faction pour déclarer la guerre.",
    log: ["Prêt pour la guerre."],
    lastBattle: null
  };
}

export function getCity(state: GameState, cityId: string | null): City | null {
  return cityId ? state.cities[cityId] ?? null : null;
}

export function getBastion(state: GameState, bastionId: string | null): Bastion | null {
  if (!bastionId) return null;
  for (const city of Object.values(state.cities)) {
    const bastion = city.bastions.find((candidate) => candidate.id === bastionId);
    if (bastion) return bastion;
  }
  return null;
}

export function areNeighbors(cityA: string, cityB: string) {
  return ADJACENCY[cityA]?.includes(cityB) ?? false;
}



export function activeBastions(city: City) {
  return city.bastions.filter((bastion) => bastion.soldiers > 0);
}

export function commandableBastions(city: City, owner: FactionId) {
  return activeBastions(city).filter((bastion) => bastion.owner === owner && !bastion.isCapital);
}

export function canExchange(state: GameState, sourceCityId: string, sourceBastionId: string, targetCityId: string) {
  const source = state.cities[sourceCityId];
  const target = state.cities[targetCityId];
  const sourceBastion = source?.bastions.find((bastion) => bastion.id === sourceBastionId);
  return Boolean(
    source &&
      target &&
      source.owner === state.turn &&
      target.owner === state.turn &&
      areNeighbors(sourceCityId, targetCityId) &&
      sourceBastion &&
      !sourceBastion.isCapital &&
      (activeBastions(target).some((bastion) => !bastion.isCapital && bastion.owner === state.turn) ||
       target.bastions.some((bastion) => bastion.soldiers === 0 && bastion.owner === state.turn && !bastion.isCapital))
  );
}

export function canAttack(state: GameState, sourceCityId: string, sourceBastionId: string, targetCityId: string) {
  const source = state.cities[sourceCityId];
  const target = state.cities[targetCityId];
  const sourceBastion = source?.bastions.find((bastion) => bastion.id === sourceBastionId);
  
  // Vérifier s'il y a des bastions ennemis ou sans contrôle dans la cible
  const hasEnemyOrUncontrolledBastions = activeBastions(target).some(
    (bastion) => bastion.owner !== state.turn
  );
  
  return Boolean(
    source &&
      target &&
      source.owner === state.turn &&
      target.owner !== state.turn &&
      areNeighbors(sourceCityId, targetCityId) &&
      activeBastions(source).length >= 2 &&
      sourceBastion &&
      sourceBastion.owner === state.turn &&
      !sourceBastion.isCapital &&
      sourceBastion.soldiers >= 10 &&
      hasEnemyOrUncontrolledBastions
  );
}

export function selectableEnemyTargets(city: City) {
  return activeBastions(city);
}

export function validCapitalRelocations(city: City, attackedCapitalId: string) {
  return activeBastions(city).filter((bastion) => bastion.id !== attackedCapitalId && bastion.soldiers > 0);
}

function cloneCities(cities: Record<string, City>): Record<string, City> {
  return Object.fromEntries(
    Object.values(cities).map((city) => [
      city.id,
      {
        ...city,
        bastions: city.bastions.map((bastion) => ({ ...bastion }))
      }
    ])
  );
}

function normalizeCityOwner(city: City) {
  const living = activeBastions(city);
  if (living.length === 0) {
    city.owner = "uncontrolled";
    return;
  }

  const capital = living.find((bastion) => bastion.isCapital);
  city.owner = capital?.owner ?? living[0].owner;
}

function removeDestroyed(city: City) {
  // Les bastions ne sont plus supprimés - ils restent à 0 soldat
  normalizeCityOwner(city);
}

function checkWinner(cities: Record<string, City>): FactionId | null {
  const hasCapital = (owner: FactionId) =>
    Object.values(cities).some((city) => city.bastions.some((bastion) => bastion.owner === owner && bastion.isCapital));

  if (!hasCapital("chatou")) return "imperiale";
  if (!hasCapital("imperiale")) return "chatou";
  return null;
}

function finishTurn(state: GameState, cities: Record<string, City>, message: string, report: BattleReport | null = null): GameState {
  const winner = checkWinner(cities);
  return {
    ...state,
    cities,
    turn: winner ? state.turn : opponentOf(state.turn),
    phase: winner ? "game-over" : "select-source",
    selectedCityId: null,
    selectedBastionId: null,
    targetCityId: null,
    targetBastionId: null,
    pendingCapitalCityId: null,
    winner,
    message: winner ? `${winner === "chatou" ? "Chatou" : "Ville Impériale"} remporte la partie.` : message,
    lastBattle: report,
    log: [message, ...state.log].slice(0, 8)
  };
}

export function exchangeBastions(state: GameState, targetBastionId: string): GameState {
  const sourceCityId = state.selectedCityId;
  const sourceBastionId = state.selectedBastionId;
  const targetCityId = state.targetCityId;
  if (!sourceCityId || !sourceBastionId || !targetCityId || !canExchange(state, sourceCityId, sourceBastionId, targetCityId)) {
    return { ...state, message: "Échange impossible selon les règles." };
  }

  const cities = cloneCities(state.cities);
  const sourceCity = cities[sourceCityId];
  const targetCity = cities[targetCityId];
  const sourceBastion = sourceCity.bastions.find((bastion) => bastion.id === sourceBastionId);
  const targetBastion = targetCity.bastions.find((bastion) => bastion.id === targetBastionId);

  if (!sourceBastion || !targetBastion || targetBastion.isCapital || targetBastion.owner !== state.turn) {
    return { ...state, message: "Le bastion choisi ne peut pas être échangé." };
  }

  sourceCity.bastions = sourceCity.bastions.filter((bastion) => bastion.id !== sourceBastion.id);
  targetCity.bastions = targetCity.bastions.filter((bastion) => bastion.id !== targetBastion.id);
  sourceBastion.cityId = targetCity.id;
  targetBastion.cityId = sourceCity.id;
  sourceCity.bastions.push(targetBastion);
  targetCity.bastions.push(sourceBastion);
  normalizeCityOwner(sourceCity);
  normalizeCityOwner(targetCity);

  return finishTurn(state, cities, `${sourceCity.name} et ${targetCity.name} ont échangé un bastion.`);
}

export function relocateCapital(state: GameState, newCapitalId: string): GameState {
  const cityId = state.pendingCapitalCityId;
  const attackedCapitalId = state.targetBastionId;
  const city = getCity(state, cityId);
  if (!city || !attackedCapitalId) return state;
  const valid = validCapitalRelocations(city, attackedCapitalId).some((bastion) => bastion.id === newCapitalId);
  if (!valid) return { ...state, message: "Cette destination de capitale est invalide." };

  const cities = cloneCities(state.cities);
  const clonedCity = cities[city.id];
  clonedCity.bastions = clonedCity.bastions.map((bastion) => ({
    ...bastion,
    isCapital: bastion.id === newCapitalId
  }));

  return {
    ...state,
    cities,
    phase: "confirm-attack",
    pendingCapitalCityId: null,
    message: `La capitale de ${clonedCity.name} a été déplacée.`
  };
}

export function prepareAttack(state: GameState, targetBastionId: string): GameState {
  const sourceCityId = state.selectedCityId;
  const sourceBastionId = state.selectedBastionId;
  const targetCityId = state.targetCityId;
  if (!sourceCityId || !sourceBastionId || !targetCityId || !canAttack(state, sourceCityId, sourceBastionId, targetCityId)) {
    return { ...state, message: "Attaque impossible selon les règles." };
  }

  const targetCity = state.cities[targetCityId];
  const targetBastion = targetCity.bastions.find((bastion) => bastion.id === targetBastionId);
  if (!targetBastion) return { ...state, message: "Bastion cible introuvable." };

  if (targetBastion.isCapital) {
    const relocationTargets = validCapitalRelocations(targetCity, targetBastion.id);
    if (relocationTargets.length > 0) {
      return {
        ...state,
        targetBastionId,
        pendingCapitalCityId: targetCityId,
        phase: "capital-relocation",
        message: "Votre capitale est attaquée. Choisissez un nouveau bastion pour la déplacer."
      };
    }
  }

  return { ...state, targetBastionId, phase: "confirm-attack", message: "Confirmez l'attaque." };
}

export function resolveAttack(state: GameState): GameState {
  const sourceCityId = state.selectedCityId;
  const sourceBastionId = state.selectedBastionId;
  const targetCityId = state.targetCityId;
  const targetBastionId = state.targetBastionId;
  if (!sourceCityId || !sourceBastionId || !targetCityId || !targetBastionId) return state;

  const cities = cloneCities(state.cities);
  const sourceCity = cities[sourceCityId];
  const targetCity = cities[targetCityId];
  const attacker = sourceCity.bastions.find((bastion) => bastion.id === sourceBastionId);
  const defender = targetCity.bastions.find((bastion) => bastion.id === targetBastionId);

  if (!attacker || !defender) return { ...state, message: "Combat impossible : bastion manquant." };

  const report: BattleReport = {
    attackerLoss: 0,
    defenderLoss: 0,
    attackerDestroyed: false,
    defenderDestroyed: false
  };

  if (defender.isCapital) {
    const alternatives = validCapitalRelocations(targetCity, defender.id);
    if (alternatives.length === 0) {
      defender.isCapital = false;
      defender.owner = "uncontrolled";
      targetCity.owner = "uncontrolled";
      report.capitalDestroyed = targetCity.name;
    }
  }

  report.attackerLoss = defender.soldiers < 10 ? 0 : Math.floor(defender.soldiers * 0.1);
  report.defenderLoss = attacker.soldiers < 10 ? 0 : Math.floor(attacker.soldiers * 0.1);

  attacker.soldiers = Math.max(0, attacker.soldiers - report.attackerLoss);
  defender.soldiers = Math.max(0, defender.soldiers - report.defenderLoss);
  report.attackerDestroyed = attacker.soldiers === 0;
  report.defenderDestroyed = defender.soldiers === 0;

  // Les bastions ne sont plus supprimés - ils restent à 0 soldat
  // Les bastions à 0 soldat deviennent inactifs mais restent présents

  if (targetCity.bastions.length === 0 && !report.attackerDestroyed) {
    sourceCity.bastions = sourceCity.bastions.filter((bastion) => bastion.id !== attacker.id);
    attacker.cityId = targetCity.id;
    attacker.owner = state.turn;
    attacker.isCapital = true;
    targetCity.bastions.push(attacker);
    targetCity.owner = state.turn;
    report.conqueredCity = targetCity.name;
  } else if (activeBastions(targetCity).length === 0 && targetCity.bastions.length > 0 && !report.attackerDestroyed) {
    // Si tous les bastions actifs ont été détruits mais qu'il en reste à 0 soldat,
    // l'attaquant ne conquiert pas la ville, elle devient sans contrôle
    sourceCity.bastions = sourceCity.bastions.filter((bastion) => bastion.id !== attacker.id);
    attacker.cityId = targetCity.id;
    attacker.owner = state.turn;
    attacker.isCapital = true;
    targetCity.bastions.push(attacker);
    targetCity.owner = state.turn;
    report.conqueredCity = targetCity.name;
  }

  removeDestroyed(sourceCity);
  removeDestroyed(targetCity);

  if (activeBastions(targetCity).length === 0 && !report.attackerDestroyed) {
    targetCity.owner = "uncontrolled";
  }

  const messageParts = [
    `${sourceCity.name} attaque ${targetCity.name}`,
    `pertes: ${report.attackerLoss} / ${report.defenderLoss}`
  ];
  if (report.capitalDestroyed) messageParts.push(`capitale détruite à ${report.capitalDestroyed}`);
  if (report.conqueredCity) messageParts.push(`${report.conqueredCity} conquise`);

  return finishTurn(state, cities, messageParts.join(" - "), report);
}

export function countFactionCapitals(state: GameState, faction: FactionId) {
  return Object.values(state.cities).reduce(
    (count, city) => count + city.bastions.filter((bastion) => bastion.owner === faction && bastion.isCapital).length,
    0
  );
}

export function totalSoldiers(city: City) {
  return city.bastions.reduce((total, bastion) => total + bastion.soldiers, 0);
}

export function ownerName(owner: OwnerId) {
  if (owner === "chatou") return "Chatou";
  if (owner === "imperiale") return "Ville Impériale";
  return "Sans commandement";
}
