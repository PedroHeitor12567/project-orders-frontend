import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, REQUEST_TIMEOUT_MS, request } from "./api";
import { createProjectRequest } from "./projectRequests";

const body = {
    client_name: "João Silva",
    client_email: "joao@example.com",
    whatsapp: "84999999999",
    project_type: "LANDING_PAGE" as const,
    description: "Preciso de uma landing page para apresentar minha empresa.",
    deadline: "30 dias",
    budget: "R$ 1.000",
};

function jsonResponse(data: unknown, status = 200, headers: HeadersInit = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", ...headers },
    });
}

describe("createProjectRequest", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
        fetchMock.mockReset();
    });

    it("posts the JSON body to the project requests endpoint", async () => {
        fetchMock.mockResolvedValue(
            jsonResponse({ ...body, id: "abc", status: "PENDING", created_at: "2026-10-11T10:00:00Z" }, 201),
        );

        const result = await createProjectRequest(body);

        const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
        expect(url).toBe("/api/v1/project-requests");
        expect(init.method).toBe("POST");
        expect(JSON.parse(init.body as string)).toEqual(body);
        expect(result.status).toBe("PENDING");
    });

    it("maps 422 field errors from the backend", async () => {
        fetchMock.mockResolvedValue(
            jsonResponse(
                {
                    detail: "Invalid project request.",
                    errors: [
                        { field: "client_email", message: "value is not a valid email address" },
                        { field: "unknown_field", message: "ignored" },
                    ],
                },
                422,
            ),
        );

        const error = await createProjectRequest(body).catch((e: unknown) => e);

        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(422);
        expect(Object.keys((error as ApiError).fieldErrors)).toEqual(["client_email"]);
    });

    it("exposes Retry-After on 429 responses", async () => {
        fetchMock.mockResolvedValue(
            jsonResponse({ detail: "Too many requests. Try again later." }, 429, {
                "Retry-After": "42",
            }),
        );

        const error = (await createProjectRequest(body).catch((e: unknown) => e)) as ApiError;

        expect(error.status).toBe(429);
        expect(error.retryAfterSeconds).toBe(42);
        expect(error.message).toContain("42");
    });

    it("handles 413 and 500 with friendly messages", async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse({ detail: "Payload too large." }, 413));
        fetchMock.mockResolvedValueOnce(jsonResponse({ detail: "Internal server error." }, 500));

        const tooLarge = (await createProjectRequest(body).catch((e: unknown) => e)) as ApiError;
        const serverError = (await createProjectRequest(body).catch((e: unknown) => e)) as ApiError;

        expect(tooLarge.message).toContain("grande demais");
        expect(serverError.message).toContain("servidor");
    });

    it("reports a connection failure", async () => {
        fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

        const error = (await createProjectRequest(body).catch((e: unknown) => e)) as ApiError;

        expect(error.status).toBe(0);
        expect(error.message).toContain("conectar");
    });

    it("rejects an unexpected success payload", async () => {
        fetchMock.mockResolvedValue(jsonResponse({ ok: true }, 201));

        const error = (await createProjectRequest(body).catch((e: unknown) => e)) as ApiError;

        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toContain("inesperada");
    });

    it("aborts when the server takes too long", async () => {
        vi.useFakeTimers();
        fetchMock.mockImplementation(
            (_url: string, init: RequestInit) =>
                new Promise((_resolve, reject) => {
                    init.signal?.addEventListener("abort", () =>
                        reject(new DOMException("Aborted", "AbortError")),
                    );
                }),
        );

        const pending = request("/api/v1/project-requests", { method: "POST" }).catch(
            (e: unknown) => e,
        );
        await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);
        const error = (await pending) as ApiError;

        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toContain("demorou");
    });
});