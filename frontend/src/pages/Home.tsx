import React from "react";

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in-up">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-indigo via-purple-500 to-accent-cyan text-4xl mb-8 shadow-[0_0_40px_rgba(79,70,229,0.25)]">
          ✨
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-accent-indigo via-purple-600 to-accent-cyan bg-clip-text text-transparent">
          AI Explained
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
          An interactive playground through the inner workings of modern AI.
          Visualize, analyze, and understand how AI works.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-surface-card border border-border-default rounded-2xl p-8 shadow-sm transition-all hover:shadow-md hover:border-accent-indigo/30 group">
          <h3 className="text-xl font-bold mb-4 text-text-primary">Attention Flow</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Visualize how tokens "attend" to each other across different layers and heads.
            Understand how context is built and information flows through the network.
          </p>
        </div>

        <div className="bg-surface-card border border-border-default rounded-2xl p-8 shadow-sm transition-all hover:shadow-md hover:border-accent-cyan/30 group">
          <h3 className="text-xl font-bold mb-4 text-text-primary">Matrix Deep-Dive</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Inspect the Query and Key vectors that drive the attention mechanism.
            See exactly how the dot-product similarity shapes the attention scores.
          </p>
        </div>
      </div>

      <div className="bg-surface-secondary border border-border-subtle rounded-2xl p-8 text-center">
        <h4 className="text-sm font-semibold uppercase tracking-widest text-text-tertiary mb-6">
          How to get started
        </h4>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-accent-indigo text-white flex items-center justify-center text-xs font-bold">1</span>
            <span className="text-sm font-medium text-text-secondary">Open the Visualizer</span>
          </div>
          <div className="hidden sm:block w-8 h-px bg-border-default" />
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-accent-purple text-white flex items-center justify-center text-xs font-bold">2</span>
            <span className="text-sm font-medium text-text-secondary">Enter your text</span>
          </div>
          <div className="hidden sm:block w-8 h-px bg-border-default" />
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-accent-cyan text-white flex items-center justify-center text-xs font-bold">3</span>
            <span className="text-sm font-medium text-text-secondary">Analyze & Explore</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
