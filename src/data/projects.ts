export interface ProjectItem {
  title: string;
  description: string;
  tags: string[];
  href?: string;
}

export const projects: ProjectItem[] = [
  {
    title: "Plataforma de gestão",
    description:
      "Sistema web com autenticação, painel administrativo e relatórios para acompanhamento de operações.",
    tags: ["React", "FastAPI", "PostgreSQL"],
    href: "https://github.com/PedroHeitor12567/gremio-ifrn-frontend",
  },
  {
    title: "API de serviços",
    description:
      "API REST com arquitetura em camadas, validação rigorosa, migrações e cobertura de testes automatizados.",
    tags: ["Python", "SQLAlchemy", "Docker"],
    href: "https://github.com/PedroHeitor12567/SentinelCore-backend",
  },
  {
    title: "Site institucional",
    description:
      "Site responsivo com foco em desempenho, acessibilidade e identidade visual consistente.",
    tags: ["TypeScript", "Vite", "CSS"],
    href: "https://github.com/SIXBRO-CORPORATION/intercurso-ifrn-mobile",
  },
];
