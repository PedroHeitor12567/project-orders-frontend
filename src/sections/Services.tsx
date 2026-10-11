import { SectionHeading } from "../components/ui/SectionHeading";
import { Icon } from "../components/ui/Icon";
import { TagList } from "../components/ui/Tag";
import { services } from "../data/services";
import type { ProjectType } from "../types/projectRequest";

interface ServicesProps {
  onSelect: (type: ProjectType) => void;
}

export function Services({ onSelect }: ServicesProps) {
  return (
    <section
      id="servicos"
      className="section"
      aria-labelledby="servicos-title"
    >
      <div className="container">
        <SectionHeading
          id="servicos-title"
          eyebrow="Serviços"
          title="Soluções para cada etapa do seu produto"
          description="Escolha o tipo de projeto que mais se aproxima da sua necessidade. Se não encontrar, a solicitação aceita qualquer ideia."
        />

        <ul className="grid grid--services">
          {services.map((service) => (
            <li key={service.type}>
              <article className="card">
                <span className="card__icon">
                  <Icon name={service.icon} size={22} />
                </span>
                <h3 className="card__title">{service.title}</h3>
                <p className="card__text">{service.description}</p>
                <TagList items={service.tags} label={`Tecnologias de ${service.title}`} />
                <button
                  type="button"
                  className="card__action"
                  onClick={() => onSelect(service.type)}
                >
                  Solicitar este projeto
                  <Icon name="arrow" size={16} />
                </button>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
