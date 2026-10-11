export const navItems = [
  { id: "inicio", label: "Início" },
  { id: "servicos", label: "Serviços" },
  { id: "projetos", label: "Projetos" },
  { id: "sobre", label: "Sobre" },
] as const;

export const requestSectionId = "solicitar";

export const sectionIds: string[] = [
  ...navItems.map((item) => item.id),
  requestSectionId,
];
