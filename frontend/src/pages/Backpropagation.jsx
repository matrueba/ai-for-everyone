import React, { useState, useEffect } from 'react';
import RegressionPlot from '../components/backprop/RegressionPlot';
import CostSurface from '../components/backprop/CostSurface';

const Backpropagation = () => {
    const [data, setData] = useState(null);
    const [currentIteration, setCurrentIteration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/backprop')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        let interval;
        if (isPlaying && data && currentIteration < data.steps.length - 1) {
            interval = setInterval(() => {
                setCurrentIteration(prev => prev + 1);
            }, 100);
        } else {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, data, currentIteration]);

    if (loading) return <div className="p-8 text-center">Loading Backpropagation Data...</div>;

    const currentStep = data.steps[currentIteration];

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Backpropagation Visualizer</h1>
                    <p className="text-slate-600 text-lg">Watch how a neural network (or a simple linear regression) learns by minimizing the cost function via Gradient Descent.</p>
                </header>

                <div className="flex gap-4 mb-8">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${isPlaying ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                        {isPlaying ? 'Pause' : 'Start Training'}
                    </button>
                    <button 
                        onClick={() => {
                            setCurrentIteration(0);
                            setIsPlaying(false);
                        }}
                        className="px-6 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                    >
                        Reset
                    </button>
                    <input 
                        type="range" 
                        min="0" 
                        max={data.steps.length - 1} 
                        value={currentIteration} 
                        onChange={(e) => setCurrentIteration(parseInt(e.target.value))}
                        className="flex-1 accent-indigo-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <RegressionPlot data={data.data} currentStep={currentStep} />
                    <CostSurface surface={data.cost_surface} steps={data.steps} currentIteration={currentIteration} />
                </div>

                <div className="mt-12 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">How it works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold mb-4">1</div>
                            <h4 className="font-bold mb-2">Forward Pass</h4>
                            <p className="text-sm text-slate-600">The model makes a prediction using its current weights (w) and bias (b).</p>
                        </div>
                        <div>
                            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center font-bold mb-4">2</div>
                            <h4 className="font-bold mb-2">Loss Calculation</h4>
                            <p className="text-sm text-slate-600">We calculate the error between the prediction and the real target using the Mean Squared Error (MSE).</p>
                        </div>
                        <div>
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold mb-4">3</div>
                            <h4 className="font-bold mb-2">Backpropagation</h4>
                            <p className="text-sm text-slate-600">Gradients are calculated to determine how to adjust w and b to reduce the error in the next step.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Backpropagation;
