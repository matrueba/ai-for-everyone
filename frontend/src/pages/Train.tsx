import React from 'react';
import { useT } from '../i18n';

/** Image + analogy layout of each step; the copy comes from the active locale. */
const STEP_IMAGES = {
    1: '/step1_batches.png',
    2: '/step2_forward.png',
    3: '/step3_loss.png',
    4: '/step4_optimization.png',
} as const;

const Train: React.FC = () => {
    const t = useT('train');

    const renderAnalogy = (emoji: string, title: string, body: string) => (
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 my-4 text-sm leading-relaxed text-indigo-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-200/20 rounded-bl-full -z-10"></div>
            <p className="font-semibold mb-2 flex items-center gap-2">
                <span>{emoji}</span> {title}
            </p>
            <p className="italic">{body}</p>
        </div>
    );

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-y-auto custom-scrollbar pb-12">
            {/* Header */}
            <header className="flex flex-row items-center gap-6 overflow-hidden shrink-0 p-8 border-b border-slate-200 bg-white">
                <h1 className="text-[clamp(1.5rem,5vw,3rem)] font-extrabold text-slate-900 tracking-tighter shrink-0">
                    {t.header.title}
                </h1>
                <div className="h-8 w-px bg-slate-200 shrink-0 hidden md:block"></div>
                <p className="text-[clamp(0.75rem,1.5vw,1.1rem)] text-slate-500 font-medium italic leading-tight max-w-[50%]">
                    {t.header.subtitle}
                </p>
            </header>

            {/* Content Container */}
            <div className="max-w-5xl mx-auto px-8 mt-8 space-y-12 w-full">

                {/* Introduction Section */}
                <section className="card-elevated p-8">
                    <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-base leading-relaxed">
                        <p>{t.intro.p1}</p>
                        <p>{t.intro.p2}</p>
                    </div>
                </section>

                {/* Fundamental Elements Section */}
                <section className="card-elevated p-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg">1</span>
                        {t.elements.heading}
                    </h2>

                    <div className="space-y-8 text-slate-600">
                        <p className="text-base">{t.elements.lead}</p>

                        <div className="space-y-6">
                            {/* Element A: training set */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">A</span>
                                    {t.elements.dataset.title}
                                </h3>
                                <p className="text-sm leading-relaxed mb-4">
                                    {t.elements.dataset.body}
                                </p>

                                <div className="mt-4">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        {t.elements.dataset.exampleLabel}
                                    </p>
                                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                                        <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-2.5 text-left font-bold text-slate-500">{t.elements.dataset.table.headers.area}</th>
                                                    <th className="px-4 py-2.5 text-left font-bold text-slate-500">{t.elements.dataset.table.headers.rooms}</th>
                                                    <th className="px-4 py-2.5 text-left font-bold text-slate-500">{t.elements.dataset.table.headers.elevator}</th>
                                                    <th className="px-4 py-2.5 text-left font-bold text-indigo-600 bg-indigo-50/50">{t.elements.dataset.table.headers.price}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {t.elements.dataset.table.rows.map((row) => (
                                                    <tr key={row.area}>
                                                        <td className="px-4 py-2.5">{row.area}</td>
                                                        <td className="px-4 py-2.5">{row.rooms}</td>
                                                        <td className="px-4 py-2.5">{row.elevator}</td>
                                                        <td className="px-4 py-2.5 font-semibold text-indigo-600 bg-indigo-50/30">{row.price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Element B: expected output */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">B</span>
                                    {t.elements.expected.title}
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    {t.elements.expected.body}
                                </p>
                            </div>

                            {/* Element C: algorithm */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">C</span>
                                    {t.elements.algorithm.title}
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    {t.elements.algorithm.body}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step-by-Step Cycle Section */}
                <section className="card-elevated p-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg">2</span>
                        {t.cycle.heading}
                    </h2>
                    <p className="text-slate-500 mb-8 italic text-sm">
                        {t.cycle.lead}
                    </p>
                    <div className="space-y-12">
                        {([1, 2, 3, 4] as const).map((n) => {
                            const step = t.cycle.steps[n];
                            return (
                                <div key={n} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                                        {n}
                                    </div>
                                    <div className="text-slate-600">
                                        <h4 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h4>
                                        <p className={`text-sm leading-relaxed ${n === 4 ? 'mb-4' : ''}`}>
                                            {step.body}
                                        </p>

                                        {n === 3 && renderAnalogy('📏', t.cycle.analogies.dartboard.title, t.cycle.analogies.dartboard.body)}
                                        {n === 4 && renderAnalogy('🎛️', t.cycle.analogies.mixer.title, t.cycle.analogies.mixer.body)}

                                        <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white max-w-2xl">
                                            <img
                                                src={STEP_IMAGES[n]}
                                                alt={step.imageAlt}
                                                className="w-full h-auto object-cover"
                                            />
                                            <div className="bg-slate-50 px-4 py-2 text-center text-[11px] text-slate-400 font-medium border-t border-slate-100">
                                                {step.caption}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 text-slate-600 text-base leading-relaxed">
                        <p>{t.cycle.outro}</p>
                    </div>
                </section>

                {/* CTA / Footer */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl text-center">
                    <h3 className="text-xl font-bold mb-2">{t.cta.title}</h3>
                    <p className="text-sm opacity-90 max-w-2xl mx-auto">
                        {t.cta.body}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Train;
