import { projectTypeOptions } from "../../data/projectTypes";
import { useProjectRequestForm } from "../../hooks/useProjectRequestForm";
import type { ProjectTypePreset } from "../../types/projectRequest";
import { fieldLimits } from "../../utils/validation";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Field } from "./Field";

interface ProjectRequestFormProps {
  preset: ProjectTypePreset | null;
}

export function ProjectRequestForm({ preset }: ProjectRequestFormProps) {
  const {
    values,
    errors,
    status,
    submitError,
    created,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  } = useProjectRequestForm(preset);

  if (status === "success" && created) {
    return (
      <div className="success" role="status">
        <span className="success__icon">
          <Icon name="check" size={28} />
        </span>
        <h3 className="success__title">Solicitação enviada!</h3>
        <p className="success__text">
          Recebi os detalhes do seu projeto e entrarei em contato em breve pelo
          WhatsApp ou e-mail informados.
        </p>
        <p className="success__protocol">
          Protocolo{" "}
          <strong>{created.id.slice(0, 8).toUpperCase()}</strong>
        </p>
        <Button variant="secondary" onClick={reset}>
          Enviar nova solicitação
        </Button>
      </div>
    );
  }

  const submitting = status === "submitting";
  const descriptionLength = values.description.length;

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__grid">
        <Field name="client_name" label="Nome" error={errors.client_name}>
          {(control) => (
            <input
              {...control}
              className="input"
              type="text"
              name="client_name"
              autoComplete="name"
              placeholder="Seu nome completo"
              maxLength={fieldLimits.client_name.max}
              value={values.client_name}
              onChange={handleChange("client_name")}
              onBlur={handleBlur("client_name")}
              disabled={submitting}
            />
          )}
        </Field>

        <Field name="client_email" label="E-mail" error={errors.client_email}>
          {(control) => (
            <input
              {...control}
              className="input"
              type="email"
              name="client_email"
              autoComplete="email"
              inputMode="email"
              placeholder="voce@exemplo.com"
              maxLength={fieldLimits.client_email.max}
              value={values.client_email}
              onChange={handleChange("client_email")}
              onBlur={handleBlur("client_email")}
              disabled={submitting}
            />
          )}
        </Field>

        <Field name="whatsapp" label="WhatsApp" error={errors.whatsapp}>
          {(control) => (
            <input
              {...control}
              className="input"
              type="tel"
              name="whatsapp"
              autoComplete="tel"
              inputMode="tel"
              placeholder="84999999999"
              maxLength={fieldLimits.whatsapp.max}
              value={values.whatsapp}
              onChange={handleChange("whatsapp")}
              onBlur={handleBlur("whatsapp")}
              disabled={submitting}
            />
          )}
        </Field>

        <Field
          name="project_type"
          label="Tipo de projeto"
          error={errors.project_type}
        >
          {(control) => (
            <select
              {...control}
              className="input input--select"
              name="project_type"
              value={values.project_type}
              onChange={handleChange("project_type")}
              onBlur={handleBlur("project_type")}
              disabled={submitting}
            >
              <option value="" disabled>
                Selecione uma opção
              </option>
              {projectTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field name="deadline" label="Prazo desejado" error={errors.deadline}>
          {(control) => (
            <input
              {...control}
              className="input"
              type="text"
              name="deadline"
              placeholder="Ex.: 30 dias"
              maxLength={fieldLimits.deadline.max}
              value={values.deadline}
              onChange={handleChange("deadline")}
              onBlur={handleBlur("deadline")}
              disabled={submitting}
            />
          )}
        </Field>

        <Field name="budget" label="Orçamento" error={errors.budget}>
          {(control) => (
            <input
              {...control}
              className="input"
              type="text"
              name="budget"
              placeholder="Ex.: R$ 1.000 - R$ 2.000"
              maxLength={fieldLimits.budget.max}
              value={values.budget}
              onChange={handleChange("budget")}
              onBlur={handleBlur("budget")}
              disabled={submitting}
            />
          )}
        </Field>

        <Field
          name="description"
          label="Descrição do projeto"
          error={errors.description}
          full
          hint={`${descriptionLength}/${fieldLimits.description.max} caracteres`}
        >
          {(control) => (
            <textarea
              {...control}
              className="input input--textarea"
              name="description"
              rows={6}
              placeholder="Conte o que você precisa, para quem é e o que espera alcançar."
              maxLength={fieldLimits.description.max}
              value={values.description}
              onChange={handleChange("description")}
              onBlur={handleBlur("description")}
              disabled={submitting}
            />
          )}
        </Field>
      </div>

      {status === "error" && submitError && (
        <div className="alert" role="alert">
          <Icon name="alert" size={18} />
          <p>{submitError}</p>
        </div>
      )}

      <div className="form__footer">
        <p className="form__note">
          Seus dados são usados apenas para entrar em contato sobre o projeto.
        </p>
        <Button type="submit" size="lg" loading={submitting}>
          {submitting ? "Enviando..." : "Enviar solicitação"}
          {!submitting && <Icon name="send" size={18} />}
        </Button>
      </div>
    </form>
  );
}
