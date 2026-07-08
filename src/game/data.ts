import type { CitySeed, FactionId } from "./types";

export const FACTIONS: Record<FactionId, { name: string; shortName: string; color: string }> = {
  chatou: { name: "Faction Chatou", shortName: "Chatou", color: "#148ac7" },
  imperiale: {
    name: "Faction Saint-Germain-en-Laye",
    shortName: "Ville Imperiale",
    color: "#d7362e"
  }
};

export const CITY_SEEDS: CitySeed[] = [
  {
    id: "chatou",
    name: "Chatou",
    faction: "chatou",
    bastions: 5,
    soldiers: 5836,
    polygon: "55,66 58,61 62,58 66,60 69,66 68,73 63,78 58,76 56,71",
    label: { x: 64, y: 69 }
  },
  {
    id: "croissy",
    name: "Croissy-sur-Seine",
    faction: "chatou",
    bastions: 3,
    soldiers: 3023,
    polygon: "55,75 62,77 69,74 72,82 69,88 62,90 56,84",
    label: { x: 64, y: 81 }
  },
  {
    id: "houilles",
    name: "Houilles",
    faction: "chatou",
    bastions: 4,
    soldiers: 7551,
    polygon: "73,43 80,42 85,43 88,49 86,55 80,58 73,55 70,49",
    label: { x: 80, y: 50 }
  },
  {
    id: "carrieres",
    name: "Carrieres-sur-Seine",
    faction: "chatou",
    bastions: 5,
    soldiers: 2996,
    polygon: "68,57 75,56 82,58 87,64 84,69 77,73 70,68 66,63",
    label: { x: 77, y: 64 }
  },
  {
    id: "montesson",
    name: "Montesson",
    faction: "chatou",
    bastions: 7,
    soldiers: 1972,
    polygon: "53,42 60,40 67,38 71,45 74,53 69,60 64,66 57,62 51,57 49,50",
    label: { x: 61, y: 53 }
  },
  {
    id: "mesnil",
    name: "Le Mesnil-le-Roi",
    faction: "chatou",
    bastions: 3,
    soldiers: 1933,
    polygon: "56,29 61,25 65,28 67,36 63,43 57,42 54,36",
    label: { x: 60, y: 35 }
  },
  {
    id: "bezons",
    name: "Bezons",
    faction: "chatou",
    bastions: 4,
    soldiers: 9108,
    polygon: "85,43 91,40 96,42 99,48 95,54 90,58 86,53",
    label: { x: 91, y: 49 }
  },
  {
    id: "louveciennes",
    name: "Louveciennes",
    faction: "chatou",
    bastions: 5,
    soldiers: 1598,
    polygon: "47,84 54,83 58,88 57,96 51,100 44,94 43,89",
    label: { x: 51, y: 91 }
  },
  {
    id: "marly",
    name: "Marly-le-Roi",
    faction: "chatou",
    bastions: 7,
    soldiers: 2393,
    polygon: "36,82 44,82 49,89 48,96 40,99 32,94 30,88",
    label: { x: 41, y: 91 }
  },
  {
    id: "saint-germain",
    name: "Saint-Germain-en-Laye",
    faction: "imperiale",
    bastions: 52,
    soldiers: 854,
    polygon: "26,4 48,3 62,6 68,14 68,22 62,24 57,29 55,38 53,47 50,56 45,65 38,72 31,72 25,66 20,57 18,49 20,39 24,31 25,22",
    label: { x: 42, y: 39 }
  },
  {
    id: "vesinet",
    name: "Le Vesinet",
    faction: "imperiale",
    bastions: 5,
    soldiers: 3129,
    polygon: "51,64 57,60 62,66 62,72 57,77 51,74 49,69",
    label: { x: 55, y: 72 }
  },
  {
    id: "pecq",
    name: "Le Pecq",
    faction: "imperiale",
    bastions: 3,
    soldiers: 5575,
    polygon: "43,68 49,63 52,69 51,76 47,81 43,77",
    label: { x: 47, y: 72 }
  },
  {
    id: "port-marly",
    name: "Port-Marly",
    faction: "imperiale",
    bastions: 2,
    soldiers: 3894,
    polygon: "47,76 52,76 56,82 53,87 48,86 45,82",
    label: { x: 50, y: 81 }
  },
  {
    id: "sartrouville",
    name: "Sartrouville",
    faction: "imperiale",
    bastions: 8,
    soldiers: 6054,
    polygon: "65,23 75,24 84,25 91,31 91,38 86,43 77,43 69,39 63,31",
    label: { x: 76, y: 37 }
  },
  {
    id: "maisons",
    name: "Maisons-Laffitte",
    faction: "imperiale",
    bastions: 7,
    soldiers: 3419,
    polygon: "62,14 72,14 79,17 82,24 78,29 70,31 63,25",
    label: { x: 70, y: 24 }
  },
  {
    id: "mareil",
    name: "Mareil-Marly",
    faction: "imperiale",
    bastions: 2,
    soldiers: 2070,
    polygon: "37,72 44,72 47,79 43,84 37,84 34,78",
    label: { x: 40, y: 79 }
  },
  {
    id: "etang",
    name: "L'Etang-la-Ville",
    faction: "imperiale",
    bastions: 5,
    soldiers: 1031,
    polygon: "28,82 36,81 40,89 38,96 32,100 25,94 23,88",
    label: { x: 31, y: 91 }
  },
  {
    id: "chambourcy",
    name: "Chambourcy",
    faction: "imperiale",
    bastions: 8,
    soldiers: 730,
    polygon: "16,57 25,55 30,64 27,72 23,79 15,75 12,66",
    label: { x: 22, y: 67 }
  },
  {
    id: "aigremont",
    name: "Aigremont",
    faction: "imperiale",
    bastions: 4,
    soldiers: 268,
    polygon: "7,60 16,57 14,66 15,73 8,76 3,70",
    label: { x: 11, y: 66 }
  }
];

export const ADJACENCY: Record<string, string[]> = {
  chatou: ["croissy", "vesinet", "carrieres", "montesson"],
  croissy: ["chatou", "vesinet", "port-marly", "marly", "louveciennes"],
  houilles: ["bezons", "carrieres", "montesson", "sartrouville"],
  carrieres: ["houilles", "bezons", "chatou", "montesson", "sartrouville"],
  montesson: ["chatou", "carrieres", "houilles", "mesnil", "sartrouville", "vesinet", "saint-germain"],
  mesnil: ["montesson", "saint-germain", "maisons", "sartrouville"],
  bezons: ["houilles", "carrieres"],
  louveciennes: ["marly", "croissy", "etang"],
  marly: ["louveciennes", "croissy", "etang", "mareil", "port-marly"],
  "saint-germain": [
    "aigremont",
    "chambourcy",
    "etang",
    "mareil",
    "pecq",
    "vesinet",
    "montesson",
    "mesnil",
    "maisons",
    "sartrouville"
  ],
  vesinet: ["chatou", "croissy", "montesson", "pecq", "port-marly", "saint-germain"],
  pecq: ["saint-germain", "vesinet", "port-marly", "mareil"],
  "port-marly": ["vesinet", "pecq", "marly", "croissy", "mareil"],
  sartrouville: ["maisons", "mesnil", "montesson", "carrieres", "houilles", "saint-germain"],
  maisons: ["saint-germain", "mesnil", "sartrouville"],
  mareil: ["saint-germain", "pecq", "port-marly", "marly", "etang"],
  etang: ["saint-germain", "mareil", "marly", "louveciennes", "chambourcy"],
  chambourcy: ["aigremont", "saint-germain", "etang"],
  aigremont: ["chambourcy", "saint-germain"]
};
