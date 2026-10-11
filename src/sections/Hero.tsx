import { requestSectionId } from "../data/navigation";
import { scrollToSection } from "../utils/scroll";
import { ButtonLink } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";

export function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="badge">
            <span className="badge__dot" aria-hidden="true" />
            Disponível para novos projetos
          </p>

          <h1 id="hero-title" className="hero__title">
            Transformo ideias em{" "}
            <span className="text-gradient">produtos digitais sólidos</span>
          </h1>

          <p className="hero__lead">
            Sites, sistemas web e APIs desenvolvidos com foco em qualidade,
            segurança e desempenho. Descreva seu projeto e receba um retorno
            personalizado.
          </p>

          <div className="hero__actions">
            <ButtonLink
              href={`#${requestSectionId}`}
              size="lg"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(requestSectionId);
              }}
            >
              Solicitar projeto
              <Icon name="arrow" size={18} />
            </ButtonLink>
            <ButtonLink
              href="#servicos"
              variant="secondary"
              size="lg"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("servicos");
              }}
            >
              Ver serviços
            </ButtonLink>
          </div>

          <ul className="hero__meta" aria-label="Tecnologias principais">
            <li>Python</li>
            <li>FastAPI</li>
            <li>React</li>
            <li>PostgreSQL</li>
          </ul>
        </div>

        <div className="terminal" aria-hidden="true">
          <div className="terminal__bar">
            <span className="terminal__dot" />
            <span className="terminal__dot" />
            <span className="terminal__dot" />
            <span className="terminal__title">project-requests</span>
          </div>
          <pre className="terminal__body">
            <span className="code-method">POST</span>{" "}
            <span className="code-path">/api/v1/project-requests</span>
            {"\n\n"}
            {"{"}
            {"\n  "}
            <span className="code-key">"project_type"</span>:{" "}
            <span className="code-string">"WEB_SYSTEM"</span>,
            {"\n  "}
            <span className="code-key">"deadline"</span>:{" "}
            <span className="code-string">"30 dias"</span>,
            {"\n  "}
            <span className="code-key">"budget"</span>:{" "}
            <span className="code-string">"R$ 5.000"</span>
            {"\n"}
            {"}"}
            {"\n\n"}
            <span className="code-status">201 Created</span>
            {"\n"}
            <span className="code-key">"status"</span>:{" "}
            <span className="code-string">"PENDING"</span>
          </pre>
        </div>
      </div>
    </section>
  );
}
