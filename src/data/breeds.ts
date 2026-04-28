import goldenImg from "@/assets/breeds/golden-retriever.jpg";
import frenchieImg from "@/assets/breeds/french-bulldog.jpg";
import collieImg from "@/assets/breeds/border-collie.jpg";
import shibaImg from "@/assets/breeds/shiba-inu.jpg";
import daneImg from "@/assets/breeds/great-dane.jpg";
import maineImg from "@/assets/breeds/maine-coon.jpg";
import ragdollImg from "@/assets/breeds/ragdoll.jpg";
import bengalImg from "@/assets/breeds/bengal.jpg";
import sphynxImg from "@/assets/breeds/sphynx.jpg";
import siameseImg from "@/assets/breeds/siamese.jpg";

export type Species = "dog" | "cat";

export interface Breed {
  slug: string;
  name: string;
  species: Species;
  tagline: string;
  origin: string;
  group: string;
  lifespan: string;
  size: string;
  weight: string;
  coat: string;
  colors: string;
  temperament: string[];
  energy: number; // 1-5
  affection: number;
  trainability: number;
  grooming: number;
  shedding: number;
  goodWithKids: number;
  intro: string;
  history: string;
  personality: string;
  care: string;
  health: string;
  funFacts: string[];
  image: string;
  issueNo: string;
  yearRecognized: string;
}

export const breeds: Breed[] = [
  {
    slug: "golden-retriever",
    name: "Golden Retriever",
    species: "dog",
    tagline: "The Sunlit Companion",
    origin: "Scotland, 1860s",
    group: "Sporting",
    lifespan: "10–12 years",
    size: "Large",
    weight: "55–75 lbs",
    coat: "Dense double coat, water-repellent",
    colors: "Light gold to deep mahogany",
    temperament: ["Friendly", "Devoted", "Patient", "Intelligent"],
    energy: 4, affection: 5, trainability: 5, grooming: 3, shedding: 4, goodWithKids: 5,
    intro: "There is no dog more synonymous with American family life than the Golden Retriever — a breed engineered, paradoxically, in the misty Scottish Highlands for the cold pursuit of waterfowl, yet remembered today for its uncanny ability to love unconditionally.",
    history: "Bred in the 1860s by Lord Tweedmouth at his estate, Guisachan, the Golden was the result of careful crosses between a Yellow Retriever and the now-extinct Tweed Water Spaniel. Tweedmouth's meticulous studbook — only discovered in the 1950s — finally settled decades of speculation about the breed's origin. The Kennel Club recognized them in 1903; the AKC followed in 1925.",
    personality: "Goldens are diplomats. They greet the postman, the toddler, and the neighbor's anxious cat with the same broad smile. Beneath the affability lies a working dog's brain — eager, responsive, and deeply tuned to its handler. They are, however, perpetually adolescent until about age three, with all the chaos that implies.",
    care: "Plan on 60–90 minutes of daily exercise: a hike, a swim, a long retrieve session. Mental stimulation is non-negotiable — puzzle feeders, scent games, obedience classes. Brush the coat 2–3 times weekly and daily during the spring 'coat blow.' Bathe every 6–8 weeks. Their love of food makes weight management a lifelong project.",
    health: "Hip and elbow dysplasia, subaortic stenosis, and a regrettably high cancer incidence (lymphoma, hemangiosarcoma) are the breed's chief concerns. Choose breeders who provide OFA hip/elbow clearances, cardiac evaluations, and CAER eye exams. Annual bloodwork after age six is wise.",
    funFacts: [
      "A Golden named Charlie holds the Guinness record for loudest dog bark — 113.1 dB.",
      "Goldens have served as guide dogs since the 1930s and remain among the most-used breeds for assistance work.",
      "Their feathered tail is technically a rudder — they were bred to swim.",
    ],
    image: goldenImg,
    issueNo: "01",
    yearRecognized: "1925",
  },
  {
    slug: "french-bulldog",
    name: "French Bulldog",
    species: "dog",
    tagline: "Parisian Lap Philosopher",
    origin: "England → France, 1800s",
    group: "Non-Sporting",
    lifespan: "10–12 years",
    size: "Small",
    weight: "16–28 lbs",
    coat: "Short, smooth, fine",
    colors: "Brindle, fawn, white, pied, cream",
    temperament: ["Adaptable", "Playful", "Alert", "Stubborn"],
    energy: 2, affection: 5, trainability: 3, grooming: 1, shedding: 2, goodWithKids: 5,
    intro: "Compact, comic, and perpetually bemused — the French Bulldog has dethroned every rival to become the most popular dog in America. The reason is hiding in plain sight: they were bred, quite literally, to be human-sized companions.",
    history: "The breed descends from miniature English Bulldogs that lace-makers in Nottingham brought across the Channel during the Industrial Revolution. In Paris, the little dogs became the mascots of bohemians, butchers, and ladies of the night, eventually charming their way into the salons of Toulouse-Lautrec and Degas.",
    personality: "Frenchies are clowns with timing. They observe, they wait, they pounce on a moment of stillness with a snort. They form intense one-person bonds and dislike being left alone. Stubbornness is part of the package — training rewards patience and cheese in equal measure.",
    care: "Two short walks per day suffice; they overheat quickly and cannot swim. Skin folds need weekly cleaning. Avoid air travel in cargo. Their flat faces (brachycephaly) demand cool environments and strict weight control. Harnesses, never collars.",
    health: "Brachycephalic Obstructive Airway Syndrome is the central concern; many Frenchies benefit from elective soft-palate surgery. Also watch for IVDD, hip dysplasia, and skin allergies. Insurance is strongly recommended.",
    funFacts: [
      "The 'bat ears' were once controversial — French breeders preferred them, the English wanted rose ears, and the French standard won.",
      "A Frenchie named Gamin de Pycombe went down with the Titanic — insured for £150.",
      "Their 'reverse sneeze' is a harmless quirk of brachycephalic anatomy.",
    ],
    image: frenchieImg,
    issueNo: "02",
    yearRecognized: "1898",
  },
  {
    slug: "border-collie",
    name: "Border Collie",
    species: "dog",
    tagline: "The Thinking Athlete",
    origin: "Anglo-Scottish Border, 1700s",
    group: "Herding",
    lifespan: "12–15 years",
    size: "Medium",
    weight: "30–55 lbs",
    coat: "Smooth or rough double coat",
    colors: "Black & white, red, blue merle, tricolor",
    temperament: ["Brilliant", "Intense", "Workaholic", "Sensitive"],
    energy: 5, affection: 4, trainability: 5, grooming: 3, shedding: 4, goodWithKids: 4,
    intro: "If dogs ranked by IQ, the Border Collie would sit alone at the summit. A working sheepdog at heart, the breed channels an almost unsettling intelligence into whatever job — sanctioned or invented — happens to be at hand.",
    history: "Refined along the rolling hills between England and Scotland, the breed traces to a single dog: Old Hemp, born 1893, who herded sheep with a quiet, hypnotic 'eye' rather than the barking common at the time. Every modern Border Collie descends from him.",
    personality: "Borders are not pets — they are colleagues. They learn commands in fewer than five repetitions, anticipate routines, and invent games. Without a job (herding, agility, scent work, frisbee), they herd children, cats, and shadows. Sensitive to harsh tones; respond best to clear, consistent leadership.",
    care: "Two hours of physical exercise plus structured mental work daily. They thrive on rural acreage but can flourish in cities with committed owners. Brush twice weekly. Avoid the 'just one more throw' trap — overstimulation produces neurotic dogs.",
    health: "Generally robust. Watch for Collie Eye Anomaly, hip dysplasia, epilepsy, and the MDR1 drug-sensitivity gene (test before any anesthesia or ivermectin).",
    funFacts: [
      "Chaser, a Border Collie, learned the names of 1,022 distinct toys — the largest tested vocabulary of any animal.",
      "They herd with 'the eye' — a crouched, fixed stare that sheep instinctively obey.",
      "Used in airports worldwide to scare away geese from runways.",
    ],
    image: collieImg,
    issueNo: "03",
    yearRecognized: "1995",
  },
  {
    slug: "shiba-inu",
    name: "Shiba Inu",
    species: "dog",
    tagline: "The Stoic of the East",
    origin: "Japan, ancient",
    group: "Non-Sporting",
    lifespan: "13–16 years",
    size: "Small-Medium",
    weight: "17–23 lbs",
    coat: "Plush double coat",
    colors: "Red, sesame, black & tan, cream",
    temperament: ["Independent", "Bold", "Alert", "Reserved"],
    energy: 3, affection: 3, trainability: 3, grooming: 3, shedding: 5, goodWithKids: 3,
    intro: "Foxlike, cat-clean, and famously self-possessed, the Shiba Inu is a 9,000-year-old breed packaged in a body small enough for a Tokyo apartment. They love you on their own terms — and inform you of those terms loudly.",
    history: "One of six native Japanese breeds (and the smallest), the Shiba was nearly lost in WWII bombings and a postwar distemper epidemic. Three remaining bloodlines — the Shinshu, Mino, and San'in — were fused to rebuild the breed. Designated a Living National Monument in 1936.",
    personality: "The Shiba scream — a high-pitched protest delivered during baths, vet visits, or any indignity — is a cultural phenomenon. They are clean to a fault, often house-training themselves, and famously aloof with strangers. Recall is unreliable; never trust them off-leash in open space.",
    care: "Daily walks plus puzzle play. Brush weekly, daily during the twice-yearly coat blow that produces small snowstorms. Securely fenced yards only — they are escape artists with prey drive.",
    health: "Allergies, patellar luxation, hip dysplasia, glaucoma, and chylothorax. Long-lived overall.",
    funFacts: [
      "The 'doge' meme that defined a decade is a Shiba named Kabosu.",
      "Their coat sheds in clumps you can knit with.",
      "A Shiba named Mari saved her family from the 2004 Niigata earthquake — and got her own movie.",
    ],
    image: shibaImg,
    issueNo: "04",
    yearRecognized: "1992",
  },
  {
    slug: "great-dane",
    name: "Great Dane",
    species: "dog",
    tagline: "The Apollonian Giant",
    origin: "Germany, 1500s",
    group: "Working",
    lifespan: "7–10 years",
    size: "Giant",
    weight: "110–175 lbs",
    coat: "Short, smooth",
    colors: "Fawn, brindle, blue, black, harlequin, mantle, merle",
    temperament: ["Gentle", "Patient", "Friendly", "Dependable"],
    energy: 3, affection: 5, trainability: 4, grooming: 1, shedding: 3, goodWithKids: 5,
    intro: "Standing eye-to-eye with a horse and gentle as a librarian, the Great Dane is what happens when nobility, athleticism, and a desperate need to sit on your lap converge in a single 175-pound dog.",
    history: "Despite the name, the Great Dane is German — bred from English Mastiffs and Irish Wolfhounds for boar hunting in the 16th century. By the 19th century the breed had been refined into the elegant, coursing-style giant we know today.",
    personality: "Apartment dwellers, take note: the Dane is calmer than most terriers. They are leaners — expect to be pinned to a wall in greeting. Sensitive to household tension, prone to Velcro behavior, and convinced they are lap dogs.",
    care: "Moderate exercise (45 min/day) on soft surfaces; growing puppies must avoid stairs and jumping until 18 months. Slow-feed bowls reduce bloat risk. Orthopedic beds non-negotiable.",
    health: "Bloat (gastric dilatation-volvulus) is the leading killer — discuss prophylactic gastropexy. Also dilated cardiomyopathy, hip dysplasia, wobbler syndrome, and cancers. Their tragic short lifespan is the price of the size.",
    funFacts: [
      "Zeus, a Dane from Texas, held the record at 44 inches at the shoulder.",
      "Scooby-Doo is a Great Dane.",
      "Otto von Bismarck kept Danes throughout his life; they slept in his bedroom.",
    ],
    image: daneImg,
    issueNo: "05",
    yearRecognized: "1887",
  },
  {
    slug: "maine-coon",
    name: "Maine Coon",
    species: "cat",
    tagline: "Gentle Giant of New England",
    origin: "Maine, USA, 1800s",
    group: "Natural Breed",
    lifespan: "12–15 years",
    size: "Extra Large",
    weight: "13–25 lbs",
    coat: "Long, shaggy, water-resistant",
    colors: "Brown tabby classic; all colors except pointed",
    temperament: ["Gentle", "Sociable", "Playful", "Dog-like"],
    energy: 3, affection: 5, trainability: 4, grooming: 4, shedding: 4, goodWithKids: 5,
    intro: "The Maine Coon is America's only native longhaired cat — a snowshoe-pawed, lynx-eared frontier feline that grew large because Maine winters demanded it.",
    history: "Folklore claims descent from Marie Antoinette's Turkish Angoras shipped to Wiscasset before her execution; reality is more prosaic — likely crosses between local shorthairs and longhaired cats brought by Vikings or sailors. The breed nearly went extinct in the 1950s before American breeders revived it.",
    personality: "They chirp and trill rather than meow, follow you room to room, and play fetch. Despite the imposing size, they are notoriously gentle with children and other pets. Slow maturers — full size at four years.",
    care: "Comb the coat 2–3 times weekly to prevent matting, especially the britches and ruff. Big cats need big spaces — multi-level cat trees, wide litter boxes (storage bins work). Many enjoy water; do not be surprised by sink supervision.",
    health: "Hypertrophic cardiomyopathy (HCM) and hip dysplasia are breed concerns. Spinal muscular atrophy (SMA) and polycystic kidney disease screening available. Reputable breeders DNA-test parents.",
    funFacts: [
      "Stewie, a Maine Coon, measured 48.5 inches nose to tail — Guinness world record.",
      "Their tufted paws act as natural snowshoes.",
      "The official state cat of Maine since 1985.",
    ],
    image: maineImg,
    issueNo: "06",
    yearRecognized: "1976",
  },
  {
    slug: "ragdoll",
    name: "Ragdoll",
    species: "cat",
    tagline: "The Floppy Aristocrat",
    origin: "California, USA, 1960s",
    group: "Pointed Longhair",
    lifespan: "13–18 years",
    size: "Large",
    weight: "10–20 lbs",
    coat: "Semi-long, silky, low-matting",
    colors: "Seal, blue, chocolate, lilac, red, cream — pointed, mitted, bicolor",
    temperament: ["Docile", "Affectionate", "Quiet", "Mellow"],
    energy: 2, affection: 5, trainability: 3, grooming: 3, shedding: 3, goodWithKids: 5,
    intro: "Lift a Ragdoll and they go limp in your arms — a quirk of muscle relaxation that gave the breed its name and made it the perfect cat for households that simply want a cat to be cuddled.",
    history: "Created in 1960s Riverside, California, by Ann Baker, who bred a white longhaired cat named Josephine to a series of Birman-type males. Baker's eccentric trademarking and franchising of the breed slowed mainstream recognition for decades.",
    personality: "Ragdolls greet you at the door, follow you to the bathroom, and ride on shoulders. They almost never extend claws, almost never climb, and almost never raise their voice. Strictly indoor cats — they lack survival instincts.",
    care: "Gentle weekly combing keeps the silky coat tangle-free. They need consistent companionship — pair with another pet if you work long hours. Heavy enough that toddlers should sit before holding.",
    health: "HCM (genetic test available — insist on it from breeders), urinary tract issues, and obesity. Generally hardy with proper screening.",
    funFacts: [
      "They are 'puppy-cats' — fetch, learn names, and come when called.",
      "Color develops slowly; kittens are born white and color over the first three years.",
      "Ann Baker once claimed Ragdolls were the result of a CIA gene-splicing experiment. They are not.",
    ],
    image: ragdollImg,
    issueNo: "07",
    yearRecognized: "1993",
  },
  {
    slug: "bengal",
    name: "Bengal",
    species: "cat",
    tagline: "Living Room Leopard",
    origin: "USA, 1960s",
    group: "Hybrid",
    lifespan: "12–16 years",
    size: "Medium-Large",
    weight: "8–15 lbs",
    coat: "Short, dense, glittered",
    colors: "Brown, snow, silver — spotted or marbled",
    temperament: ["Athletic", "Curious", "Vocal", "Demanding"],
    energy: 5, affection: 4, trainability: 4, grooming: 1, shedding: 2, goodWithKids: 4,
    intro: "Spotted like a jaguar and wired like a toddler with espresso, the Bengal is what happens when you cross an Asian leopard cat with a domestic shorthair and select, generation after generation, for that wild rosetted coat.",
    history: "Geneticist Jean Mill began the program in 1963; modern Bengals are at least four generations removed from their wild ancestor (F4 and beyond) and considered fully domestic. TICA recognized the breed in 1986.",
    personality: "Bengals open cabinets, turn on faucets, fetch, and protest closed doors. They need vertical space, running water, and a job. They also love water — expect shower visitors.",
    care: "Two hours of active play daily. Catio access is ideal. Their short coat needs nothing beyond occasional brushing. Provide a cat wheel — seriously.",
    health: "HCM, progressive retinal atrophy, and pyruvate kinase deficiency — all DNA-testable. Avoid early-generation (F1–F3) Bengals unless legally permitted and experienced.",
    funFacts: [
      "Some Bengals have a 'glitter' gene that makes the coat appear sprinkled with gold dust.",
      "They are one of the few cat breeds that genuinely enjoy walks on a harness.",
      "Banned or restricted in NYC, Hawaii, and several countries.",
    ],
    image: bengalImg,
    issueNo: "08",
    yearRecognized: "1991",
  },
  {
    slug: "sphynx",
    name: "Sphynx",
    species: "cat",
    tagline: "The Velvet Hot-Water-Bottle",
    origin: "Toronto, Canada, 1966",
    group: "Hairless",
    lifespan: "9–15 years",
    size: "Medium",
    weight: "6–12 lbs",
    coat: "Hairless (peach-fuzz)",
    colors: "All colors and patterns — visible on skin",
    temperament: ["Extroverted", "Mischievous", "Affectionate", "Loyal"],
    energy: 4, affection: 5, trainability: 4, grooming: 5, shedding: 1, goodWithKids: 5,
    intro: "Warm to the touch, wrinkled with intent, and never out of your sight — the Sphynx is the most extroverted cat breed in existence, a permanently snuggling alien in cat form.",
    history: "Began with a single hairless kitten named Prune born to a domestic shorthair in Toronto, 1966. Outcrossing to Devon Rex and Cornish Rex stabilized the gene. Today's Sphynx is a robust, healthy breed.",
    personality: "Sphynxes are co-workers. They sit on laptops, ride shoulders, and greet guests at the door. They get cold — sweaters are functional, not fashion.",
    care: "Weekly bathing (their skin produces oils that would otherwise transfer to furniture). Ear cleaning, nail-bed cleaning, and dental hygiene are weekly tasks. Sunscreen for windowsill cats. They eat more than typical cats to maintain body temperature.",
    health: "HCM is the dominant concern (annual cardiac scans). Skin conditions, dental disease, and hereditary myopathy also occur.",
    funFacts: [
      "They are not hypoallergenic — humans react to cat saliva, not fur.",
      "Body temperature is 4 °F warmer than other cats — they are walking heating pads.",
      "The cat from Friends ('Mrs. Whiskerson') was a Sphynx.",
    ],
    image: sphynxImg,
    issueNo: "09",
    yearRecognized: "2002",
  },
  {
    slug: "siamese",
    name: "Siamese",
    species: "cat",
    tagline: "The Royal Conversationalist",
    origin: "Siam (Thailand), ancient",
    group: "Pointed Shorthair",
    lifespan: "12–20 years",
    size: "Medium",
    weight: "6–14 lbs",
    coat: "Short, fine, close-lying",
    colors: "Seal, blue, chocolate, lilac points",
    temperament: ["Vocal", "Intelligent", "Demanding", "Devoted"],
    energy: 4, affection: 5, trainability: 5, grooming: 1, shedding: 2, goodWithKids: 4,
    intro: "Centuries before they prowled American living rooms, Siamese cats lounged in Buddhist temples and Siamese palaces. They have not forgotten.",
    history: "Depicted in the Tamra Maew (Cat-Book Poems) of 14th-century Ayutthaya, the Siamese arrived in the West in 1878 when the U.S. Consul in Bangkok shipped one to President Hayes. The first British pair was a wedding gift to the British Consul-General in 1884.",
    personality: "Siamese are conversationalists with strong opinions. They form profound bonds with one or two people, follow them constantly, and demand reply. Best in pairs unless someone is home most of the day.",
    care: "Minimal grooming — a weekly rubdown with a chamois. Endless mental engagement. Many Siamese learn to walk on harnesses, play fetch, and open doors.",
    health: "Long-lived but prone to amyloidosis, asthma, dental disease, and crossed eyes (cosmetic only). Modern show lines are extreme; 'Old-Style' or 'Thai' Siamese are stockier and often healthier.",
    funFacts: [
      "All point colors come from a heat-sensitive enzyme — cooler body parts (ears, paws, tail, face) develop dark fur.",
      "Two Siamese named Pho and Mia were the first to arrive in the U.S., gifted by a Bangkok diplomat in 1878.",
      "The 'Siamese twin' phrase comes from Chang and Eng Bunker, conjoined brothers from Siam — not the cats.",
    ],
    image: siameseImg,
    issueNo: "10",
    yearRecognized: "1906",
  },
];

export const getBreed = (slug: string) => breeds.find(b => b.slug === slug);
