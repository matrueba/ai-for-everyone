import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Visualizer from "./pages/Visualizer";
import GradientDescent from "./pages/GradientDescent";
import Inference from "./pages/Inference";

function App(): React.JSX.Element {
  const [activePage, setActivePage] = useState<string>("home");

  return (
    <div className="flex h-screen bg-surface-primary text-text-primary overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-48 -left-24 w-[600px] h-[600px] rounded-full bg-accent-indigo/5 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full bg-accent-cyan/5 blur-[120px]" />
      </div>

      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">

        {/* Content Area */}
        <main className="flex-1 min-h-0 overflow-hidden">
          <div className="mx-auto h-full">
            {activePage === "home" && <Home />}
            {activePage === "visualizer" && <Visualizer />}
            {activePage === "gradient-descent" && <GradientDescent />}
            {activePage === "inference" && <Inference />}
          </div>
        </main>

        {/* Footer */}
        <footer className="h-12 border-t border-border-subtle px-8 flex items-center justify-between text-[0.65rem] text-text-tertiary font-mono shrink-0">
          <div className="flex items-center gap-4">
            <span>&copy; 2026 AI Explained</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-[0.65rem] font-bold text-text-secondary hover:text-accent-indigo transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default hover:border-accent-indigo/30"
            >
              GitHub Source
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
