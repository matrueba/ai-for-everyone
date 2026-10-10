import React, { useState } from "react";
import AttentionStory from "../components/AttentionStory";
import AttentionPlayground from "../components/AttentionPlayground";
import { useT } from "../i18n";

const Visualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("theory");
  const t = useT("visualizer").page;

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up w-full max-w-6xl mx-auto py-4">
      {/* Header & Tab Selector */}
      <div className="flex flex-col items-center gap-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight sm:text-4xl">
            {t.title}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="bg-surface-elevated/80 backdrop-blur-md p-1.5 rounded-2xl flex gap-1.5 border border-border-default shadow-sm ring-1 ring-black/[0.03]">
          <button
            onClick={() => setActiveTab("theory")}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
              activeTab === "theory"
                ? "bg-white text-accent-indigo shadow-[0_4px_12px_rgba(0,0,0,0.05),0_1px_2px_rgba(79,70,229,0.1)] scale-[1.02] ring-1 ring-black/[0.02]"
                : "text-text-tertiary hover:text-text-primary hover:bg-white/50"
            }`}
          >
            <span className="text-lg">📖</span> {t.tabTheory}
          </button>
          <button
            onClick={() => setActiveTab("playground")}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
              activeTab === "playground"
                ? "bg-white text-accent-indigo shadow-[0_4px_12px_rgba(0,0,0,0.05),0_1px_2px_rgba(79,70,229,0.1)] scale-[1.02] ring-1 ring-black/[0.02]"
                : "text-text-tertiary hover:text-text-primary hover:bg-white/50"
            }`}
          >
            <span className="text-lg">⚡</span> {t.tabPlayground}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <main className="w-full min-h-[60vh] relative">
        <div className="flex justify-center w-full transition-opacity duration-300">
          {activeTab === "theory" ? (
            <div className="w-full flex justify-center animate-fade-in-up">
              <AttentionStory />
            </div>
          ) : (
            <div className="w-full flex justify-center animate-fade-in-up">
              <AttentionPlayground />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Visualizer;
