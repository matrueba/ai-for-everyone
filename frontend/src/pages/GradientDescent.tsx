import React, { useState } from 'react';
import LinearRegressionContent from '../components/backprop/LinearRegressionContent';
import LogisticRegressionContent from '../components/backprop/LogisticRegressionContent';
import TheoryContent from '../components/backprop/TheoryContent';

const GradientDescent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('theory');

    return (
        <div className="h-full bg-slate-50 flex flex-col">

            <header className="flex flex-row items-center gap-6 overflow-hidden shrink-0 px-6 pt-4 pb-2">
                <h1 className="text-[clamp(1.5rem,5vw,3rem)] font-extrabold text-slate-900 tracking-tighter shrink-0">
                    Gradient Descent
                </h1>
                <div className="h-8 w-px bg-slate-200 shrink-0 hidden md:block"></div>
                <p className="text-[clamp(0.75rem,1.5vw,1.1rem)] text-slate-400 font-medium italic leading-tight max-w-[50%]">
                    Explore how different models learn by minimizing their cost functions using the Gradient Descent optimization algorithm.
                </p>
            </header>

            <div className="flex border-b border-slate-200 mb-2 overflow-x-auto shrink-0">
                <button
                    onClick={() => setActiveTab('theory')}
                    className={`px-8 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'theory'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                >
                    Theory
                </button>
                <button
                    onClick={() => setActiveTab('linear')}
                    className={`px-8 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'linear'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                >
                    Linear Regression
                </button>
                <button
                    onClick={() => setActiveTab('logistic')}
                    className={`px-8 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'logistic'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                >
                    Logistic Regression
                </button>
            </div>

            <div className="transition-opacity duration-300 flex-1 min-h-0 flex flex-col px-6 pt-4 pb-2">
                {activeTab === 'theory' && <TheoryContent />}
                {activeTab === 'linear' && <LinearRegressionContent />}
                {activeTab === 'logistic' && <LogisticRegressionContent />}
            </div>
        </div>

    );
};

export default GradientDescent;
