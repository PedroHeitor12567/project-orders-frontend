import { navItems, requestSectionId } from "../../data/navigation";
import { site } from "../../data/site";
import { Brand } from "../ui/Brand";
import { Icon } from "../ui/Icon";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__about">
          <Brand />
          <p className="footer__text">
            {site.role} focado em produtos digitais seguros, rápidos e bem
            construídos.
          </p>
        </div>

        <nav className="footer__column" aria-label="Rodapé">
          <h2 className="footer__title">Navegação</h2>
          <ul className="footer__list">
            {navItems.map((item) => (
              <li key={item.id}>
                <a className="footer__link" href={`#${item.id}`}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a className="footer__link" href={`#${requestSectionId}`}>
                Solicitar projeto
              </a>
            </li>
          </ul>
        </nav>

        <div className="footer__column">
          <h2 className="footer__title">Contato</h2>
          <ul className="footer__list">
            <li>
              <a className="footer__link footer__link--icon" href={`mailto:${site.email}`}>
                <Icon name="mail" size={16} />
                {site.email}
              </a>
            </li>
            <li>
              <a
                className="footer__link footer__link--icon"
                href={site.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Icon name="github" size={16} />
                GitHub
              </a>
            </li>
            <li>
              <a
                className="footer__link footer__link--icon"
                href={site.linkedin}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Icon name="linkedin" size={16} />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © {year} {site.owner}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
