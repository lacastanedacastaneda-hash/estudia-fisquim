// Taula periòdica completa (118 elements). El grup, el període i la categoria
// es calculen a partir de Z perquè no puguin quedar incoherents.

export type Category =
  | "alkali"
  | "alkaline-earth"
  | "transition"
  | "lanthanide"
  | "actinide"
  | "post-transition"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble-gas";

export type BroadType = "metall" | "no-metall" | "semimetall" | "gas-noble";

export type PTElement = {
  z: number;
  symbol: string;
  name: string;
  /** Massa atòmica (u). Per als elements sense isòtops estables, la de l'isòtop més estable. */
  mass: number;
  /** true si `mass` és la de l'isòtop més estable (es mostra entre parèntesis). */
  radioactiveMass: boolean;
  period: number;
  /** null per als lantànids i actínids (bloc f). */
  group: number | null;
  category: Category;
  type: BroadType;
};

// [símbol, nom en català, massa atòmica], en ordre de Z.
const DATA: [string, string, number][] = [
  ["H", "Hidrogen", 1.008], ["He", "Heli", 4.003],
  ["Li", "Liti", 6.94], ["Be", "Beril·li", 9.012], ["B", "Bor", 10.81], ["C", "Carboni", 12.011],
  ["N", "Nitrogen", 14.007], ["O", "Oxigen", 15.999], ["F", "Fluor", 18.998], ["Ne", "Neó", 20.18],
  ["Na", "Sodi", 22.99], ["Mg", "Magnesi", 24.305], ["Al", "Alumini", 26.982], ["Si", "Silici", 28.085],
  ["P", "Fòsfor", 30.974], ["S", "Sofre", 32.06], ["Cl", "Clor", 35.45], ["Ar", "Argó", 39.95],
  ["K", "Potassi", 39.098], ["Ca", "Calci", 40.078], ["Sc", "Escandi", 44.956], ["Ti", "Titani", 47.867],
  ["V", "Vanadi", 50.942], ["Cr", "Crom", 51.996], ["Mn", "Manganès", 54.938], ["Fe", "Ferro", 55.845],
  ["Co", "Cobalt", 58.933], ["Ni", "Níquel", 58.693], ["Cu", "Coure", 63.546], ["Zn", "Zinc", 65.38],
  ["Ga", "Gal·li", 69.723], ["Ge", "Germani", 72.63], ["As", "Arsènic", 74.922], ["Se", "Seleni", 78.971],
  ["Br", "Brom", 79.904], ["Kr", "Criptó", 83.798],
  ["Rb", "Rubidi", 85.468], ["Sr", "Estronci", 87.62], ["Y", "Itri", 88.906], ["Zr", "Zirconi", 91.224],
  ["Nb", "Niobi", 92.906], ["Mo", "Molibdè", 95.95], ["Tc", "Tecneci", 98], ["Ru", "Ruteni", 101.07],
  ["Rh", "Rodi", 102.91], ["Pd", "Pal·ladi", 106.42], ["Ag", "Plata", 107.87], ["Cd", "Cadmi", 112.41],
  ["In", "Indi", 114.82], ["Sn", "Estany", 118.71], ["Sb", "Antimoni", 121.76], ["Te", "Tel·luri", 127.6],
  ["I", "Iode", 126.9], ["Xe", "Xenó", 131.29],
  ["Cs", "Cesi", 132.91], ["Ba", "Bari", 137.33], ["La", "Lantani", 138.91], ["Ce", "Ceri", 140.12],
  ["Pr", "Praseodimi", 140.91], ["Nd", "Neodimi", 144.24], ["Pm", "Prometi", 145], ["Sm", "Samari", 150.36],
  ["Eu", "Europi", 151.96], ["Gd", "Gadolini", 157.25], ["Tb", "Terbi", 158.93], ["Dy", "Disprosi", 162.5],
  ["Ho", "Holmi", 164.93], ["Er", "Erbi", 167.26], ["Tm", "Tuli", 168.93], ["Yb", "Iterbi", 173.05],
  ["Lu", "Luteci", 174.97], ["Hf", "Hafni", 178.49], ["Ta", "Tàntal", 180.95], ["W", "Tungstè", 183.84],
  ["Re", "Reni", 186.21], ["Os", "Osmi", 190.23], ["Ir", "Iridi", 192.22], ["Pt", "Platí", 195.08],
  ["Au", "Or", 196.97], ["Hg", "Mercuri", 200.59], ["Tl", "Tal·li", 204.38], ["Pb", "Plom", 207.2],
  ["Bi", "Bismut", 208.98], ["Po", "Poloni", 209], ["At", "Àstat", 210], ["Rn", "Radó", 222],
  ["Fr", "Franci", 223], ["Ra", "Radi", 226], ["Ac", "Actini", 227], ["Th", "Tori", 232.04],
  ["Pa", "Protoactini", 231.04], ["U", "Urani", 238.03], ["Np", "Neptuni", 237], ["Pu", "Plutoni", 244],
  ["Am", "Americi", 243], ["Cm", "Curi", 247], ["Bk", "Berkeli", 247], ["Cf", "Californi", 251],
  ["Es", "Einsteini", 252], ["Fm", "Fermi", 257], ["Md", "Mendelevi", 258], ["No", "Nobeli", 259],
  ["Lr", "Laurenci", 266], ["Rf", "Rutherfordi", 267], ["Db", "Dubni", 268], ["Sg", "Seaborgi", 269],
  ["Bh", "Bohri", 270], ["Hs", "Hassi", 269], ["Mt", "Meitneri", 278], ["Ds", "Darmstadti", 281],
  ["Rg", "Roentgeni", 282], ["Cn", "Copernici", 285], ["Nh", "Nihoni", 286], ["Fl", "Flerovi", 289],
  ["Mc", "Moscovi", 290], ["Lv", "Livermori", 293], ["Ts", "Tennes", 294], ["Og", "Oganessó", 294],
];

const PERIOD_START = [1, 3, 11, 19, 37, 55, 87, 119];

export function periodOf(z: number): number {
  return PERIOD_START.findIndex((start, i) => z >= start && z < PERIOD_START[i + 1]) + 1;
}

/** Grup (1–18), o null per al bloc f. */
export function groupOf(z: number): number | null {
  const period = periodOf(z);
  const i = z - PERIOD_START[period - 1];
  if (period === 1) return z === 1 ? 1 : 18;
  if (period <= 3) return i < 2 ? i + 1 : i + 11;
  if (period <= 5) return i + 1;
  if (i < 2) return i + 1;
  if (i <= 16) return null;
  return i - 13;
}

const METALLOIDS = new Set(["B", "Si", "Ge", "As", "Sb", "Te"]);
const NONMETALS = new Set(["H", "C", "N", "O", "P", "S", "Se"]);

function categoryOf(z: number, symbol: string, group: number | null): Category {
  if (group === null) return periodOf(z) === 6 ? "lanthanide" : "actinide";
  if (group === 18) return "noble-gas";
  if (NONMETALS.has(symbol)) return "nonmetal";
  if (group === 17) return "halogen";
  if (METALLOIDS.has(symbol)) return "metalloid";
  if (group === 1) return "alkali";
  if (group === 2) return "alkaline-earth";
  if (group <= 12) return "transition";
  return "post-transition";
}

function broadTypeOf(category: Category): BroadType {
  if (category === "noble-gas") return "gas-noble";
  if (category === "metalloid") return "semimetall";
  if (category === "nonmetal" || category === "halogen") return "no-metall";
  return "metall";
}

export const PERIODIC_TABLE: PTElement[] = DATA.map(([symbol, name, mass], i) => {
  const z = i + 1;
  const group = groupOf(z);
  const category = categoryOf(z, symbol, group);
  return {
    z,
    symbol,
    name,
    mass,
    radioactiveMass: (z === 43 || z === 61 || z >= 84) && z !== 90 && z !== 91 && z !== 92,
    period: periodOf(z),
    group,
    category,
    type: broadTypeOf(category),
  };
});

export function byZ(z: number): PTElement {
  return PERIODIC_TABLE[z - 1];
}

export const CATEGORY_LABEL: Record<Category, string> = {
  alkali: "Metall alcalí",
  "alkaline-earth": "Metall alcalinoterri",
  transition: "Metall de transició",
  lanthanide: "Lantànid",
  actinide: "Actínid",
  "post-transition": "Metall del bloc p",
  metalloid: "Semimetall",
  nonmetal: "No metall",
  halogen: "Halogen",
  "noble-gas": "Gas noble",
};

export const TYPE_LABEL: Record<BroadType, string> = {
  metall: "Metall",
  "no-metall": "No metall",
  semimetall: "Semimetall",
  "gas-noble": "Gas noble",
};

/** Massa per mostrar: 55,845 · (98). */
export function massText(e: PTElement): string {
  const s = String(e.mass).replace(".", ",");
  return e.radioactiveMass ? `(${s})` : s;
}

/** Nom amb article en català: { el: "el ferro" | "l'or" | "la plata", de: "del ferro" | "de l'or" | "de la plata" }. */
export function articled(name: string): { el: string; de: string } {
  const n = name.toLowerCase();
  if (n === "plata") return { el: "la plata", de: "de la plata" };
  if (/^[aeiouàèéíòóúh]/.test(n)) return { el: `l'${n}`, de: `de l'${n}` };
  return { el: `el ${n}`, de: `del ${n}` };
}

/** Normalitza un nom per comparar respostes: sense accents, majúscules ni punt volat. */
export function normalizeName(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/l[·.•ŀ-]?l/g, "ll")
    .replace(/ŀl/g, "ll")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Noms alternatius acceptats. */
export const ALT_NAMES: Record<string, string[]> = {
  W: ["Wolframi", "Wolfram"],
};
