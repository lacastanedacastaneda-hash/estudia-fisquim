// Dades d'elements. De moment només inclou el que necessita el mòdul d'ions
// (elements amb ions habituals a 3r d'ESO). El mòdul de la taula periòdica
// l'ampliarà amb massa, grup, període i tipus.

export type ChemElement = {
  z: number;
  symbol: string;
  name: string;
  /** Càrregues dels ions habituals (positives = cations, negatives = anions). */
  ions: number[];
};

export const ELEMENTS: ChemElement[] = [
  { z: 1, symbol: "H", name: "Hidrogen", ions: [1, -1] },
  { z: 3, symbol: "Li", name: "Liti", ions: [1] },
  { z: 4, symbol: "Be", name: "Beril·li", ions: [2] },
  { z: 7, symbol: "N", name: "Nitrogen", ions: [-3] },
  { z: 8, symbol: "O", name: "Oxigen", ions: [-2] },
  { z: 9, symbol: "F", name: "Fluor", ions: [-1] },
  { z: 11, symbol: "Na", name: "Sodi", ions: [1] },
  { z: 12, symbol: "Mg", name: "Magnesi", ions: [2] },
  { z: 13, symbol: "Al", name: "Alumini", ions: [3] },
  { z: 15, symbol: "P", name: "Fòsfor", ions: [-3] },
  { z: 16, symbol: "S", name: "Sofre", ions: [-2] },
  { z: 17, symbol: "Cl", name: "Clor", ions: [-1] },
  { z: 19, symbol: "K", name: "Potassi", ions: [1] },
  { z: 20, symbol: "Ca", name: "Calci", ions: [2] },
  { z: 24, symbol: "Cr", name: "Crom", ions: [3] },
  { z: 25, symbol: "Mn", name: "Manganès", ions: [2] },
  { z: 26, symbol: "Fe", name: "Ferro", ions: [2, 3] },
  { z: 27, symbol: "Co", name: "Cobalt", ions: [2, 3] },
  { z: 28, symbol: "Ni", name: "Níquel", ions: [2, 3] },
  { z: 29, symbol: "Cu", name: "Coure", ions: [1, 2] },
  { z: 30, symbol: "Zn", name: "Zinc", ions: [2] },
  { z: 34, symbol: "Se", name: "Seleni", ions: [-2] },
  { z: 35, symbol: "Br", name: "Brom", ions: [-1] },
  { z: 37, symbol: "Rb", name: "Rubidi", ions: [1] },
  { z: 38, symbol: "Sr", name: "Estronci", ions: [2] },
  { z: 47, symbol: "Ag", name: "Plata", ions: [1] },
  { z: 50, symbol: "Sn", name: "Estany", ions: [2, 4] },
  { z: 53, symbol: "I", name: "Iode", ions: [-1] },
  { z: 55, symbol: "Cs", name: "Cesi", ions: [1] },
  { z: 56, symbol: "Ba", name: "Bari", ions: [2] },
  { z: 79, symbol: "Au", name: "Or", ions: [1, 3] },
  { z: 80, symbol: "Hg", name: "Mercuri", ions: [2] },
  { z: 82, symbol: "Pb", name: "Plom", ions: [2, 4] },
];
