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
            title={`Olá, somos a ${site.owner}`}
            description={`${site.role}, somos uma equipe interessada por transformar ideias e desafios em soluções digitais de verdade. Da concepção à entrega, desenvolvemos projetos sob medida, cuidando de cada detalhe para transformar qualquer ideia em software confiável, funcional e de qualidade.`}
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
