import type {
  FieldName,
  FormErrors,
  FormValues,
  ProjectRequestBody,
  ProjectType,
} from "../types/projectRequest";

interface TextRule {
  label: string;
  min: number;
  max: number;
}

export const fieldLimits: Record<Exclude<FieldName, "project_type">, TextRule> = {
  client_name: { label: "O nome", min: 2, max: 100 },
  client_email: { label: "O e-mail", min: 5, max: 254 },
  whatsapp: { label: "O WhatsApp", min: 8, max: 20 },
  description: { label: "A descrição", min: 20, max: 3000 },
  deadline: { label: "O prazo", min: 2, max: 100 },
  budget: { label: "O orçamento", min: 1, max: 100 },
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateField(
    field: FieldName,
    values: FormValues,
): string | undefined {
  if (field === "project_type") {
    return values.project_type ? undefined : "Selecione o tipo de projeto.";
  }

  const rule = fieldLimits[field];
  const value = values[field].trim();

  if (value.length === 0) {
    return `${rule.label} é obrigatório.`;
  }

  if (field === "client_email" && !emailPattern.test(value)) {
    return "Informe um e-mail válido.";
  }

  if (value.length < rule.min) {
    return `${rule.label} deve ter ao menos ${rule.min} caracteres.`;
  }

  if (value.length > rule.max) {
    return `${rule.label} deve ter no máximo ${rule.max} caracteres.`;
  }

  return undefined;
}

export const fieldOrder: FieldName[] = [
  "client_name",
  "client_email",
  "whatsapp",
  "project_type",
  "deadline",
  "budget",
  "description",
];

export function validateAll(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  for (const field of fieldOrder) {
    const message = validateField(field, values);

    if (message) {
      errors[field] = message;
    }
  }

  return errors;
}

export function toPayload(values: FormValues): ProjectRequestBody {
  const website = values.website.trim();

  return {
    client_name: values.client_name.trim(),
    client_email: values.client_email.trim(),
    whatsapp: values.whatsapp.trim(),
    project_type: values.project_type as ProjectType,
    description: values.description.trim(),
    deadline: values.deadline.trim(),
    budget: values.budget.trim(),
    ...(website ? { website } : {}),
  };
}