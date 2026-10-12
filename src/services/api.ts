import type { FormErrors } from "../types/projectRequest";
import { fieldOrder } from "../utils/validation";

const baseUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export const REQUEST_TIMEOUT_MS = 15000;

const knownFields: ReadonlySet<string> = new Set(fieldOrder);

const FIELD_REJECTED_MESSAGE =
    "Este campo não foi aceito. Revise o valor informado.";

interface ApiErrorOptions {
  fieldErrors?: FormErrors;
  retryAfterSeconds?: number | null;
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: FormErrors;
  readonly retryAfterSeconds: number | null;

  constructor(message: string, status: number, options: ApiErrorOptions = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = options.fieldErrors ?? {};
    this.retryAfterSeconds = options.retryAfterSeconds ?? null;
  }
}

function parseRetryAfter(response: Response): number | null {
  const value = Number(response.headers.get("Retry-After"));

  return Number.isInteger(value) && value > 0 ? value : null;
}

function parseFieldErrors(body: unknown): FormErrors {
  const errors: FormErrors = {};

  if (typeof body !== "object" || body === null || !("errors" in body)) {
    return errors;
  }

  const items = (body as { errors: unknown }).errors;

  if (!Array.isArray(items)) {
    return errors;
  }

  for (const item of items) {
    const field =
        typeof item === "object" && item !== null
            ? (item as { field?: unknown }).field
            : undefined;

    if (typeof field === "string" && knownFields.has(field)) {
      errors[field as keyof FormErrors] = FIELD_REJECTED_MESSAGE;
    }
  }

  return errors;
}

function messageForStatus(
    status: number,
    fieldErrors: FormErrors,
    retryAfterSeconds: number | null,
): string {
  if (status === 429) {
    return retryAfterSeconds
        ? `Muitas solicitações em pouco tempo. Tente novamente em ${retryAfterSeconds} segundos.`
        : "Muitas solicitações em pouco tempo. Aguarde alguns instantes e tente novamente.";
  }

  if (status === 413) {
    return "Sua solicitação é grande demais. Reduza o texto e tente novamente.";
  }

  if (status === 422 || status === 400) {
    return Object.keys(fieldErrors).length > 0
        ? "Revise os campos destacados e tente novamente."
        : "Alguns dados não foram aceitos. Revise as informações e tente novamente.";
  }

  if (status >= 500) {
    return "O servidor encontrou um problema. Tente novamente em alguns minutos.";
  }

  return "Não foi possível enviar sua solicitação. Tente novamente.";
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function request<T>(path: string, init: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...init.headers,
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
          "O servidor demorou demais para responder. Tente novamente.",
          0,
      );
    }

    throw new ApiError(
        "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
        0,
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const body = await readJson(response);

  if (!response.ok) {
    const fieldErrors = parseFieldErrors(body);
    const retryAfterSeconds = parseRetryAfter(response);

    throw new ApiError(
        messageForStatus(response.status, fieldErrors, retryAfterSeconds),
        response.status,
        { fieldErrors, retryAfterSeconds },
    );
  }

  return body as T;
}