import { createServerFn } from "@tanstack/react-start";
import type { BreedDetail, BreedSummary, Species } from "@/types/breed";

// ============================================================
// In-memory cache (per server worker). Refreshes every 12h.
// ============================================================
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

interface Cache {
  fetchedAt: number;
  dogs: Record<string, RawDog>;
  cats: Record<string, RawCat>;
  dogImages: Record<string, string>;
  catImages: Record<string, string>;
  summaries: BreedSummary[];
}
let cache: Cache | null = null;
let inflight: Promise<Cache> | null = null;

interface RawDog {
  id: number;
  name: string;
  bred_for?: string;
  breed_group?: string;
  life_span?: string;
  temperament?: string;
  origin?: string;
  weight?: { metric?: string; imperial?: string };
  height?: { metric?: string; imperial?: string };
  reference_image_id?: string;
  image?: { url?: string };
}
interface RawCat {
  id: string;
  name: string;
  description?: string;
  temperament?: string;
  origin?: string;
  life_span?: string;
  weight?: { metric?: string; imperial?: string };
  alt_names?: string;
  wikipedia_url?: string;
  cfa_url?: string;
  vetstreet_url?: string;
  vcahospitals_url?: string;
  reference_image_id?: string;
  image?: { url?: string };
  adaptability?: number;
  affection_level?: number;
  child_friendly?: number;
  dog_friendly?: number;
  energy_level?: number;
  grooming?: number;
  health_issues?: number;
  intelligence?: number;
  shedding_level?: number;
  social_needs?: number;
  stranger_friendly?: number;
  vocalisation?: number;
  hairless?: number;
  hypoallergenic?: number;
  indoor?: number;
  lap?: number;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/['']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function fetchJson<T>(url: string, headers: Record<string, string>): Promise<T> {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Fetch ${url} failed: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

// Resolve dog image — prefer the API-provided image.url (the breeds endpoint
// returns it directly for most breeds), fall back to a search call only if absent.
async function resolveDogImage(b: RawDog, dogKey: string): Promise<string> {
  if (b.image?.url) return b.image.url;
  if (b.reference_image_id) {
    // Try the canonical cdn url; it returns a 200 jpg for most legacy refs
    return `https://cdn2.thedogapi.com/images/${b.reference_image_id}.jpg`;
  }
  try {
    const arr = await fetchJson<Array<{ url: string }>>(
      `https://api.thedogapi.com/v1/images/search?breed_ids=${b.id}&limit=1`,
      { "x-api-key": dogKey },
    );
    return arr[0]?.url || "";
  } catch {
    return "";
  }
}
async function resolveCatImage(b: RawCat, catKey?: string): Promise<string> {
  if (b.image?.url) return b.image.url;
  if (b.reference_image_id) return `https://cdn2.thecatapi.com/images/${b.reference_image_id}.jpg`;
  try {
    const headers: Record<string, string> = {};
    if (catKey) headers["x-api-key"] = catKey;
    const arr = await fetchJson<Array<{ url: string }>>(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${b.id}&limit=1`,
      headers,
    );
    return arr[0]?.url || "";
  } catch {
    return "";
  }
}

// ============================================================
// Tagging — derive normalized category tags for filter chips
// ============================================================
function dogTags(d: RawDog): string[] {
  const tags = new Set<string>();
  const grp = (d.breed_group || "").toLowerCase();
  const bred = (d.bred_for || "").toLowerCase();
  const temp = (d.temperament || "").toLowerCase();
  const w = parseInt((d.weight?.imperial || "").split("-")[0]?.trim() || "0", 10);

  if (grp) tags.add(grp); // working / herding / toy / sporting / hound / terrier / non-sporting
  if (/(hunt|retriev|gun|fowl|bird)/.test(bred)) tags.add("hunting");
  if (/herd|drov/.test(bred)) tags.add("herding");
  if (/guard|watch|protect/.test(bred)) tags.add("guardian");
  if (/companion|lap/.test(bred)) tags.add("companion");
  if (/sled|pulling|draft/.test(bred)) tags.add("working");
  if (/intelligent|trainable|obedient|eager/.test(temp)) tags.add("highly-trainable");
  if (/(child|family|gentle|patient|affectionate)/.test(temp)) tags.add("family-friendly");
  if (/(energetic|active|athletic|spirited)/.test(temp)) tags.add("high-energy");
  if (/(calm|docile|placid|quiet|mellow)/.test(temp)) tags.add("low-energy");
  if (w && w < 20) tags.add("small");
  else if (w && w < 55) tags.add("medium");
  else if (w && w < 90) tags.add("large");
  else if (w >= 90) tags.add("giant");
  return Array.from(tags);
}

function catTags(c: RawCat): string[] {
  const tags = new Set<string>();
  if (c.hypoallergenic) tags.add("hypoallergenic");
  if (c.hairless) tags.add("hairless");
  if (c.indoor) tags.add("indoor");
  if (c.lap) tags.add("lap-cat");
  if ((c.energy_level ?? 3) >= 4) tags.add("high-energy");
  if ((c.energy_level ?? 3) <= 2) tags.add("low-energy");
  if ((c.grooming ?? 3) <= 2) tags.add("low-grooming");
  if ((c.grooming ?? 3) >= 4) tags.add("high-grooming");
  if ((c.shedding_level ?? 3) <= 2) tags.add("low-shedding");
  if ((c.child_friendly ?? 3) >= 4) tags.add("family-friendly");
  if ((c.dog_friendly ?? 3) >= 4) tags.add("dog-friendly");
  if ((c.affection_level ?? 3) >= 4) tags.add("affectionate");
  if ((c.intelligence ?? 3) >= 4) tags.add("highly-trainable");
  return Array.from(tags);
}

function tempArr(s?: string): string[] {
  return (s || "").split(",").map(t => t.trim()).filter(Boolean);
}

// ============================================================
// Build cache from APIs
// ============================================================
async function buildCache(): Promise<Cache> {
  const dogKey = process.env.DOG_API_KEY;
  const catKey = process.env.CAT_API_KEY;
  if (!dogKey) throw new Error("DOG_API_KEY is not configured");

  const dogHeaders: Record<string, string> = { "x-api-key": dogKey };
  const catHeaders: Record<string, string> = {};
  if (catKey) catHeaders["x-api-key"] = catKey;

  const [rawDogs, rawCats] = await Promise.all([
    fetchJson<RawDog[]>("https://api.thedogapi.com/v1/breeds", dogHeaders),
    fetchJson<RawCat[]>("https://api.thecatapi.com/v1/breeds", catHeaders),
  ]);

  const dogs: Record<string, RawDog> = {};
  const dogImages: Record<string, string> = {};
  for (const d of rawDogs) {
    let slug = slugify(d.name);
    if (dogs[slug]) slug = `${slug}-${d.id}`;
    dogs[slug] = d;
  }
  const cats: Record<string, RawCat> = {};
  const catImages: Record<string, string> = {};
  for (const c of rawCats) {
    let slug = slugify(c.name);
    if (cats[slug]) slug = `${slug}-${c.id}`;
    cats[slug] = c;
  }

  const dogSlugs = Object.keys(dogs);
  const catSlugs = Object.keys(cats);
  const CHUNK = 25;
  for (let i = 0; i < dogSlugs.length; i += CHUNK) {
    const chunk = dogSlugs.slice(i, i + CHUNK);
    const results = await Promise.all(chunk.map((s) => resolveDogImage(dogs[s], dogKey)));
    chunk.forEach((s, idx) => { dogImages[s] = results[idx]; });
  }
  for (let i = 0; i < catSlugs.length; i += CHUNK) {
    const chunk = catSlugs.slice(i, i + CHUNK);
    const results = await Promise.all(chunk.map((s) => resolveCatImage(cats[s], catKey)));
    chunk.forEach((s, idx) => { catImages[s] = results[idx]; });
  }

  const summaries: BreedSummary[] = [];
  let n = 1;
  for (const slug of dogSlugs) {
    const d = dogs[slug];
    summaries.push({
      slug,
      name: d.name,
      species: "dog",
      tagline: d.bred_for ? `Bred for ${d.bred_for.toLowerCase()}` : (d.breed_group || "An old companion"),
      origin: d.origin || d.breed_group || "Origin uncertain",
      intro: synthDogIntro(d),
      image: dogImages[slug] || "",
      issueNo: String(n++).padStart(2, "0"),
      temperament: tempArr(d.temperament),
      tags: dogTags(d),
      group: d.breed_group || "Unclassified",
    });
  }
  for (const slug of catSlugs) {
    const c = cats[slug];
    const tArr = tempArr(c.temperament);
    summaries.push({
      slug,
      name: c.name,
      species: "cat",
      tagline: tArr[0] || "A feline original",
      origin: c.origin || "Origin uncertain",
      intro: c.description?.slice(0, 220) || `${c.name} — a notable feline lineage.`,
      image: catImages[slug] || "",
      issueNo: String(n++).padStart(2, "0"),
      temperament: tArr,
      tags: catTags(c),
      group: c.hairless ? "Hairless" : c.indoor ? "Indoor-suited" : "Domestic",
    });
  }

  return { fetchedAt: Date.now(), dogs, cats, dogImages, catImages, summaries };
}

async function getCache(): Promise<Cache> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache;
  if (inflight) return inflight;
  inflight = buildCache()
    .then((c) => { cache = c; inflight = null; return c; })
    .catch((err) => { inflight = null; throw err; });
  return inflight;
}

// ============================================================
// Synthesizers
// ============================================================
function synthDogIntro(d: RawDog): string {
  const parts: string[] = [];
  if (d.bred_for) parts.push(`Bred for ${d.bred_for.toLowerCase()}`);
  if (d.breed_group) parts.push(`a member of the ${d.breed_group} group`);
  if (d.origin) parts.push(`with roots in ${d.origin}`);
  const head = parts.length ? `${d.name} — ${parts.join(", ")}.` : `${d.name} — a working pedigree with a long human history.`;
  const tail = d.temperament ? ` Known as ${d.temperament.toLowerCase()}, the breed rewards owners who match its temperament with intention.` : "";
  return head + tail;
}

function synthHistory(name: string, origin?: string, bredFor?: string, group?: string): string {
  const where = origin || "an unrecorded place";
  const purpose = bredFor ? bredFor.toLowerCase() : "human partnership";
  const grp = group ? ` Today the breed sits in the ${group} group of modern kennel clubs.` : "";
  return `The ${name} traces its lineage to ${where}, where it was developed for ${purpose}. Selective breeding sharpened the traits that defined the work — temperament, structure, and stamina — and the breed eventually crossed continents through trade, migration, and the late-nineteenth-century rise of formal kennel clubs.${grp} What we recognize today as the modern ${name} is the product of more than a century of intentional pairing on top of far older folk lineages.`;
}

function synthPersonality(name: string, temperament?: string): string {
  if (!temperament) return `Temperament in the ${name} varies with line and upbringing, but most owners describe a clear, consistent character that responds to fair, structured handling.`;
  const traits = temperament.split(",").map((t) => t.trim()).filter(Boolean);
  const list = traits.slice(0, -1).join(", ") + (traits.length > 1 ? `, and ${traits[traits.length - 1]}` : traits[0]);
  return `The ${name} is most often described as ${list.toLowerCase()}. These traits are not marketing language — they reflect what the breed was selected to do, and they show up earliest and most clearly in adolescence. Owners who plan around the temperament rather than against it tend to keep happier dogs and cats.`;
}

function synthCare(species: Species, name: string, weight?: string, lifespan?: string): string {
  const ex = species === "dog"
    ? "Daily structured exercise — not just a yard — is non-negotiable for most dogs of this size and history."
    : "Indoor enrichment, vertical space, and consistent play sessions matter more than people expect.";
  const w = weight ? ` Adults typically weigh ${weight}.` : "";
  const l = lifespan ? ` Plan for a commitment of ${lifespan}.` : "";
  return `Practical husbandry of the ${name} starts with realistic expectations. ${ex}${w}${l} Nutrition should match life stage and activity level; grooming cadence depends on coat type and seasonal shedding. Most behavioral problems people attribute to the breed are, on inspection, problems of unmet need.`;
}

function synthHealth(name: string, lifespan?: string, healthIssuesScore?: number): string {
  const span = lifespan ? `Average lifespan is ${lifespan}.` : "Lifespan varies considerably with line and care.";
  let risk = "Discuss screening with a vet familiar with the breed; reputable breeders test for the conditions known to cluster in the lineage.";
  if (typeof healthIssuesScore === "number") {
    if (healthIssuesScore >= 4) risk = "This breed carries above-average health risk and benefits from a vet who knows the lineage. Pre-purchase screening of parents is essential.";
    else if (healthIssuesScore <= 2) risk = "Health concerns in this breed are comparatively modest, but routine screening still pays for itself many times over.";
  }
  return `${span} ${risk} The most common pitfalls in any ${name} household are over-feeding, under-exercising, and skipping early veterinary preventives — boring problems with boring solutions, all of which extend the years you get together.`;
}

function pickFacts(d: RawDog | RawCat, isDog: boolean): string[] {
  const facts: string[] = [];
  if (isDog) {
    const dd = d as RawDog;
    if (dd.bred_for) facts.push(`Originally bred for ${dd.bred_for.toLowerCase()} — a job that still shapes its instincts today.`);
    if (dd.life_span) facts.push(`The typical ${dd.name} lives ${dd.life_span}, which makes it a true long-term commitment.`);
    if (dd.weight?.imperial) facts.push(`Adults usually weigh ${dd.weight.imperial} lbs — a useful fact when sizing crates, harnesses, and car seats.`);
    if (dd.breed_group) facts.push(`The breed sits in the ${dd.breed_group} group, which says a great deal about how it was historically used.`);
  } else {
    const cc = d as RawCat;
    if (cc.origin) facts.push(`Traces back to ${cc.origin} — a heritage that shaped its build, coat, and disposition.`);
    if (cc.life_span) facts.push(`Lifespan averages ${cc.life_span} years; well-cared-for indoor cats often exceed it.`);
    if (cc.alt_names) facts.push(`Also known as ${cc.alt_names} — the same cat under a different banner.`);
    if (cc.hypoallergenic) facts.push(`Considered hypoallergenic — a meaningful detail for households with sensitivities.`);
  }
  while (facts.length < 3) facts.push(`A breed that rewards owners who study it.`);
  return facts.slice(0, 3);
}

function dogStatFromBredFor(bredFor: string | undefined, fallback: number): number {
  if (!bredFor) return fallback;
  const s = bredFor.toLowerCase();
  if (/(hunt|retriev|herd|sport|guard|fight|sled|pulling|terrier)/.test(s)) return 5;
  if (/(companion|lap|toy)/.test(s)) return 2;
  return fallback;
}

function sizeFromWeight(imperial: string): string {
  const n = parseInt(imperial.split("-")[0]?.trim() || "0", 10);
  if (n < 15) return "Small";
  if (n < 50) return "Medium";
  if (n < 90) return "Large";
  return "Giant";
}

function buildDogDetail(slug: string, d: RawDog, image: string, issueNo: string): BreedDetail {
  const tArr = tempArr(d.temperament);
  const energy = dogStatFromBredFor(d.bred_for, 3);
  const trainability = /intelligent|obedient|trainable|eager/i.test(d.temperament || "") ? 5 : 4;
  const affection = /affectionate|loving|devoted|gentle|friendly/i.test(d.temperament || "") ? 5 : 4;
  const groom = /(long|silky|wire)/i.test(d.bred_for || "") ? 4 : 3;
  return {
    slug,
    name: d.name,
    species: "dog",
    tagline: d.bred_for ? `Bred for ${d.bred_for}` : (d.breed_group || "An old companion"),
    origin: d.origin || d.breed_group || "Origin uncertain",
    intro: synthDogIntro(d),
    image,
    issueNo,
    temperament: tArr.length ? tArr : ["Loyal", "Spirited"],
    tags: dogTags(d),
    group: d.breed_group || "Unclassified",
    lifespan: d.life_span ? `${d.life_span} years` : "Varies",
    size: d.weight?.imperial ? sizeFromWeight(d.weight.imperial) : "Varies",
    weight: d.weight?.imperial ? `${d.weight.imperial} lbs` : "Varies",
    coat: "Varies — see breeder guidance",
    colors: "Multiple recognized colors",
    energy,
    affection,
    trainability,
    grooming: groom,
    shedding: 3,
    goodWithKids: /child|family|gentle|patient/i.test(d.temperament || "") ? 5 : 3,
    history: synthHistory(d.name, d.origin, d.bred_for, d.breed_group),
    personality: synthPersonality(d.name, d.temperament),
    care: synthCare("dog", d.name, d.weight?.imperial ? `${d.weight.imperial} lbs` : undefined, d.life_span ? `${d.life_span} years` : undefined),
    health: synthHealth(d.name, d.life_span ? `${d.life_span} years` : undefined),
    funFacts: pickFacts(d, true),
    yearRecognized: "—",
    referenceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(d.name.replace(/\s+/g, "_"))}`,
    wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(d.name.replace(/\s+/g, "_"))}`,
  };
}

function buildCatDetail(slug: string, c: RawCat, image: string, issueNo: string): BreedDetail {
  const tArr = tempArr(c.temperament);
  return {
    slug,
    name: c.name,
    species: "cat",
    tagline: tArr[0] || "A feline original",
    origin: c.origin || "Origin uncertain",
    intro: c.description || `${c.name} — a feline lineage worth knowing.`,
    image,
    issueNo,
    temperament: tArr.length ? tArr : ["Independent", "Curious"],
    tags: catTags(c),
    group: c.hairless ? "Hairless" : c.indoor ? "Indoor-suited" : "Domestic",
    lifespan: c.life_span ? `${c.life_span} years` : "Varies",
    size: c.weight?.imperial ? `${c.weight.imperial} lbs` : "Varies",
    weight: c.weight?.imperial ? `${c.weight.imperial} lbs` : "Varies",
    coat: c.hairless ? "Hairless / fine down" : "Varies — see breed standard",
    colors: "Multiple recognized colors",
    energy: c.energy_level ?? 3,
    affection: c.affection_level ?? 4,
    trainability: c.intelligence ?? 3,
    grooming: c.grooming ?? 2,
    shedding: c.shedding_level ?? 3,
    goodWithKids: c.child_friendly ?? 3,
    history: synthHistory(c.name, c.origin, undefined, undefined),
    personality: synthPersonality(c.name, c.temperament),
    care: synthCare("cat", c.name, c.weight?.imperial ? `${c.weight.imperial} lbs` : undefined, c.life_span ? `${c.life_span} years` : undefined),
    health: synthHealth(c.name, c.life_span ? `${c.life_span} years` : undefined, c.health_issues),
    funFacts: pickFacts(c, false),
    yearRecognized: "—",
    referenceUrl: c.wikipedia_url || c.cfa_url || c.vetstreet_url || c.vcahospitals_url,
    wikipediaUrl: c.wikipedia_url,
  };
}

// ============================================================
// Server functions
// ============================================================
export const listBreeds = createServerFn({ method: "GET" }).handler(
  async (): Promise<BreedSummary[]> => {
    const c = await getCache();
    return c.summaries;
  },
);

export const getBreedDetail = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }): Promise<BreedDetail | null> => {
    const c = await getCache();
    const slug = data.slug;
    if (c.dogs[slug]) {
      const summary = c.summaries.find((s) => s.slug === slug);
      return buildDogDetail(slug, c.dogs[slug], c.dogImages[slug] || "", summary?.issueNo || "00");
    }
    if (c.cats[slug]) {
      const summary = c.summaries.find((s) => s.slug === slug);
      return buildCatDetail(slug, c.cats[slug], c.catImages[slug] || "", summary?.issueNo || "00");
    }
    return null;
  });
