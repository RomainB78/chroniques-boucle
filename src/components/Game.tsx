import { Check, Crown, RotateCcw, ScrollText, Shield, Swords, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FACTIONS } from "@/game/data";
import {
  activeBastions,
  canAttack,
  canExchange,
  commandableBastions,
  countFactionCapitals,
  createInitialState,
  exchangeBastions,
  getBastion,
  getCity,
  ownerName,
  prepareAttack,
  relocateCapital,
  resolveAttack,
  selectableEnemyTargets,
  totalSoldiers
} from "@/game/engine";
import type { ActionKind, Bastion, City, FactionId, GameState } from "@/game/types";

const factionOrder: FactionId[] = ["imperiale", "chatou"];

export function Game() {
  const [state, setState] = useState<GameState>(() => createInitialState());
  const [rulesOpen, setRulesOpen] = useState(false);
  const selectedCity = getCity(state, state.selectedCityId);
  const targetCity = getCity(state, state.targetCityId);
  const selectedBastion = getBastion(state, state.selectedBastionId);

  const cityClass = (city: City) => {
    const classes = ["territory", city.owner === "chatou" ? "blue" : city.owner === "imperiale" ? "red" : "neutral"];
    if (city.id === state.selectedCityId) classes.push("selected");
    if (city.id === state.targetCityId) classes.push("targeted");
    if (isCityClickable(state, city)) classes.push("clickable");
    return classes.join(" ");
  };

  function patch(next: Partial<GameState>) {
    setState((current) => ({ ...current, ...next }));
  }

  function resetGame() {
    setState(createInitialState());
  }


  function startWar() {
    if (!state.selectedFaction) return;
    patch({
      phase: "select-source",
      humanFaction: state.selectedFaction,
      turn: state.selectedFaction,
      message: `${FACTIONS[state.selectedFaction].shortName} ouvre la campagne.`
    });
  }

  function selectFaction(faction: FactionId) {
    patch({ selectedFaction: faction, message: `${FACTIONS[faction].shortName} selectionnée.` });
  }

  function handleCityClick(city: City) {
    if (state.phase === "select-source" && city.owner === state.turn && commandableBastions(city, state.turn).length > 0) {
      patch({
        selectedCityId: city.id,
        selectedBastionId: null,
        targetCityId: null,
        targetBastionId: null,
        phase: "select-action",
        message: `${city.name}: choisissez un bastion.`
      });
      return;
    }

    if (state.phase === "select-exchange-city" && selectedCity && canExchange(state, selectedCity.id, state.selectedBastionId ?? "", city.id)) {
      patch({ targetCityId: city.id, phase: "select-exchange-bastion", message: `${city.name}: choisissez le bastion à recevoir.` });
      return;
    }

    if (state.phase === "select-attack-city" && selectedCity && canAttack(state, selectedCity.id, state.selectedBastionId ?? "", city.id)) {
      patch({ targetCityId: city.id, phase: "select-target-bastion", message: `${city.name}: choisissez le bastion cible.` });
    }
  }

  function chooseBastion(bastion: Bastion) {
    if (!selectedCity) return;
    if (state.phase === "select-action" && !bastion.isCapital && bastion.owner === state.turn) {
      patch({ selectedBastionId: bastion.id, message: `Bastion ${bastion.soldiers.toLocaleString("fr-FR")} soldats prêt.` });
      return;
    }

    if (state.phase === "select-exchange-bastion") {
      setState((current) => exchangeBastions({ ...current, targetBastionId: bastion.id }, bastion.id));
      return;
    }

    if (state.phase === "select-target-bastion") {
      setState((current) => prepareAttack(current, bastion.id));
    }
  }

  function chooseAction(action: ActionKind) {
    if (!selectedCity || !selectedBastion) return;
    if (action === "exchange") {
      patch({ phase: "select-exchange-city", message: "Sélectionnez une ville alliée voisine." });
    } else {
      patch({ phase: "select-attack-city", message: "Sélectionnez une ville ennemie voisine." });
    }
  }

  function cancelFlow() {
    patch({
      phase: "select-source",
      selectedCityId: null,
      selectedBastionId: null,
      targetCityId: null,
      targetBastionId: null,
      pendingCapitalCityId: null,
      message: "Choisissez une ville commandée."
    });
  }

  const status = useMemo(() => {
    const chatouCapitals = countFactionCapitals(state, "chatou");
    const imperialeCapitals = countFactionCapitals(state, "imperiale");
    return { chatouCapitals, imperialeCapitals };
  }, [state]);

  return (
    <main className="game-shell">
      {state.phase === "home" ? (
        <section className="home">
          <MapStage state={state} cityClass={cityClass} onCityClick={handleCityClick} inert />
          <button className="icon-button options" onClick={() => setRulesOpen(true)} aria-label="Règles">
            <ScrollText />
          </button>
          <button className="icon-button quit" onClick={resetGame} aria-label="Quitter">
            <X />
          </button>
          <div className="home-center">
            <h1>Chroniques de la Boucle</h1>
            <button className="war-button" disabled={!state.selectedFaction} onClick={startWar}>
              GUERRE
            </button>
            <div className="faction-picker" aria-label="Choix de faction">
              {factionOrder.map((faction) => (
                <button
                  key={faction}
                  className={state.selectedFaction === faction ? "picked" : ""}
                  onClick={() => selectFaction(faction)}
                >
                  {FACTIONS[faction].shortName.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="battle">
          <MapStage state={state} cityClass={cityClass} onCityClick={handleCityClick} />
          <header className="hud top">
            <div>
              <span>Tour</span>
              <strong>{FACTIONS[state.turn].shortName}</strong>
            </div>
            <div>
              <span>Capitales</span>
              <strong>{status.chatouCapitals} - {status.imperialeCapitals}</strong>
            </div>
            <button className="icon-button" onClick={() => setRulesOpen(true)} aria-label="Règles">
              <ScrollText />
            </button>
            <button className="icon-button danger" onClick={resetGame} aria-label="Quitter">
              <X />
            </button>
          </header>
          <aside className="command-panel">
            <div className="message">{state.message}</div>
            {selectedCity ? (
              <CityPanel
                city={selectedCity}
                targetCity={targetCity}
                selectedBastionId={state.selectedBastionId}
                targetBastionId={state.targetBastionId}
                phase={state.phase}
                turn={state.turn}
                onBastion={chooseBastion}
                onAction={chooseAction}
                onCancel={cancelFlow}
                onRelocate={(id) => setState((current) => relocateCapital(current, id))}
                onConfirmAttack={() => setState((current) => resolveAttack(current))}
              />
            ) : (
              <div className="empty-panel">
                <Shield />
                <p>Sélectionnez une ville de votre faction pour commander un bastion.</p>
              </div>
            )}
            {state.lastBattle ? (
              <div className="battle-report">
                <strong>Dernier combat</strong>
                <span>Pertes attaquant : {state.lastBattle.attackerLoss.toLocaleString("fr-FR")}</span>
                <span>Pertes défenseur : {state.lastBattle.defenderLoss.toLocaleString("fr-FR")}</span>
              </div>
            ) : null}
            <ol className="log">
              {state.log.map((entry, index) => (
                <li key={`${entry}-${index}`}>{entry}</li>
              ))}
            </ol>
          </aside>
          {state.winner ? (
            <div className="victory">
              <Crown />
              <h2>{FACTIONS[state.winner].shortName} gagne</h2>
              <button onClick={resetGame}>
                <RotateCcw /> Rejouer
              </button>
            </div>
          ) : null}
        </section>
      )}
      {rulesOpen ? <RulesModal onClose={() => setRulesOpen(false)} /> : null}
    </main>
  );
}

function isCityClickable(state: GameState, city: City) {
  if (state.phase === "select-source") return city.owner === state.turn && commandableBastions(city, state.turn).length > 0;
  if (state.phase === "select-exchange-city" && state.selectedCityId && state.selectedBastionId) {
    return canExchange(state, state.selectedCityId, state.selectedBastionId, city.id);
  }
  if (state.phase === "select-attack-city" && state.selectedCityId && state.selectedBastionId) {
    return canAttack(state, state.selectedCityId, state.selectedBastionId, city.id);
  }
  return false;
}

function MapStage({
  state,
  cityClass,
  onCityClick,
  inert = false
}: {
  state: GameState;
  cityClass: (city: City) => string;
  onCityClick: (city: City) => void;
  inert?: boolean;
}) {
  return (
    <div className="map-stage">
      <div className="map-frame">
        <Image src="/assets/map.png" alt="Carte du jeu" fill priority sizes="100vw" />
        <svg viewBox="0 0 100 100" className="map-overlay" aria-label="Territoires" preserveAspectRatio="none">
          {Object.values(state.cities).map((city) => (
            <g key={city.id}>
              <polygon
                points={city.polygon}
                className={cityClass(city)}
                onClick={() => !inert && onCityClick(city)}
                role="button"
                aria-label={city.name}
              />
              <text x={city.label.x} y={city.label.y} className="map-label">
                {city.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function CityPanel({
  city,
  targetCity,
  selectedBastionId,
  targetBastionId,
  phase,
  turn,
  onBastion,
  onAction,
  onCancel,
  onRelocate,
  onConfirmAttack
}: {
  city: City;
  targetCity: City | null;
  selectedBastionId: string | null;
  targetBastionId: string | null;
  phase: GameState["phase"];
  turn: FactionId;
  onBastion: (bastion: Bastion) => void;
  onAction: (action: ActionKind) => void;
  onCancel: () => void;
  onRelocate: (bastionId: string) => void;
  onConfirmAttack: () => void;
}) {
  const visibleCity = phase === "select-exchange-bastion" || phase === "select-target-bastion" || phase === "capital-relocation" ? targetCity ?? city : city;
  const selected = city.bastions.find((bastion) => bastion.id === selectedBastionId);
  const exchangeReady = selected && phase === "select-action";
  const attackReady = selected && phase === "select-action" && activeBastions(city).length >= 2 && selected.soldiers >= 10;
  const relocation = phase === "capital-relocation";

  return (
    <div className="city-panel">
      <div className="city-heading">
        <div>
          <span>{ownerName(visibleCity.owner)}</span>
          <h2>{visibleCity.name}</h2>
        </div>
        <strong>{totalSoldiers(visibleCity).toLocaleString("fr-FR")}</strong>
      </div>
      <div className="bastion-list">
        {visibleCity.bastions.map((bastion) => {
          const disabled =
            phase === "select-action"
              ? bastion.isCapital || bastion.owner !== turn
              : phase === "select-exchange-bastion"
                ? bastion.isCapital || bastion.owner !== turn
                : phase === "capital-relocation"
                  ? bastion.id === targetBastionId || bastion.soldiers <= 0
                  : false;
          return (
            <button
              key={bastion.id}
              className={`bastion ${selectedBastionId === bastion.id ? "selected" : ""}`}
              disabled={disabled || phase === "confirm-attack"}
              onClick={() => (relocation ? onRelocate(bastion.id) : onBastion(bastion))}
            >
              <span>{bastion.isCapital ? <Crown /> : <Shield />}</span>
              <strong>{bastion.soldiers.toLocaleString("fr-FR")}</strong>
              <small>{bastion.owner === "uncontrolled" ? "sans ordre" : ownerName(bastion.owner)}</small>
            </button>
          );
        })}
      </div>
      <div className="panel-actions">
        {phase === "select-action" ? (
          <>
            <button disabled={!exchangeReady} onClick={() => onAction("exchange")}>
              <Shield /> Échanger
            </button>
            <button disabled={!attackReady} onClick={() => onAction("attack")}>
              <Swords /> Attaquer
            </button>
          </>
        ) : null}
        {phase === "confirm-attack" ? (
          <button className="primary-action" onClick={onConfirmAttack}>
            <Check /> Lancer l'attaque
          </button>
        ) : null}
        {phase !== "select-source" ? (
          <button className="ghost-action" onClick={onCancel}>
            <X /> Annuler
          </button>
        ) : null}
      </div>
    </div>
  );
}

function RulesModal({ onClose }: { onClose: () => void }) {
  const [page, setPage] = useState(0);
  const rules = [
    "/assets/regles1.png",
    "/assets/regles2.png",
    "/assets/regles3.png",
    "/assets/regles4.png",
    "/assets/regles5.png",
    "/assets/regles6.png"
  ];

  return (
    <div className="modal-backdrop">
      <div className="rules-modal">
        <button className="icon-button close" onClick={onClose} aria-label="Fermer">
          <X />
        </button>
        <Image src={rules[page]} alt={`Règles du jeu page ${page + 1}`} fill sizes="90vw" />
        <div className="rules-nav">
          <button disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))} aria-label="Page précédente">
            ‹
          </button>
          <span>RÈGLES {page + 1} / {rules.length}</span>
          <button
            disabled={page === rules.length - 1}
            onClick={() => setPage((current) => Math.min(rules.length - 1, current + 1))}
            aria-label="Page suivante"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
