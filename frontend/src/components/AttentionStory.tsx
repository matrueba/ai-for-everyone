import React from "react";
import { useT } from "../i18n";

/** Per-section accent styling; the copy itself lives in the locale files. */
const SECTION_STYLES = [
  { num: "01", heading: "text-accent-indigo", badge: "bg-accent-indigo" },
  { num: "02", heading: "text-purple-500", badge: "bg-purple-500" },
  { num: "03", heading: "text-accent-cyan", badge: "bg-accent-cyan" },
  { num: "04", heading: "text-accent-orange", badge: "bg-accent-orange" },
] as const;

const AttentionStory: React.FC = () => {
  const t = useT("visualizer").story;

  return (
    <div className="flex flex-col gap-8 w-full py-4 px-2">
      <div className="bg-surface-card border border-border-default rounded-3xl p-8 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.04)] max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center text-xl">
            📖
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            {t.heading}
          </h2>
        </div>

        <div className="prose prose-slate prose-sm max-w-none space-y-6">
          {([1, 2, 3, 4] as const).map((id, i) => {
            const style = SECTION_STYLES[i]!;
            return (
              <section key={id} className="space-y-3">
                <h3 className={`text-lg font-bold flex items-center gap-2 ${style.heading}`}>
                  <span className={`w-6 h-6 rounded-full text-white text-[0.65rem] flex items-center justify-center font-mono ${style.badge}`}>
                    {style.num}
                  </span>
                  {t.sections[id].title}
                </h3>
                <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                  {t.sections[id].body}
                </p>
                {id === 2 && (
                  <div className="p-4 bg-surface-secondary rounded-xl border border-border-subtle italic text-text-tertiary text-sm">
                    {t.quote}
                  </div>
                )}
              </section>
            );
          })}

          <div className="pt-4 border-t border-border-subtle">
            <p className="text-xs text-text-muted italic">
              {t.footer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttentionStory;
