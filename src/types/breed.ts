export type Species = "dog" | "cat";

export interface BreedSummary {
  slug: string;
  name: string;
  species: Species;
  tagline: string;
  origin: string;
  intro: string;
  image: string; // url
  issueNo: string;
}

export interface BreedDetail extends BreedSummary {
  group: string;
  lifespan: string;
  size: string;
  weight: string;
  coat: string;
  colors: string;
  temperament: string[];
  energy: number;
  affection: number;
  trainability: number;
  grooming: number;
  shedding: number;
  goodWithKids: number;
  history: string;
  personality: string;
  care: string;
  health: string;
  funFacts: string[];
  yearRecognized: string;
  wikipediaUrl?: string;
  referenceUrl?: string;
}
