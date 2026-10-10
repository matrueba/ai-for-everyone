import React from "react";
import { useT } from "../i18n";

const Home: React.FC = () => {
  const t = useT("home");

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in-up">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-indigo via-purple-500 to-accent-cyan text-4xl mb-8 shadow-[0_0_40px_rgba(79,70,229,0.25)]">
          ✨
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-accent-indigo via-purple-600 to-accent-cyan bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-surface-card border border-border-default rounded-2xl p-8 shadow-sm transition-all hover:shadow-md hover:border-accent-indigo/30 group">
          <h3 className="text-xl font-bold mb-4 text-text-primary">{t.cards.attention.title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {t.cards.attention.body}
          </p>
        </div>

        <div className="bg-surface-card border border-border-default rounded-2xl p-8 shadow-sm transition-all hover:shadow-md hover:border-accent-cyan/30 group">
          <h3 className="text-xl font-bold mb-4 text-text-primary">{t.cards.matrix.title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {t.cards.matrix.body}
          </p>
        </div>
      </div>

      <div className="bg-surface-secondary border border-border-subtle rounded-2xl p-8 text-center">
        <h4 className="text-sm font-semibold uppercase tracking-widest text-text-tertiary mb-6">
          {t.gettingStarted.heading}
        </h4>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-accent-indigo text-white flex items-center justify-center text-xs font-bold">1</span>
            <span className="text-sm font-medium text-text-secondary">{t.gettingStarted.steps[1]}</span>
          </div>
          <div className="hidden sm:block w-8 h-px bg-border-default" />
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-accent-purple text-white flex items-center justify-center text-xs font-bold">2</span>
            <span className="text-sm font-medium text-text-secondary">{t.gettingStarted.steps[2]}</span>
          </div>
          <div className="hidden sm:block w-8 h-px bg-border-default" />
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-accent-cyan text-white flex items-center justify-center text-xs font-bold">3</span>
            <span className="text-sm font-medium text-text-secondary">{t.gettingStarted.steps[3]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
