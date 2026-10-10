import React, { useState } from 'react';
import LinearRegressionContent from '../components/backprop/LinearRegressionContent';
import LogisticRegressionContent from '../components/backprop/LogisticRegressionContent';
import TheoryContent from '../components/backprop/TheoryContent';
import { useT } from '../i18n';

const GradientDescent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('theory');
    const t = useT('gradient').page;

    const tabs = [
        { id: 'theory', label: t.tabTheory },
        { id: 'linear', label: t.tabLinear },
        { id: 'logistic', label: t.tabLogistic },
    ];

    return (
        <div className="h-full bg-slate-50 flex flex-col">

            <header className="flex flex-row items-center gap-6 overflow-hidden shrink-0 p-6">
                <h1 className="text-[clamp(1.5rem,5vw,3rem)] font-extrabold text-slate-900 tracking-tighter shrink-0">
                    {t.title}
                </h1>
                <div className="h-8 w-px bg-slate-200 shrink-0 hidden md:block"></div>
                <p className="text-[clamp(0.75rem,1.5vw,1.1rem)] text-slate-400 font-medium italic leading-tight max-w-[50%]">
                    {t.subtitle}
                </p>
            </header>

            <div className="flex border-b border-slate-200 mb-2 overflow-x-auto shrink-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-8 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="transition-opacity duration-300 flex-1 min-h-0 flex flex-col p-4">
                {activeTab === 'theory' && <TheoryContent />}
                {activeTab === 'linear' && <LinearRegressionContent />}
                {activeTab === 'logistic' && <LogisticRegressionContent />}
            </div>
        </div>

    );
};

export default GradientDescent;
