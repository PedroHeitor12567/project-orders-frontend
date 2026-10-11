import type { ProjectType } from "../types/projectRequest";

export const projectTypeOptions: { value: ProjectType; label: string }[] = [
  { value: "LANDING_PAGE", label: "Landing page" },
  { value: "WEBSITE", label: "Site institucional" },
  { value: "WEB_SYSTEM", label: "Sistema web" },
  { value: "API_BACKEND", label: "API / Backend" },
  { value: "FULL_STACK", label: "Aplicação full stack" },
  { value: "ECOMMERCE", label: "E-commerce" },
  { value: "OTHER", label: "Outro" },
];
