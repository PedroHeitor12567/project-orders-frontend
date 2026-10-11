import { Icon } from "../components/ui/Icon";
import { SectionHeading } from "../components/ui/SectionHeading";
import { TagList } from "../components/ui/Tag";
import { principles, stack } from "../data/about";
import { site } from "../data/site";

export function About() {
  return (
    <section id="sobre" className="section" aria-labelledby="sobre-title">
      <div className="container about">
        <div className="about__intro">
          <SectionHeading
            id="sobre-title"
            eyebrow="Sobre"
            title={`Olá, eu sou ${site.owner}`}
            description={`${site.role} apaixonado por transformar problemas reais em software confiável. Trabalho do banco de dados à interface, cuidando de cada camada com o mesmo nível de atenção.`}
          />
          <TagList items={stack} label="Stack principal" />
        </div>

        <ul className="principles">
          {principles.map((principle) => (
            <li key={principle} className="principles__item">
              <span className="principles__icon">
                <Icon name="check" size={16} />
              </span>
              {principle}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
