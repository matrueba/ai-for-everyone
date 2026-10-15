import React, { useState, useEffect, useCallback, useRef } from "react";
import { Page, PageHeader } from "../components/ui/Page";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { Callout, Kbd } from "../components/ui/Bits";
import type { Tone } from "../components/ui/Bits";
import NextStep from "../components/ui/NextStep";
import { useT } from "../i18n";
import type { HistorySlideId } from "../i18n/content-types";
import styles from "./History.module.css";

/**
 * Presentation of each timeline entry (image + accent). The copy — title, year,
 * description, milestones and quote — comes from the active locale, keyed by id.
 */
const SLIDE_META: { id: HistorySlideId; image: string; tone: Tone }[] = [
    { id: 1, image: "/history/history_1943.png", tone: "indigo" },
    { id: 2, image: "/history/history_1950.png", tone: "cyan" },
    { id: 3, image: "/history/history_1956.png", tone: "orange" },
    { id: 4, image: "/history/history_1958.png", tone: "green" },
    { id: 5, image: "/history/history_1965.png", tone: "purple" },
    { id: 6, image: "/history/history_1970.png", tone: "indigo" },
    { id: 7, image: "/history/history_1986.png", tone: "cyan" },
    { id: 8, image: "/history/history_1989.png", tone: "orange" },
    { id: 9, image: "/history/history_1997.png", tone: "green" },
    { id: 10, image: "/history/history_1998.png", tone: "purple" },
    { id: 11, image: "/history/history_2006.png", tone: "indigo" },
    { id: 12, image: "/history/history_2007.png", tone: "cyan" },
    { id: 13, image: "/history/history_2011.png", tone: "orange" },
    { id: 14, image: "/history/history_2012.png", tone: "green" },
    { id: 15, image: "/history/history_2014.png", tone: "purple" },
    { id: 16, image: "/history/history_2016.png", tone: "indigo" },
    { id: 17, image: "/history/history_2017.png", tone: "cyan" },
    { id: 18, image: "/history/history_2020.png", tone: "orange" },
    { id: 19, image: "/history/history_2023.png", tone: "purple" },
];

const SWIPE_THRESHOLD = 50;

const History: React.FC = () => {
    const t = useT("history");
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    // Slides whose image failed to load show a typographic panel instead of a broken image.
    const [missingImages, setMissingImages] = useState<Set<HistorySlideId>>(() => new Set());
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const total = SLIDE_META.length;
    const activeMeta = SLIDE_META[currentIndex] ?? SLIDE_META[0]!;

    const handleNext = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % total);
    }, [total]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + total) % total);
    }, [total]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === "ArrowRight") handleNext();
            else if (e.key === "ArrowLeft") handlePrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext, handlePrev]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.targetTouches[0]) touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.targetTouches[0]) touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const diff = touchStartX.current - touchEndX.current;
        if (diff > SWIPE_THRESHOLD) handleNext();
        else if (diff < -SWIPE_THRESHOLD) handlePrev();
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    const markMissing = (id: HistorySlideId) =>
        setMissingImages((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));

    return (
        <Page width="content">
            <PageHeader page="history" title={t.title} subtitle={t.subtitle} />

            <Card padding="none" className={styles.carousel} data-tone={activeMeta.tone}>
                <div className={styles.progress} aria-hidden>
                    <div className={styles.progressBar} style={{ width: `${((currentIndex + 1) / total) * 100}%` }} />
                </div>

                <div className={styles.viewport} aria-roledescription="carousel" aria-live="polite">
                    <div
                        className={styles.track}
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {SLIDE_META.map((meta, idx) => {
                            const slide = t.slides[meta.id];
                            const active = idx === currentIndex;
                            const missing = missingImages.has(meta.id);
                            return (
                                <article
                                    key={meta.id}
                                    className={styles.slide}
                                    data-tone={meta.tone}
                                    aria-hidden={!active}
                                    inert={!active}
                                >
                                    <div className={styles.visual}>
                                        {missing ? (
                                            <div className={styles.visualFallback}>
                                                <span className={styles.fallbackYear}>{slide.year}</span>
                                                <span className={styles.fallbackIndex}>
                                                    {String(idx + 1).padStart(2, "0")} / {total}
                                                </span>
                                            </div>
                                        ) : (
                                            <img
                                                src={meta.image}
                                                alt={slide.title}
                                                loading={Math.abs(idx - currentIndex) <= 1 ? "eager" : "lazy"}
                                                onError={() => markMissing(meta.id)}
                                            />
                                        )}
                                        <span className={styles.yearBadge}>
                                            <Icon name="calendar" size={14} />
                                            {slide.year}
                                        </span>
                                    </div>

                                    <div className={styles.content}>
                                        <div>
                                            <h2 className={styles.slideTitle}>{slide.title}</h2>
                                            <div className={styles.accentRule} />
                                            <p className={styles.description}>{slide.description}</p>
                                            {slide.milestones.length > 0 && (
                                                <ul className={styles.milestones}>
                                                    {slide.milestones.map((m) => (
                                                        <li key={m}>{m}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        <Callout tone={meta.tone} variant="quote">
                                            <p>“{slide.quote.text}”</p>
                                            <cite className={styles.cite}>— {slide.quote.author}</cite>
                                        </Callout>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.controls}>
                    <div className={styles.dots}>
                        {SLIDE_META.map((meta, idx) => (
                            <button
                                key={meta.id}
                                type="button"
                                onClick={() => setCurrentIndex(idx)}
                                className={styles.dot}
                                aria-current={idx === currentIndex || undefined}
                                aria-label={t.goToSlide(idx + 1)}
                            />
                        ))}
                    </div>
                    <span className={styles.counter}>
                        {currentIndex + 1} / {total}
                    </span>

                    <div className={styles.arrows}>
                        <Button variant="secondary" iconOnly icon="arrowLeft" onClick={handlePrev} aria-label={t.prevSlide} />
                        <Button variant="secondary" iconOnly icon="arrowRight" onClick={handleNext} aria-label={t.nextSlide} />
                    </div>
                </div>
            </Card>

            <p className={styles.tip}>
                <Icon name="lightbulb" size={14} />
                {t.keyboardTip.prefix} <Kbd>←</Kbd> {t.keyboardTip.middle} <Kbd>→</Kbd> {t.keyboardTip.suffix}
            </p>

            <NextStep from="history" />
        </Page>
    );
};

export default History;
