import React from "react";

const AttentionStory: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 w-full py-4 px-2">
      <div className="bg-surface-card border border-border-default rounded-3xl p-8 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.04)] max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center text-xl">
            📖
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            The Transformer Story
          </h2>
        </div>

        <div className="prose prose-slate prose-sm max-w-none space-y-6">
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-accent-indigo flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-indigo text-white text-[0.65rem] flex items-center justify-center font-mono">01</span>
              The Sequential Problem
            </h3>
            <p className="text-text-secondary leading-relaxed text-[0.95rem]">
              Before Transformers, models like RNNs and LSTMs processed text word by word, from left to right. This was slow and had trouble remembering things that happened far back in a long sentence.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-purple-500 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-[0.65rem] flex items-center justify-center font-mono">02</span>
              Enter Attention
            </h3>
            <p className="text-text-secondary leading-relaxed text-[0.95rem]">
              In 2017, researchers proposed "Attention is All You Need". Instead of processing one word at a time, the model looks at <strong>all words simultaneously</strong>.
            </p>
            <div className="p-4 bg-surface-secondary rounded-xl border border-border-subtle italic text-text-tertiary text-sm">
              "Attention is the mechanism that allows a model to weigh the importance of different parts of the input data."
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-accent-cyan flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-cyan text-white text-[0.65rem] flex items-center justify-center font-mono">03</span>
              Self-Attention in Action
            </h3>
            <p className="text-text-secondary leading-relaxed text-[0.95rem]">
              When the model processes the word "it" in a sentence, self-attention allows it to associate "it" with the correct noun mentioned earlier, like "the store" or "the cat".
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-accent-orange flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-orange text-white text-[0.65rem] flex items-center justify-center font-mono">04</span>
              Multi-Head Architecture
            </h3>
            <p className="text-text-secondary leading-relaxed text-[0.95rem]">
              By using multiple "heads", the model can attend to different aspects of the text at the same time: one head might focus on grammar, while another focuses on semantic relationships.
            </p>
          </section>

          <div className="pt-4 border-t border-border-subtle">
            <p className="text-xs text-text-muted italic">
              Switch to the <strong>Playground tab</strong> above to see the attention weights for your own sentences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttentionStory;
