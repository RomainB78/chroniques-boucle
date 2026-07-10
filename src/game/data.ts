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
    polygon: "56,55 59,56 61,60 67,57 72,64 69,71 68,74 66,76 61,74 62,71 61,69 64,68 61,66 57,57 56,59 55,57",
    label: { x: 64, y: 69 }
  },
  {
    id: "croissy",
    name: "Croissy-sur-Seine",
    faction: "chatou",
    bastions: 3,
    soldiers: 3023,
    polygon: "50,71 52,70 52,73 56,78 58,73 66,76 66,80 62,83 58,84 54,81 51,79 51,76",
    label: { x: 64, y: 81 }
  },
  {
    id: "houilles",
    name: "Houilles",
    faction: "chatou",
    bastions: 4,
    soldiers: 7551,
    polygon: "72,40 76,37 81,39 82,44 82,48 81,50 79,51 78,50 77,51 76,49 73,51 70,44",
    label: { x: 80, y: 50 }
  },
  {
    id: "carrieres",
    name: "Carrieres-sur-Seine",
    faction: "chatou",
    bastions: 5,
    soldiers: 2996,
    polygon: "69,47 70,45 73,51 76,50 77,51 78,50 79,51 81,50 82,53 80,54 82,56 76,60 72,64 67,57 68,56 66,53 67,51 66,49",
    label: { x: 77, y: 64 }
  },
  {
    id: "montesson",
    name: "Montesson",
    faction: "chatou",
    bastions: 7,
    soldiers: 1972,
    polygon: "55,47 57,43 60,39 65,45 65,47 67,49 66,50 67,51 66,53 68,56 63,60 63,59 61,60 60,56 56,54 52,60 50,60 51,55 52,53 53,50",
    label: { x: 61, y: 53 }
  },
  {
    id: "mesnil",
    name: "Le Mesnil-le-Roi",
    faction: "chatou",
    bastions: 3,
    soldiers: 1933,
    polygon: "48,50 50,45 53,42 53,36 56,33 60,38 59,39 54,46 51,54 50,59 48,57",
    label: { x: 60, y: 35 }
  },
  {
    id: "bezons",
    name: "Bezons",
    faction: "chatou",
    bastions: 4,
    soldiers: 9108,
    polygon: "81,39 82,39 82,37 83,36 83,35 84,35 86,38 88,37 87,39 89,39 90,42 92,44 82,55 80,54 82,53 81,50 83,48",
    label: { x: 91, y: 49 }
  },
  {
    id: "louveciennes",
    name: "Louveciennes",
    faction: "chatou",
    bastions: 5,
    soldiers: 1598,
    polygon: "48,85 50,79 52,79 55,82 56,84 57,86 57,88 55,92 54,95 52,98 48,94 47,86",
    label: { x: 51, y: 91 }
  },
  {
    id: "marly",
    name: "Marly-le-Roi",
    faction: "chatou",
    bastions: 7,
    soldiers: 2393,
    polygon: "39,84 38,80 40,77 42,76 44,77 45,76 47,77 47,80 49,81 48,85 47,87 48,94 45,94 45,98 43,98 40,97 39,94 37,92 35,90 36,87",
    label: { x: 41, y: 91 }
  },
  {
    id: "saint-germain",
    name: "Saint-Germain-en-Laye",
    faction: "imperiale",
    bastions: 52,
    soldiers: 854,
    polygon: "35,33 37,27 37,20 42,13 41,6 48,8 51,6 62,6 65,7 69,12 71,16 71,19 63,19 61,23 59,23 56,33 53,36 53,42 50,45 48,54 48,57 47,58 46,65 45,69 42,71 36,71 34,76 28,77 26,79 23,77 25,72 29,65 29,61 29,58 24,51 33,40 32,38 32,36",
    label: { x: 42, y: 39 }
  },
  {
    id: "vesinet",
    name: "Le Vesinet",
    faction: "imperiale",
    bastions: 5,
    soldiers: 3129,
    polygon: "51,62 54,58 56,59 57,56 61,66 61,67 62,67 63,68 61,68 61,70 62,71 61,73 58,73 56,78 52,73 52,70",
    label: { x: 55, y: 72 }
  },
  {
    id: "pecq",
    name: "Le Pecq",
    faction: "imperiale",
    bastions: 3,
    soldiers: 5575,
    polygon: "48,58 50,60 51,61 51,65 52,69 49,71 46,72 45,74 45,76 44,77 42,75 42,71 45,69 46,63",
    label: { x: 47, y: 72 }
  },
  {
    id: "port-marly",
    name: "Port-Marly",
    faction: "imperiale",
    bastions: 2,
    soldiers: 3894,
    polygon: "45,74 46,72 49,71 51,79 50,79 49,81 47,81 47,78 45,76",
    label: { x: 50, y: 81 }
  },
  {
    id: "sartrouville",
    name: "Sartrouville",
    faction: "imperiale",
    bastions: 8,
    soldiers: 6054,
    polygon: "70,30 74,26 78,29 83,29 83,35 82,37 82,39 76,38 72,40 70,43 69,45 69,47 66,49 65,47 65,45 60,38",
    label: { x: 76, y: 37 }
  },
  {
    id: "maisons",
    name: "Maisons-Laffitte",
    faction: "imperiale",
    bastions: 7,
    soldiers: 3419,
    polygon: "59,23 61,22 63,19 75,20 73,27 68,32 59,38 56,33",
    label: { x: 70, y: 24 }
  },
  {
    id: "mareil",
    name: "Mareil-Marly",
    faction: "imperiale",
    bastions: 2,
    soldiers: 2070,
    polygon: "34,77 36,72 40,71 42,71 42,74 42,76 40,77 38,80 36,79 35,80 34,81 33,80",
    label: { x: 40, y: 79 }
  },
  {
    id: "etang",
    name: "L'Etang-la-Ville",
    faction: "imperiale",
    bastions: 5,
    soldiers: 1031,
    polygon: "26,79 28,77 34,76 33,80 34,81 36,79 38,80 39,84 36,87 35,90 37,92 34,94 28,89 25,87 23,83",
    label: { x: 31, y: 91 }
  },
  {
    id: "chambourcy",
    name: "Chambourcy",
    faction: "imperiale",
    bastions: 8,
    soldiers: 730,
    polygon: "14,65 16,67 20,66 20,60 19,59 19,55 24,51 29,58 29,62 29,64 25,71 23,77 16,73 10,69",
    label: { x: 22, y: 67 }
  },
  {
    id: "aigremont",
    name: "Aigremont",
    faction: "imperiale",
    bastions: 4,
    soldiers: 268,
    polygon: "19,54 19,54 17,55 14,59 11,61 9,63 7,65 10,69 14,65 16,67 20,66 20,60 19,58 19,56",
    label: { x: 11, y: 66 }
  }
];


export const ADJACENCY: Record<string, string[]> = {
  chatou: ["croissy", "vesinet", "carrieres", "montesson"],
  croissy: ["chatou", "vesinet", "port-marly", "louveciennes", "pecq"],
  houilles: ["bezons", "carrieres", "sartrouville"],
  carrieres: ["houilles", "bezons", "chatou", "montesson", "sartrouville"],
  montesson: ["chatou", "carrieres", "mesnil", "sartrouville", "vesinet", "pecq"],
  mesnil: ["montesson", "saint-germain", "maisons", "sartrouville"],
  bezons: ["houilles", "carrieres"],
  louveciennes: ["marly", "croissy", "port-marly"],
  marly: ["louveciennes", "pecq", "etang", "mareil", "port-marly"],
  "saint-germain": ["chambourcy","etang","mareil","pecq","mesnil","maisons"],
  vesinet: ["chatou", "croissy", "montesson", "pecq", "port-marly"],
  pecq: ["saint-germain", "vesinet", "port-marly", "mareil", "marly", "croissy", "montesson", "mesnil"],
  "port-marly": ["pecq", "marly", "croissy", "louveciennes"],
  sartrouville: ["maisons", "mesnil", "montesson", "carrieres", "houilles", "bezons"],
  maisons: ["saint-germain", "mesnil", "sartrouville"],
  mareil: ["saint-germain", "pecq", "marly", "etang"],
  etang: ["saint-germain", "mareil", "marly"],
  chambourcy: ["aigremont", "saint-germain"],
  aigremont: ["chambourcy"]
};