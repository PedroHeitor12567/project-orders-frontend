import { describe, expect, it } from "vitest";
import type { FormValues } from "../types/projectRequest";
import { toPayload, validateAll, validateField } from "./validation";

const validValues: FormValues = {
    client_name: "João Silva",
    client_email: "joao@example.com",
    whatsapp: "84999999999",
    project_type: "LANDING_PAGE",
    description: "Preciso de uma landing page para apresentar minha empresa.",
    deadline: "30 dias",
    budget: "R$ 1.000 - R$ 2.000",
    website: "",
};

describe("validateAll", () => {
    it("accepts a valid request", () => {
        expect(validateAll(validValues)).toEqual({});
    });

    it("reports every required field when empty", () => {
        const errors = validateAll({
            ...validValues,
            client_name: "",
            client_email: "",
            whatsapp: "",
            project_type: "",
            description: "",
            deadline: "",
            budget: "",
        });

        expect(Object.keys(errors)).toHaveLength(7);
    });
});

describe("validateField", () => {
    it("rejects an invalid e-mail", () => {
        expect(
            validateField("client_email", { ...validValues, client_email: "email-invalido" }),
        ).toBe("Informe um e-mail válido.");
    });

    it("enforces the backend minimum lengths", () => {
        expect(validateField("client_name", { ...validValues, client_name: "J" })).toBeDefined();
        expect(validateField("whatsapp", { ...validValues, whatsapp: "1234567" })).toBeDefined();
        expect(
            validateField("description", { ...validValues, description: "curta demais" }),
        ).toBeDefined();
        expect(validateField("deadline", { ...validValues, deadline: "a" })).toBeDefined();
    });

    it("enforces the backend maximum lengths", () => {
        expect(
            validateField("description", { ...validValues, description: "a".repeat(3001) }),
        ).toBeDefined();
        expect(
            validateField("client_name", { ...validValues, client_name: "a".repeat(101) }),
        ).toBeDefined();
    });

    it("ignores surrounding whitespace", () => {
        expect(validateField("budget", { ...validValues, budget: "   " })).toBe(
            "O orçamento é obrigatório.",
        );
    });
});

describe("toPayload", () => {
    it("trims values and never includes status", () => {
        const payload = toPayload({ ...validValues, client_name: "  João Silva  " });

        expect(payload.client_name).toBe("João Silva");
        expect(payload).not.toHaveProperty("status");
    });

    it("omits the honeypot when empty and includes it when filled", () => {
        expect(toPayload(validValues)).not.toHaveProperty("website");
        expect(toPayload({ ...validValues, website: "spam.example" }).website).toBe(
            "spam.example",
        );
    });
});