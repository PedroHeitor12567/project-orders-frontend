import { useCallback, useState } from "react";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { requestSectionId, sectionIds } from "./data/navigation";
import { useActiveSection } from "./hooks/useActiveSection";
import { About } from "./sections/About";
import { Hero } from "./sections/Hero";
import { ProjectRequest } from "./sections/ProjectRequest";
import { Projects } from "./sections/Projects";
import { Services } from "./sections/Services";
import type { ProjectType, ProjectTypePreset } from "./types/projectRequest";
import { scrollToSection } from "./utils/scroll";

function App() {
  const [preset, setPreset] = useState<ProjectTypePreset | null>(null);
  const activeId = useActiveSection(sectionIds);

  const handleSelectType = useCallback((type: ProjectType) => {
    setPreset({ type, id: Date.now() });
    scrollToSection(requestSectionId);
  }, []);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Navbar activeId={activeId} />
      <main id="conteudo">
        <Hero />
        <Services onSelect={handleSelectType} />
        <Projects />
        <About />
        <ProjectRequest preset={preset} />
      </main>
      <Footer />
    </>
  );
}

export default App;
