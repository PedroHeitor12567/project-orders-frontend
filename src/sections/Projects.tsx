import { Icon } from "../components/ui/Icon";
import { SectionHeading } from "../components/ui/SectionHeading";
import { TagList } from "../components/ui/Tag";
import { projects } from "../data/projects";

export function Projects() {
  return (
    <section
      id="projetos"
      className="section section--surface"
      aria-labelledby="projetos-title"
    >
      <div className="container">
        <SectionHeading
          id="projetos-title"
          eyebrow="Projetos"
          title="Trabalhos que mostram como eu construo"
          description="Uma seleção de projetos que refletem organização, atenção aos detalhes e preocupação com manutenção."
        />

        <ul className="grid grid--projects">
          {projects.map((project, index) => (
            <li key={project.title}>
              <article className="card card--project">
                <span className="card__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="card__title">{project.title}</h3>
                <p className="card__text">{project.description}</p>
                <TagList items={project.tags} label={`Tecnologias de ${project.title}`} />
                {project.href && (
                  <a
                    className="card__action"
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Ver projeto
                    <Icon name="external" size={16} />
                  </a>
                )}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
