import type { ReactNode } from "react";
import type { FieldName } from "../../types/projectRequest";
import { Icon } from "../ui/Icon";

export interface FieldControlProps {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
}

interface FieldProps {
  name: FieldName;
  label: string;
  error?: string;
  hint?: ReactNode;
  full?: boolean;
  children: (control: FieldControlProps) => ReactNode;
}

export function Field({ name, label, error, hint, full, children }: FieldProps) {
  const id = `field-${name}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={full ? "field field--full" : "field"}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>

      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
      })}

      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}

      <p id={errorId} className="field__error" aria-live="polite">
        {error && (
          <>
            <Icon name="alert" size={14} />
            {error}
          </>
        )}
      </p>
    </div>
  );
}
