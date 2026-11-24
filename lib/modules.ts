export type StudyModule = {
  id: string;
  href: string;
  title: string;
  description: string;
  available: boolean;
};

export const MODULES: StudyModule[] = [
  {
    id: "formulacio",
    href: "/formulacio",
    title: "Formulació inorgànica",
    description: "Passa de nom a fórmula i de fórmula a nom.",
    available: false,
  },
  {
    id: "taula",
    href: "/taula",
    title: "Taula periòdica",
    description: "Explora els elements i posa't a prova.",
    available: false,
  },
  {
    id: "ions",
    href: "/ions",
    title: "Ions: anions i cations",
    description: "Calcula protons i electrons i digues si és anió o catió.",
    available: true,
  },
  {
    id: "isotops",
    href: "/isotops",
    title: "Isòtops",
    description: "A partir de ᴬ_Z X, troba protons, neutrons i electrons.",
    available: true,
  },
  {
    id: "massa",
    href: "/massa",
    title: "Massa atòmica i molecular",
    description: "Mitjana ponderada d'isòtops i massa de molècules.",
    available: true,
  },
  {
    id: "configuracio",
    href: "/configuracio",
    title: "Configuració electrònica",
    description: "Escriu la configuració per capes i subnivells.",
    available: false,
  },
];
