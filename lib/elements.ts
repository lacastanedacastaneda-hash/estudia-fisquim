// Dades d'elements per als exercicis. El mòdul de la taula periòdica
// l'ampliarà amb massa, grup, període i tipus.

export type ChemElement = {
  z: number;
  symbol: string;
  name: string;
  /** Càrregues dels ions habituals (positives = cations, negatives = anions). Buit si no en forma. */
  ions: number[];
  /** Nombres màssics (A) d'isòtops reals de l'element. */
  isotopes: number[];
};

export const ELEMENTS: ChemElement[] = [
  { z: 1, symbol: "H", name: "Hidrogen", ions: [1, -1], isotopes: [1, 2, 3] },
  { z: 2, symbol: "He", name: "Heli", ions: [], isotopes: [3, 4] },
  { z: 3, symbol: "Li", name: "Liti", ions: [1], isotopes: [6, 7] },
  { z: 4, symbol: "Be", name: "Beril·li", ions: [2], isotopes: [9] },
  { z: 6, symbol: "C", name: "Carboni", ions: [], isotopes: [12, 13, 14] },
  { z: 7, symbol: "N", name: "Nitrogen", ions: [-3], isotopes: [14, 15] },
  { z: 8, symbol: "O", name: "Oxigen", ions: [-2], isotopes: [16, 17, 18] },
  { z: 9, symbol: "F", name: "Fluor", ions: [-1], isotopes: [19] },
  { z: 10, symbol: "Ne", name: "Neó", ions: [], isotopes: [20, 21, 22] },
  { z: 11, symbol: "Na", name: "Sodi", ions: [1], isotopes: [23] },
  { z: 12, symbol: "Mg", name: "Magnesi", ions: [2], isotopes: [24, 25, 26] },
  { z: 13, symbol: "Al", name: "Alumini", ions: [3], isotopes: [27] },
  { z: 15, symbol: "P", name: "Fòsfor", ions: [-3], isotopes: [31] },
  { z: 16, symbol: "S", name: "Sofre", ions: [-2], isotopes: [32, 33, 34, 36] },
  { z: 17, symbol: "Cl", name: "Clor", ions: [-1], isotopes: [35, 37] },
  { z: 18, symbol: "Ar", name: "Argó", ions: [], isotopes: [36, 38, 40] },
  { z: 19, symbol: "K", name: "Potassi", ions: [1], isotopes: [39, 40, 41] },
  { z: 20, symbol: "Ca", name: "Calci", ions: [2], isotopes: [40, 42, 43, 44, 46, 48] },
  { z: 24, symbol: "Cr", name: "Crom", ions: [3], isotopes: [50, 52, 53, 54] },
  { z: 25, symbol: "Mn", name: "Manganès", ions: [2], isotopes: [55] },
  { z: 26, symbol: "Fe", name: "Ferro", ions: [2, 3], isotopes: [54, 56, 57, 58] },
  { z: 27, symbol: "Co", name: "Cobalt", ions: [2, 3], isotopes: [59, 60] },
  { z: 28, symbol: "Ni", name: "Níquel", ions: [2, 3], isotopes: [58, 60, 61, 62, 64] },
  { z: 29, symbol: "Cu", name: "Coure", ions: [1, 2], isotopes: [63, 65] },
  { z: 30, symbol: "Zn", name: "Zinc", ions: [2], isotopes: [64, 66, 67, 68, 70] },
  { z: 34, symbol: "Se", name: "Seleni", ions: [-2], isotopes: [76, 77, 78, 80, 82] },
  { z: 35, symbol: "Br", name: "Brom", ions: [-1], isotopes: [79, 81] },
  { z: 37, symbol: "Rb", name: "Rubidi", ions: [1], isotopes: [85, 87] },
  { z: 38, symbol: "Sr", name: "Estronci", ions: [2], isotopes: [84, 86, 87, 88, 90] },
  { z: 47, symbol: "Ag", name: "Plata", ions: [1], isotopes: [107, 109] },
  { z: 50, symbol: "Sn", name: "Estany", ions: [2, 4], isotopes: [116, 118, 120] },
  { z: 53, symbol: "I", name: "Iode", ions: [-1], isotopes: [127, 131] },
  { z: 55, symbol: "Cs", name: "Cesi", ions: [1], isotopes: [133, 137] },
  { z: 56, symbol: "Ba", name: "Bari", ions: [2], isotopes: [134, 136, 137, 138] },
  { z: 79, symbol: "Au", name: "Or", ions: [1, 3], isotopes: [197] },
  { z: 80, symbol: "Hg", name: "Mercuri", ions: [2], isotopes: [198, 199, 200, 201, 202, 204] },
  { z: 82, symbol: "Pb", name: "Plom", ions: [2, 4], isotopes: [204, 206, 207, 208] },
  { z: 92, symbol: "U", name: "Urani", ions: [], isotopes: [234, 235, 238] },
];
