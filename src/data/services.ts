import type { IconName } from "../components/ui/Icon";
import type { ProjectType } from "../types/projectRequest";

export interface ServiceItem {
  type: ProjectType;
  title: string;
  description: string;
  tags: string[];
  icon: IconName;
}

export const services: ServiceItem[] = [
  {
    type: "LANDING_PAGE",
    title: "Landing page",
    description:
      "Uma página objetiva, rápida e pensada para converter visitantes em contatos.",
    tags: ["React", "SEO", "Responsivo"],
    icon: "layout",
  },
  {
    type: "WEBSITE",
    title: "Site institucional",
    description:
      "Presença digital profissional para apresentar sua empresa, serviços e diferenciais.",
    tags: ["Multi-página", "Performance", "Acessível"],
    icon: "globe",
  },
  {
    type: "WEB_SYSTEM",
    title: "Sistema web",
    description:
      "Painéis, áreas restritas e fluxos internos que organizam e automatizam sua operação.",
    tags: ["Autenticação", "Dashboards", "CRUD"],
    icon: "blocks",
  },
  {
    type: "API_BACKEND",
    title: "API e backend",
    description:
      "APIs REST seguras, bem documentadas e preparadas para crescer junto com o produto.",
    tags: ["FastAPI", "PostgreSQL", "Testes"],
    icon: "server",
  },
  {
    type: "FULL_STACK",
    title: "Aplicação full stack",
    description:
      "Do banco de dados à interface, uma solução completa entregue por uma única pessoa.",
    tags: ["React", "FastAPI", "Deploy"],
    icon: "layers",
  },
  {
    type: "ECOMMERCE",
    title: "E-commerce",
    description:
      "Loja virtual com catálogo, carrinho e integrações para vender com segurança.",
    tags: ["Catálogo", "Pagamentos", "Integrações"],
    icon: "cart",
  },
];
