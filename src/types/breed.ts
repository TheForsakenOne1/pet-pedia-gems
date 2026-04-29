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
  /** Lowercased temperament traits, useful for search + filter chips */
  temperament: string[];
  /** Normalized category tags (e.g. "working", "hypoallergenic", "low-shedding") */
  tags: string[];
  /** Breed group / classification (e.g. "Working", "Toy", "Hairless") */
  group: string;
}

export interface BreedDetail extends BreedSummary {
  lifespan: string;
  size: string;
  weight: string;
  coat: string;
  colors: string;
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
