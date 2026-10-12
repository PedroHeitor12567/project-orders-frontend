import type {
  ProjectRequestBody,
  ProjectRequestResponse,
} from "../types/projectRequest";
import { ApiError, request } from "./api";

function isProjectRequestResponse(
    value: unknown,
): value is ProjectRequestResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<ProjectRequestResponse>;

  return (
      typeof candidate.id === "string" &&
      candidate.id.length > 0 &&
      typeof candidate.status === "string"
  );
}

export async function createProjectRequest(
    body: ProjectRequestBody,
): Promise<ProjectRequestResponse> {
  const data = await request<unknown>("/api/v1/project-requests", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!isProjectRequestResponse(data)) {
    throw new ApiError(
        "O servidor respondeu de forma inesperada. Tente novamente.",
        500,
    );
  }

  return data;
}