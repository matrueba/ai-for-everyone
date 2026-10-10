import React from "react";
import { useT } from "../i18n";

const Evaluation: React.FC = () => {
  const t = useT("evaluation");

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up w-full max-w-6xl mx-auto py-8 px-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 text-accent-indigo text-xs font-semibold uppercase tracking-wider">
          {t.badge}
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight sm:text-4xl">
          {t.title}
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Content Placeholder with Premium Card Style */}
      <div className="flex-1 flex items-center justify-center min-h-[45vh]">
        <div className="relative w-full max-w-2xl rounded-2xl border border-border-default bg-white p-12 text-center shadow-xl overflow-hidden card-elevated">
          {/* Decorative glowing gradient inside card */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent-indigo/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-accent-cyan/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-indigo to-accent-cyan text-white flex items-center justify-center text-3xl shadow-md">
              🧪
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-text-primary">
                {t.placeholder.title}
              </h3>
              <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                {t.placeholder.body}
              </p>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-elevated text-xs font-mono text-text-secondary border border-border-subtle">
                <span className="w-2 h-2 rounded-full bg-accent-indigo animate-pulse" />
                {t.placeholder.chip}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
