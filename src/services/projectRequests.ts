import type {
  ProjectRequestPayload,
  ProjectRequestResponse,
} from "../types/projectRequest";
import { request } from "./api";

export function createProjectRequest(
  payload: ProjectRequestPayload,
): Promise<ProjectRequestResponse> {
  return request<ProjectRequestResponse>("/api/v1/project-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
