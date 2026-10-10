import React, { useState, useEffect, useCallback, useRef } from "react";
import { useT } from "../i18n";
import type { HistorySlideId } from "../i18n/content-types";

interface SlideTheme {
    accent: string;
    bgAccent: string;
    text: string;
    gradient: string;
    shadow: string;
}

const THEMES = {
    indigo: {
        accent: "bg-accent-indigo",
        bgAccent: "bg-accent-indigo/10 text-accent-indigo",
        text: "text-accent-indigo",
        gradient: "from-accent-indigo to-violet-600",
        shadow: "shadow-accent-indigo/20",
    },
    cyan: {
        accent: "bg-accent-cyan",
        bgAccent: "bg-accent-cyan/10 text-accent-cyan",
        text: "text-accent-cyan",
        gradient: "from-accent-cyan to-teal-500",
        shadow: "shadow-accent-cyan/20",
    },
    orange: {
        accent: "bg-accent-orange",
        bgAccent: "bg-accent-orange/10 text-accent-orange",
        text: "text-accent-orange",
        gradient: "from-accent-orange to-amber-600",
        shadow: "shadow-accent-orange/20",
    },
    green: {
        accent: "bg-accent-green",
        bgAccent: "bg-accent-green/10 text-accent-green",
        text: "text-accent-green",
        gradient: "from-accent-green to-emerald-600",
        shadow: "shadow-accent-green/20",
    },
    purple: {
        accent: "bg-purple-600",
        bgAccent: "bg-purple-50 text-purple-600",
        text: "text-purple-600",
        gradient: "from-purple-600 to-pink-600",
        shadow: "shadow-purple-500/20",
    },
} satisfies Record<string, SlideTheme>;

/**
 * Presentation of each timeline entry (image + palette). The copy — title, year,
 * description, milestones and quote — comes from the active locale, keyed by id.
 */
const SLIDE_META: { id: HistorySlideId; image: string; theme: keyof typeof THEMES }[] = [
    { id: 1, image: "/history/history_1943.png", theme: "indigo" },
    { id: 2, image: "/history/history_1950.png", theme: "cyan" },
    { id: 3, image: "/history/history_1956.png", theme: "orange" },
    { id: 4, image: "/history/history_1958.png", theme: "green" },
    { id: 5, image: "/history/history_1965.png", theme: "purple" },
    { id: 6, image: "/history/history_1970.png", theme: "indigo" },
    { id: 7, image: "/history/history_1986.png", theme: "cyan" },
    { id: 8, image: "/history/history_1989.png", theme: "orange" },
    { id: 9, image: "/history/history_1997.png", theme: "green" },
    { id: 10, image: "/history/history_1998.png", theme: "purple" },
    { id: 11, image: "/history/history_2006.png", theme: "indigo" },
    { id: 12, image: "/history/history_2007.png", theme: "cyan" },
    { id: 13, image: "/history/history_2011.png", theme: "orange" },
    { id: 14, image: "/history/history_2012.png", theme: "green" },
    { id: 15, image: "/history/history_2014.png", theme: "purple" },
    { id: 16, image: "/history/history_2016.png", theme: "indigo" },
    { id: 17, image: "/history/history_2017.png", theme: "cyan" },
    { id: 18, image: "/history/history_2020.png", theme: "orange" },
    { id: 19, image: "/history/history_2023.png", theme: "purple" },
];

const History: React.FC = () => {
    const t = useT("history");
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const activeMeta = SLIDE_META[currentIndex] ?? SLIDE_META[0]!;
    const activeTheme = THEMES[activeMeta.theme];

    const handleNext = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDE_META.length);
    }, []);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + SLIDE_META.length) % SLIDE_META.length);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                handleNext();
            } else if (e.key === "ArrowLeft") {
                handlePrev();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext, handlePrev]);

    // Touch handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.targetTouches && e.targetTouches[0]) {
            touchStartX.current = e.targetTouches[0].clientX;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.targetTouches && e.targetTouches[0]) {
            touchEndX.current = e.targetTouches[0].clientX;
        }
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50; // swipe offset threshold
        if (diff > threshold) {
            handleNext();
        } else if (diff < -threshold) {
            handlePrev();
        }
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up w-full max-w-6xl mx-auto py-4 px-4 h-full">
            {/* Header */}
            <div className="text-center space-y-2 shrink-0">
                <h1 className="text-3xl font-extrabold text-text-primary tracking-tight sm:text-4xl">
                    {t.title}
                </h1>
                <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                    {t.subtitle}
                </p>
            </div>

            {/* Main Slider Container */}
            <div className="flex-1 flex flex-col justify-center min-h-0">
                <div className="relative w-full bg-white border border-border-default rounded-3xl shadow-xl overflow-hidden card-elevated flex flex-col">

                    {/* Top progress indicator bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 z-20">
                        <div
                            className={`h-full bg-gradient-to-r ${activeTheme.gradient} transition-all duration-500 ease-out`}
                            style={{ width: `${((currentIndex + 1) / SLIDE_META.length) * 100}%` }}
                        />
                    </div>

                    {/* Slides Carousel Wrapper */}
                    <div
                        className="flex-1 flex transition-transform duration-500 ease-in-out touch-pan-y"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {SLIDE_META.map((meta) => {
                            const slide = t.slides[meta.id];
                            const theme = THEMES[meta.theme];
                            return (
                                <div
                                    key={meta.id}
                                    className="w-full shrink-0 flex flex-col md:flex-row min-h-[460px] max-h-[600px] h-full"
                                >
                                    {/* Left side: Visual representation */}
                                    <div className="md:w-1/2 relative bg-slate-950 overflow-hidden flex items-center justify-center min-h-[260px] md:min-h-0">
                                        <img
                                            src={meta.image}
                                            alt={slide.title}
                                            className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                                        />
                                        {/* Glassmorphic year badge with slide-associated colors */}
                                        <div className={`absolute top-6 left-6 backdrop-blur-md px-4 py-2 rounded-full border border-current/10 font-mono text-sm font-bold tracking-wider shadow-lg ${theme.bgAccent}`}>
                                            📅 {slide.year}
                                        </div>
                                    </div>

                                    {/* Right side: Explanation text and milestones */}
                                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between overflow-y-auto bg-surface-secondary">
                                        <div>

                                            {/* Title */}
                                            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-4 tracking-tight leading-tight">
                                                {slide.title}
                                            </h2>

                                            {/* Accent bar separator */}
                                            <div className={`h-1 w-16 bg-gradient-to-r ${theme.gradient} rounded-full mb-6`} />

                                            {/* Description */}
                                            <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6">
                                                {slide.description}
                                            </p>
                                        </div>

                                        {/* Quote block */}
                                        <div className="border-l-4 border-slate-300 pl-4 py-1 italic text-text-tertiary text-xs md:text-sm bg-surface-primary/60 rounded-r-xl pr-3 select-none">
                                            <p className="mb-1 text-text-secondary">"{slide.quote.text}"</p>
                                            <cite className="not-italic font-bold text-text-tertiary block text-[11px]">— {slide.quote.author}</cite>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom bar */}
                    <div className="h-16 px-6 border-t border-border-subtle bg-surface-secondary flex items-center justify-between z-10 shrink-0">

                        {/* Pagination Dots indicator */}
                        <div className="flex items-center gap-2">
                            {SLIDE_META.map((meta, idx) => (
                                <button
                                    key={meta.id}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx
                                        ? `w-8 ${activeTheme.accent} shadow-md`
                                        : "bg-slate-200 hover:bg-slate-300"
                                        }`}
                                    aria-label={t.goToSlide(idx + 1)}
                                />
                            ))}
                        </div>

                        {/* Prev/Next buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                className="w-10 h-10 rounded-full border border-border-default hover:bg-slate-50 flex items-center justify-center text-lg text-text-secondary transition-all cursor-pointer"
                                aria-label={t.prevSlide}
                            >
                                ←
                            </button>
                            <button
                                onClick={handleNext}
                                className="w-10 h-10 rounded-full border border-border-default hover:bg-slate-50 flex items-center justify-center text-lg text-text-secondary transition-all cursor-pointer"
                                aria-label={t.nextSlide}
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Keyboard tooltip */}
                <p className="text-[11px] text-text-muted text-center mt-3 font-medium select-none">
                    {t.keyboardTip.prefix} <span className="px-1.5 py-0.5 rounded border border-border-default font-mono bg-white">←</span> {t.keyboardTip.middle} <span className="px-1.5 py-0.5 rounded border border-border-default font-mono bg-white">→</span> {t.keyboardTip.suffix}
                </p>
            </div>
        </div>
    );
};

export default History;
