/**
 * Large bilingual keyword lists for `<meta name="keywords">`.
 * Note: Major search engines largely ignore this tag; titles, descriptions, content, and structured data matter more.
 */

const EN_SERVICES = [
  "quantity surveying",
  "cost management",
  "construction management",
  "project management",
  "technical services",
  "cost consulting",
  "construction consulting",
  "BOQ preparation",
  "bill of quantities",
  "tender documentation",
  "tender support",
  "bid evaluation",
  "contract administration",
  "final account",
  "claims management",
  "variation orders",
  "value engineering",
  "life cycle costing",
  "feasibility estimating",
  "budget monitoring",
  "cost planning",
  "cost reporting",
  "procurement support",
  "FIDIC advice",
  "NEC contracts",
  "JCT contracts",
  "RPPA compliance",
  "payment certification",
  "extension of time",
  "liquidated damages",
  "practical completion",
  "retention money",
  "performance bond",
  "design coordination",
  "site supervision",
  "civil works",
  "structural coordination",
  "infrastructure delivery",
  "residential construction",
  "commercial construction",
  "institutional buildings",
  "renovation management",
  "fit-out coordination",
  "MEP coordination",
  "construction economics",
  "elemental costing",
  "earned value",
  "risk management construction",
  "dispute avoidance",
  "preliminaries pricing",
  "provisional sums",
  "dayworks schedule",
  "measurement standards",
  "building measurement",
];

const EN_PLACES = [
  "Rwanda",
  "Kigali",
  "Gasabo",
  "Kimihurura",
  "Kimironko",
  "Nyarutarama",
  "Remera",
  "Gisozi",
  "Kacyiru",
  "Nyarugenge",
  "East Africa",
  "African construction",
  "regional infrastructure",
  "Rwanda construction sector",
  "Kigali developers",
  "Rwanda real estate",
  "Rwanda infrastructure",
  "Rwanda civil works",
  "Rwanda building industry",
  "Rwanda quantity surveyors",
  "Rwanda cost consultants",
  "Rwanda project controls",
  "Rwanda tendering",
  "Rwanda BOQ",
  "Rwanda contracts",
  "Rwanda final accounts",
  "Rwanda renovation",
  "Rwanda commercial build",
  "Rwanda residential build",
  "Rwanda institutional projects",
  "Rwanda technical advisory",
  "Rwanda construction law support",
  "Rwanda procurement",
  "Rwanda design build",
  "Rwanda multi-unit housing",
  "Rwanda site management",
  "Rwanda cost planning",
  "Rwanda feasibility study",
  "Rwanda value engineering",
  "Rwanda claims",
  "Rwanda dispute support",
];

const EN_EXTRA = [
  "T&W Quantus",
  "TW Quantus",
  "Quantus construction",
  "Quantus quantity surveying",
  "Kigali QS firm",
  "Rwanda QS company",
  "construction cost consultant Kigali",
  "quantity surveyor Rwanda",
  "building cost control Rwanda",
  "project delivery Rwanda",
  "construction excellence Rwanda",
  "trusted construction partner Rwanda",
];

const RW_STEMS = [
  "ubwubatsi",
  "inyubako",
  "inzu",
  "serivisi z'ubwubatsi",
  "gucunga ubwubatsi",
  "gucunga amafaranga y'ubwubatsi",
  "ubushakashatsi bw'agaciro",
  "gutegura BOQ",
  "inyandiko z'ubucuti",
  "gusuzuma amafatabuguzi",
  "gucunga amasezerano",
  "kwishyura kwa nyuma",
  "gutunganya ingengo y'imari",
  "gukurikirana bije",
  "ubuyobozi bw'ubwubatsi",
  "serivisi z'ubwobozi",
  "ubwiyubushake",
  "gusana no gusana inyubako",
  "imirimo y'ubwubatsi",
  "imirimo y'ubutaka",
  "imirimo y'amazu",
  "imirimo y'inganda",
  "imirimo y'amashuri",
  "imirimo y'ibigo by'ubuvuzi",
  "imirimo y'ubucuruzi",
  "gushyiraho ingingo z'ibiciro",
  "gusuzuma impinduka",
  "gufasha mu kwishyura",
  "ubufasha bw'amasezerano",
  "gusura ubuso",
  "gupima ibikoresho",
  "serivisi z'ubwiyubushake",
  "gucunga abakozi ku kibuga",
  "gufasha mu gutwara ibikoresho",
  "gufasha mu gutegura uburyo",
  "ubufasha bw'ubwubatsi bwuzuye",
  "gufasha mu kwiyubakira",
  "gufasha mu gusana",
  "gufasha mu kwagura inyubako",
  "gufasha mu kwishyira hamwe serivisi",
  "ubufasha bw'ubushakashatsi",
  "raporo z'agaciro",
  "igenzura ry'ubwubatsi",
  "igenzura ry'imari",
  "ubwiyunge bw'ubwubatsi",
  "gufasha mu bikorwa by'ubwubatsi",
  "gufasha mu bikorwa by'ubutaka",
  "gufasha mu bikorwa by'amazu",
];

const RW_PLACES = [
  "mu Rwanda",
  "i Kigali",
  "mu Gasabo",
  "mu Karere ka Gasabo",
  "mu gihugu cy'u Rwanda",
  "mu majyaruguru y'u Rwanda",
  "mu burasirazuba bwa Afrika",
  "mu isoko ry'ubwubatsi rya Rwanda",
  "mu bikorwa by'ubwubatsi bya Kigali",
  "mu bikorwa by'ubwubatsi by'u Rwanda",
  "mu bikorwa by'amazu",
  "mu bikorwa by'inganda",
  "mu bikorwa by'amashuri",
  "mu bikorwa by'ibigo",
  "mu bikorwa by'ubucuruzi",
  "mu bikorwa by'ubutaka",
  "mu bikorwa by'imirimo mikuru",
  "mu bikorwa by'imirimo nto",
  "mu bikorwa byo gusana",
  "mu bikorwa byo kwiyubakira",
  "mu bikorwa by'ubwiyubushake",
  "mu bikorwa by'ubuyobozi",
  "mu bikorwa by'ubushakashatsi",
  "mu bikorwa by'ingengo y'imari",
  "mu bikorwa by'ubucuti",
  "mu bikorwa by'ubwiyunge",
  "mu bikorwa by'ubwubatsi bwuzuye",
  "mu bikorwa by'ubwubatsi bw'ikirenga",
  "mu bikorwa by'ubwubatsi bw'ikoranabuhanga",
  "mu mujyi wa Kigali",
  "mu gihugu cy'abanyarwanda",
  "mu karere ka Nyarugenge",
  "abakodesha bo mu Rwanda",
  "abakodesha bo i Kigali",
  "abashinzwe ubwubatsi mu Rwanda",
  "abashinzwe imari y'ubwubatsi",
  "abashinzwe BOQ mu Rwanda",
  "abashinzwe amasezerano y'ubwubatsi",
  "abashinzwe gusura ubuso",
  "abashinzwe gusuzuma ibiciro",
  "abashinzwe gutwara uburyo",
];

const RW_EXTRA = [
  "T&W Quantus",
  "TW Quantus",
  "Quantus mu Rwanda",
  "Quantus i Kigali",
  "ikigo cy'ubwubatsi n'ubushakashatsi",
  "ikigo gishinzwe ubwubatsi",
  "ikigo gishinzwe imari y'ubwubatsi",
  "ikigo gishinzwe BOQ",
  "ikigo gishinzwe amasezerano",
  "ikigo gishinzwe serivisi z'ubwobozi",
  "ikigo gishinzwe serivisi z'ubwiyubushake",
  "ubufasha bw'ubwubatsi bw'ikirenga",
  "ubufasha bw'ubwubatsi bw'ikoranabuhanga",
];

/** Target count per language (1000+ each). */
const KEYWORDS_PER_LANG = 1200;

function buildEnglishKeywords(): string[] {
  const set = new Set<string>();
  for (const s of EN_SERVICES) {
    for (const p of EN_PLACES) {
      set.add(`${s} ${p}`);
      set.add(`${p} ${s}`);
    }
  }
  for (const e of EN_EXTRA) set.add(e);
  return [...set].sort().slice(0, KEYWORDS_PER_LANG);
}

function buildKinyarwandaKeywords(): string[] {
  const set = new Set<string>();
  for (const s of RW_STEMS) {
    for (const p of RW_PLACES) {
      set.add(`${s} ${p}`);
      set.add(`${p} ${s}`);
    }
  }
  for (const e of RW_EXTRA) set.add(e);
  return [...set].sort().slice(0, KEYWORDS_PER_LANG);
}

let cachedEn: string[] | null = null;
let cachedRw: string[] | null = null;

export function getSeoKeywordsEnglishList(): string[] {
  if (!cachedEn) cachedEn = buildEnglishKeywords();
  return cachedEn;
}

export function getSeoKeywordsKinyarwandaList(): string[] {
  if (!cachedRw) cachedRw = buildKinyarwandaKeywords();
  return cachedRw;
}

/** Comma-separated EN + RW keywords for one meta tag (HTML-escape before embedding). */
export function getSeoKeywordsMetaContent(): string {
  return [...getSeoKeywordsEnglishList(), ...getSeoKeywordsKinyarwandaList()].join(", ");
}

export function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
