const baseUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function messageForStatus(status: number): string {
  if (status === 422 || status === 400) {
    return "Alguns dados não foram aceitos. Revise as informações e tente novamente.";
  }

  if (status === 429) {
    return "Muitas solicitações em pouco tempo. Aguarde alguns instantes e tente novamente.";
  }

  if (status >= 500) {
    return "O servidor encontrou um problema. Tente novamente em alguns minutos.";
  }

  return "Não foi possível enviar sua solicitação. Tente novamente.";
}

export async function request<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      0,
    );
  }

  if (!response.ok) {
    throw new ApiError(messageForStatus(response.status), response.status);
  }

  return (await response.json()) as T;
}
