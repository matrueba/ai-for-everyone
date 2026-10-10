import React from 'react';
import { useT } from '../../i18n';

const TheoryContent: React.FC = () => {
    const t = useT('gradient').theory;

    return (
        <div className="max-w-6xl mx-auto space-y-12 overflow-y-auto custom-scrollbar pb-12 pr-6">
            {/* Introduction Section */}
            <section className="card-elevated p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg">1</span>
                    {t.optimization.heading}
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
                    <p>{t.optimization.p1}</p>
                    <p>{t.optimization.p2}</p>
                </div>
            </section>

            {/* Cost Function Section */}
            <section className="card-elevated p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg">2</span>
                    {t.cost.heading}
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
                    <p>{t.cost.p1}</p>
                    <p>{t.cost.p2}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2">{t.cost.mse.title}</h3>
                                <p className="text-sm text-slate-600 mb-4">{t.cost.mse.body}</p>
                            </div>
                            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 text-center">
                                <code className="text-sm font-bold text-indigo-700">
                                    MSE = (1/n) Σ (y - ŷ)²
                                </code>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2">{t.cost.crossEntropy.title}</h3>
                                <p className="text-sm text-slate-600 mb-4">{t.cost.crossEntropy.body}</p>
                            </div>
                            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 text-center">
                                <code className="text-xs font-bold text-indigo-700">
                                    L = -1/n Σ [y·log(ŷ) + (1-y)·log(1-ŷ)]
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analogy Section */}
            <section className="card-elevated p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg">3</span>
                    {t.analogy.heading}
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                    <p>{t.analogy.p1}</p>
                    <div className="my-8 rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-white">
                        <img
                            src="/gradient_descent_math.png"
                            alt={t.analogy.mathAlt}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                    <p>{t.analogy.lead}</p>
                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 italic">
                        {t.analogy.quote}
                    </div>

                    <div className="my-8 rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-white">
                        <img
                            src="/gradient_descent.png"
                            alt={t.analogy.descentAlt}
                            className="w-full h-auto object-cover"
                        />
                        <div className="bg-slate-50 px-4 py-2 text-center text-xs text-slate-400 font-medium border-t border-slate-100">
                            {t.analogy.descentCaption}
                        </div>
                    </div>

                    <p>{t.analogy.p2}</p>
                    <p>{t.analogy.p3}</p>
                </div>
            </section>

            {/* Math Section */}
            <section className="card-elevated p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg">4</span>
                    {t.math.heading}
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                    <p>{t.math.p1}</p>
                    <div className="bg-slate-900 p-8 rounded-2xl text-center shadow-inner">
                        <code className="text-2xl text-indigo-300 font-mono">
                            w = w - η ∇ J(w)
                        </code>
                    </div>
                    <ul className="space-y-4 list-none p-0">
                        <li className="flex gap-4 items-start">
                            <div className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-mono font-bold text-sm">w</div>
                            <p>{t.math.terms.weights}</p>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-mono font-bold text-sm">∇ J(w)</div>
                            <p>{t.math.terms.gradient}</p>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-mono font-bold text-sm">η</div>
                            <p>{t.math.terms.learningRate}</p>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Footer / CTA */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl text-center">
                <p className="text-lg font-medium">
                    {t.cta}
                </p>
            </div>
        </div>
    );
};

export default TheoryContent;
