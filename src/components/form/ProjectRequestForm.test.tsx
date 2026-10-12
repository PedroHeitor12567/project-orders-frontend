import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectRequestForm } from "./ProjectRequestForm";

const fetchMock = vi.fn();

function jsonResponse(data: unknown, status = 200, headers: HeadersInit = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", ...headers },
    });
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText("Nome"), "João Silva");
    await user.type(screen.getByLabelText("E-mail"), "joao@example.com");
    await user.type(screen.getByLabelText("WhatsApp"), "84999999999");
    await user.selectOptions(screen.getByLabelText("Tipo de projeto"), "LANDING_PAGE");
    await user.type(screen.getByLabelText("Prazo desejado"), "30 dias");
    await user.type(screen.getByLabelText("Orçamento"), "R$ 1.000");
    await user.type(
        screen.getByLabelText("Descrição do projeto"),
        "Preciso de uma landing page para apresentar minha empresa.",
    );
}

describe("ProjectRequestForm", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        fetchMock.mockReset();
    });

    it("shows validation errors and does not call the API when empty", async () => {
        const user = userEvent.setup();
        render(<ProjectRequestForm preset={null} />);

        await user.click(screen.getByRole("button", { name: /enviar solicitação/i }));

        expect(screen.getByText("O nome é obrigatório.")).toBeInTheDocument();
        expect(screen.getByLabelText("Nome")).toHaveFocus();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("preselects the project type from a service card", () => {
        render(<ProjectRequestForm preset={{ type: "API_BACKEND", id: 1 }} />);

        expect(screen.getByLabelText("Tipo de projeto")).toHaveValue("API_BACKEND");
    });

    it("keeps the honeypot hidden from users and assistive technology", () => {
        render(<ProjectRequestForm preset={null} />);

        const honeypot = document.getElementById("field-website") as HTMLInputElement;

        expect(honeypot).toHaveAttribute("tabindex", "-1");
        expect(honeypot.closest("[aria-hidden='true']")).not.toBeNull();
    });

    it("submits a valid request without status or honeypot and shows the confirmation", async () => {
        const user = userEvent.setup();
        fetchMock.mockResolvedValue(
            jsonResponse(
                {
                    id: "7f6a9c0e-7d83-4d2a-8f8c-2f7f9e5c4a11",
                    client_name: "João Silva",
                    client_email: "joao@example.com",
                    whatsapp: "84999999999",
                    project_type: "LANDING_PAGE",
                    description: "Preciso de uma landing page para apresentar minha empresa.",
                    deadline: "30 dias",
                    budget: "R$ 1.000",
                    status: "PENDING",
                    created_at: "2026-10-11T10:00:00Z",
                },
                201,
            ),
        );
        render(<ProjectRequestForm preset={null} />);

        await fillValidForm(user);
        await user.click(screen.getByRole("button", { name: /enviar solicitação/i }));

        expect(await screen.findByText("Solicitação enviada!")).toBeInTheDocument();
        expect(screen.getByText("7F6A9C0E")).toBeInTheDocument();

        const sent = JSON.parse((fetchMock.mock.calls[0] as [string, RequestInit])[1].body as string);
        expect(sent).not.toHaveProperty("status");
        expect(sent).not.toHaveProperty("website");
        expect(sent.project_type).toBe("LANDING_PAGE");
    });

    it("highlights fields rejected by the backend", async () => {
        const user = userEvent.setup();
        fetchMock.mockResolvedValue(
            jsonResponse(
                {
                    detail: "Invalid project request.",
                    errors: [{ field: "client_email", message: "invalid" }],
                },
                422,
            ),
        );
        render(<ProjectRequestForm preset={null} />);

        await fillValidForm(user);
        await user.click(screen.getByRole("button", { name: /enviar solicitação/i }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Revise os campos destacados");
        expect(screen.getByLabelText("E-mail")).toHaveAttribute("aria-invalid", "true");
        await waitFor(() => expect(screen.getByLabelText("E-mail")).toHaveFocus());
    });

    it("shows the rate limit message and keeps the typed data", async () => {
        const user = userEvent.setup();
        fetchMock.mockResolvedValue(
            jsonResponse({ detail: "Too many requests. Try again later." }, 429, {
                "Retry-After": "30",
            }),
        );
        render(<ProjectRequestForm preset={null} />);

        await fillValidForm(user);
        await user.click(screen.getByRole("button", { name: /enviar solicitação/i }));

        expect(await screen.findByRole("alert")).toHaveTextContent("30 segundos");
        expect(screen.getByLabelText("Nome")).toHaveValue("João Silva");
    });

    it("allows sending a new request after success", async () => {
        const user = userEvent.setup();
        fetchMock.mockResolvedValue(
            jsonResponse({ id: "abcdef12-0000", status: "PENDING", created_at: "2026-10-11T10:00:00Z" }, 201),
        );
        render(<ProjectRequestForm preset={null} />);

        await fillValidForm(user);
        await user.click(screen.getByRole("button", { name: /enviar solicitação/i }));
        await user.click(await screen.findByRole("button", { name: /enviar nova solicitação/i }));

        expect(screen.getByLabelText("Nome")).toHaveValue("");
    });
});