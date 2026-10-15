import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import Icon from "./components/ui/Icon";
import Home from "./pages/Home";
import Visualizer from "./pages/Visualizer";
import GradientDescent from "./pages/GradientDescent";
import Inference from "./pages/Inference";
import Train from "./pages/Train";
import Evaluation from "./pages/Evaluation";
import History from "./pages/History";
import NeuralNetwork from "./pages/NeuralNetwork";
import { NavProvider } from "./navigation";
import { useT } from "./i18n";
import type { PageId } from "./i18n/content-types";
import styles from "./App.module.css";

const PAGES: Record<PageId, React.FC> = {
  home: Home,
  history: History,
  train: Train,
  "gradient-descent": GradientDescent,
  inference: Inference,
  "neural-network": NeuralNetwork,
  evaluation: Evaluation,
  visualizer: Visualizer,
};

function App(): React.JSX.Element {
  const [activePage, setActivePage] = useState<PageId>("home");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const mainRef = useRef<HTMLElement>(null);
  const t = useT("common");

  const navigate = useCallback((page: PageId) => {
    setActivePage(page);
    setMenuOpen(false);
  }, []);

  // Each page starts at the top, like a fresh navigation would.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [activePage]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const ActivePage = PAGES[activePage];

  return (
    <NavProvider value={navigate}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMenuOpen(true)}
            aria-label={t.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="app-sidebar"
          >
            <Icon name="menu" size={20} />
          </button>
          <span className={styles.topbarTitle}>{t.menu[activePage]}</span>
        </header>

        <Sidebar activePage={activePage} onNavigate={navigate} open={menuOpen} onClose={() => setMenuOpen(false)} />

        <div
          className={styles.backdrop}
          data-open={menuOpen || undefined}
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />

        <main ref={mainRef} className={styles.main}>
          <ActivePage key={activePage} />
        </main>
      </div>
    </NavProvider>
  );
}

export default App;
