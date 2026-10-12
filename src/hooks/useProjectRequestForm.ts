import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import { ApiError } from "../services/api";
import { createProjectRequest } from "../services/projectRequests";
import type {
  FieldName,
  FormErrors,
  FormField,
  FormValues,
  ProjectRequestResponse,
  ProjectTypePreset,
  SubmitStatus,
} from "../types/projectRequest";
import {
  fieldOrder,
  toPayload,
  validateAll,
  validateField,
} from "../utils/validation";

const initialValues: FormValues = {
  client_name: "",
  client_email: "",
  whatsapp: "",
  project_type: "",
  description: "",
  deadline: "",
  budget: "",
  website: "",
};

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function focusField(field: FieldName): void {
  document.getElementById(`field-${field}`)?.focus();
}

export function useProjectRequestForm(preset: ProjectTypePreset | null) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [created, setCreated] = useState<ProjectRequestResponse | null>(null);
  const [focusTarget, setFocusTarget] = useState<FieldName | null>(null);

  useEffect(() => {
    if (focusTarget && status !== "submitting") {
      focusField(focusTarget);
      setFocusTarget(null);
    }
  }, [focusTarget, status]);

  useEffect(() => {
    if (!preset) {
      return;
    }

    setValues((current) => ({ ...current, project_type: preset.type }));
    setErrors((current) => ({ ...current, project_type: undefined }));
  }, [preset]);

  const handleChange = useCallback(
      (field: FormField) => (event: ChangeEvent<FieldElement>) => {
        const next = { ...values, [field]: event.target.value } as FormValues;

        setValues(next);

        if (field !== "website" && errors[field]) {
          setErrors((current) => ({
            ...current,
            [field]: validateField(field, next),
          }));
        }
      },
      [values, errors],
  );

  const handleBlur = useCallback(
      (field: FieldName) => (_event: FocusEvent<FieldElement>) => {
        setErrors((current) => ({
          ...current,
          [field]: validateField(field, values),
        }));
      },
      [values],
  );

  const handleSubmit = useCallback(
      async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (status === "submitting") {
          return;
        }

        const nextErrors = validateAll(values);
        setErrors(nextErrors);

        const firstInvalid = fieldOrder.find((field) => nextErrors[field]);

        if (firstInvalid) {
          focusField(firstInvalid);
          return;
        }

        setStatus("submitting");
        setSubmitError(null);

        try {
          const response = await createProjectRequest(toPayload(values));
          setCreated(response);
          setStatus("success");
        } catch (error) {
          if (error instanceof ApiError) {
            setErrors((current) => ({ ...current, ...error.fieldErrors }));
            setSubmitError(error.message);
            setFocusTarget(
                fieldOrder.find((field) => error.fieldErrors[field]) ?? null,
            );
          } else {
            setSubmitError("Ocorreu um erro inesperado. Tente novamente.");
          }

          setStatus("error");
        }
      },
      [status, values],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setStatus("idle");
    setSubmitError(null);
    setCreated(null);
  }, []);

  return {
    values,
    errors,
    status,
    submitError,
    created,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}