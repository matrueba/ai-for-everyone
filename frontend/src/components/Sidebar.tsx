import React from "react";
import { LANGS, useI18n, useT } from "../i18n";
import type { PageId } from "../i18n/content-types";

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
}

/** Order of the nav entries; the labels themselves come from the active locale. */
const MENU_ORDER: PageId[] = [
  "home",
  "history",
  "train",
  "gradient-descent",
  "inference",
  "neural-network",
  "evaluation",
  "visualizer",
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const t = useT("common");
  const { lang, setLang } = useI18n();

  return (
    <aside className="w-64 h-full bg-white border-r border-border-subtle flex flex-col z-20 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-accent-indigo to-accent-cyan bg-clip-text text-transparent">
            {t.appName}
          </span>
        </div>

        <nav className="space-y-1.5">
          {MENU_ORDER.map((id) => (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`w-full flex items-center gap-3 px-2 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${activePage === id
                ? "bg-accent-indigo/10 text-accent-indigo"
                : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                }`}
            >
              {t.menu[id]}
              {activePage === id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-indigo shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border-subtle space-y-4">
        {/* Language switcher */}
        <div>
          <p className="text-[0.65rem] font-bold text-text-tertiary uppercase tracking-widest mb-2">
            {t.language.label}
          </p>
          <div className="flex bg-surface-secondary rounded-lg p-1 gap-1">
            {LANGS.map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`flex-1 px-2 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${lang === code
                  ? "bg-white text-accent-indigo shadow-sm"
                  : "text-text-tertiary hover:text-text-primary"
                  }`}
              >
                {t.language[code]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface-secondary rounded-xl p-4">
          <p className="text-[0.65rem] font-bold text-text-tertiary uppercase tracking-widest mb-2">
            {t.sidebar.status}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-medium text-text-secondary">{t.sidebar.backendOnline}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
