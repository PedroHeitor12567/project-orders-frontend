import { ProjectRequestForm } from "../components/form/ProjectRequestForm";
import { SectionHeading } from "../components/ui/SectionHeading";
import { processSteps } from "../data/about";
import { requestSectionId } from "../data/navigation";
import type { ProjectTypePreset } from "../types/projectRequest";

interface ProjectRequestProps {
  preset: ProjectTypePreset | null;
}

export function ProjectRequest({ preset }: ProjectRequestProps) {
  return (
    <section
      id={requestSectionId}
      className="section section--surface"
      aria-labelledby="solicitar-title"
    >
      <div className="container request">
        <div className="request__aside">
          <SectionHeading
            id="solicitar-title"
            eyebrow="Solicitar projeto"
            title="Vamos tirar sua ideia do papel"
            description="Preencha o formulário com os detalhes principais. Quanto mais claro o pedido, mais rápido consigo montar uma proposta."
          />

          <ol className="steps">
            {processSteps.map((step, index) => (
              <li key={step.title} className="steps__item">
                <span className="steps__number" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3 className="steps__title">{step.title}</h3>
                  <p className="steps__text">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="request__panel">
          <ProjectRequestForm preset={preset} />
        </div>
      </div>
    </section>
  );
}
