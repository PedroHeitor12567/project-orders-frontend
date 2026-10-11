import { useEffect, useState, type MouseEvent } from "react";
import { navItems, requestSectionId } from "../../data/navigation";
import { classNames } from "../../utils/classNames";
import { scrollToSection } from "../../utils/scroll";
import { Brand } from "../ui/Brand";
import { ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icon";

interface NavbarProps {
  activeId: string;
}

export function Navbar({ activeId }: NavbarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth >= 860) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  function handleNavigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    setOpen(false);
    scrollToSection(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Brand />

        <nav className="navbar__nav" aria-label="Principal">
          <ul className="navbar__links">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  className={classNames(
                    "navbar__link",
                    activeId === item.id && "navbar__link--active",
                  )}
                  href={`#${item.id}`}
                  aria-current={activeId === item.id ? "true" : undefined}
                  onClick={(event) => handleNavigate(event, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <ButtonLink
            className="navbar__cta"
            href={`#${requestSectionId}`}
            size="md"
            onClick={(event) => handleNavigate(event, requestSectionId)}
          >
            Solicitar projeto
          </ButtonLink>

          <button
            type="button"
            className="navbar__toggle"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((current) => !current)}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="navbar__menu">
          <nav className="container" aria-label="Menu móvel">
            <ul className="navbar__menu-list">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    className={classNames(
                      "navbar__menu-link",
                      activeId === item.id && "navbar__menu-link--active",
                    )}
                    href={`#${item.id}`}
                    onClick={(event) => handleNavigate(event, item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <ButtonLink
                  href={`#${requestSectionId}`}
                  fullWidth
                  size="lg"
                  onClick={(event) => handleNavigate(event, requestSectionId)}
                >
                  Solicitar projeto
                </ButtonLink>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
