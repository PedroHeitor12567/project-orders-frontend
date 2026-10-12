export type ProjectType =
    | "LANDING_PAGE"
    | "WEBSITE"
    | "WEB_SYSTEM"
    | "API_BACKEND"
    | "FULL_STACK"
    | "ECOMMERCE"
    | "OTHER";

export type ProjectRequestStatus =
    | "PENDING"
    | "CONTACTED"
    | "IN_NEGOTIATION"
    | "APPROVED"
    | "REJECTED"
    | "COMPLETED";

export interface ProjectRequestPayload {
  client_name: string;
  client_email: string;
  whatsapp: string;
  project_type: ProjectType;
  description: string;
  deadline: string;
  budget: string;
}

export interface ProjectRequestBody extends ProjectRequestPayload {
  website?: string;
}

export interface ProjectRequestResponse extends ProjectRequestPayload {
  id: string;
  status: ProjectRequestStatus;
  created_at: string;
}

export type FieldName = keyof ProjectRequestPayload;

export type FormField = FieldName | "website";

export type FormValues = Omit<ProjectRequestPayload, "project_type"> & {
  project_type: ProjectType | "";
  website: string;
};

export type FormErrors = Partial<Record<FieldName, string>>;

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

export interface ProjectTypePreset {
  type: ProjectType;
  id: number;
}