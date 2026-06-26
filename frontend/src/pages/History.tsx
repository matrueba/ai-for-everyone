import React, { useState, useEffect, useCallback, useRef } from "react";

interface Slide {
  id: number;
  title: string;
  year: string;
  description: string;
  milestones: string[];
  quote: { text: string; author: string };
  image: string;
  theme: {
    accent: string;
    bgAccent: string;
    text: string;
    gradient: string;
    shadow: string;
  };
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Alan Turing y el Juego de la Imitación",
    year: "1950",
    description: "La base teórica de la inteligencia artificial moderna. Alan Turing propuso el 'Juego de la Imitación' (más tarde conocido como la Prueba de Turing) en su célebre artículo 'Computing Machinery and Intelligence'. Planteó la pregunta fundacional: '¿Pueden pensar las máquinas?', estableciendo las pautas del pensamiento computacional y la inteligencia sintética.",
    milestones: ["Prueba de Turing", "Máquina Universal de Turing", "Filosofía del Pensamiento de Máquinas"],
    quote: {
      text: "Sólo podemos ver una corta distancia por delante, pero podemos ver que hay mucho por hacer.",
      author: "Alan Turing"
    },
    image: "/history/history_turing.png",
    theme: {
      accent: "bg-accent-indigo",
      bgAccent: "bg-accent-indigo/10 text-accent-indigo",
      text: "text-accent-indigo",
      gradient: "from-accent-indigo to-violet-600",
      shadow: "shadow-accent-indigo/20"
    }
  },
  {
    id: 2,
    title: "El Taller de Dartmouth",
    year: "1956",
    description: "El nacimiento oficial de la Inteligencia Artificial como campo académico independiente. Organizado por John McCarthy, Marvin Minsky, Nathaniel Rochester y Claude Shannon, el taller de Dartmouth definió el término 'Inteligencia Artificial' y sembró las bases conceptuales para las décadas venideras, asumiendo que cada aspecto del aprendizaje o inteligencia puede ser recreado por una máquina.",
    milestones: ["Acuñación del término 'IA'", "Enfoque simbólico fundacional", "John McCarthy & Marvin Minsky"],
    quote: {
      text: "La inteligencia artificial consiste en hacer que las máquinas se comporten de maneras que se llamarían inteligentes si un ser humano se comportara así.",
      author: "John McCarthy"
    },
    image: "/history/history_dartmouth.png",
    theme: {
      accent: "bg-accent-cyan",
      bgAccent: "bg-accent-cyan/10 text-accent-cyan",
      text: "text-accent-cyan",
      gradient: "from-accent-cyan to-teal-500",
      shadow: "shadow-accent-cyan/20"
    }
  },
  {
    id: 3,
    title: "Invierno de la IA y Sistemas Expertos",
    year: "1970s - 1980s",
    description: "Una época de altibajos. Ante la falta de resultados inmediatos, las expectativas cayeron y sobrevino el 'Invierno de la IA', con severos recortes de inversión. Sin embargo, el sector resurgió en los años 80 con los Sistemas Expertos: programas diseñados para emular la toma de decisiones de expertos humanos en campos altamente específicos utilizando reglas lógicas complejas.",
    milestones: ["Primer Invierno de la IA", "Reglas Lógicas IF-THEN", "Sistemas Expertos Comerciales"],
    quote: {
      text: "El conocimiento es poder, y el secreto del comportamiento inteligente radica en poseer el conocimiento específico del dominio.",
      author: "Edward Feigenbaum"
    },
    image: "/history/history_winter.png",
    theme: {
      accent: "bg-accent-orange",
      bgAccent: "bg-accent-orange/10 text-accent-orange",
      text: "text-accent-orange",
      gradient: "from-accent-orange to-amber-600",
      shadow: "shadow-accent-orange/20"
    }
  },
  {
    id: 4,
    title: "La Revolución del Aprendizaje Profundo",
    year: "2012",
    description: "El resurgimiento masivo de las redes neuronales a gran escala. La histórica victoria del modelo AlexNet en el desafío ImageNet de 2012 demostró que el Deep Learning, apalancado en redes neuronales convolucionales profundas, grandes volúmenes de datos y el poder de procesamiento de las GPUs, superaba radicalmente todos los enfoques tradicionales de visión por computadora.",
    milestones: ["Breakthrough de AlexNet & ImageNet", "Redes Neuronales Convolucionales (CNNs)", "Aceleración por hardware GPU"],
    quote: {
      text: "Las redes neuronales no son magia. Son simplemente funciones matemáticas complejas que aprenden a partir de ejemplos.",
      author: "Yann LeCun"
    },
    image: "/history/history_deeplearning.png",
    theme: {
      accent: "bg-accent-green",
      bgAccent: "bg-accent-green/10 text-accent-green",
      text: "text-accent-green",
      gradient: "from-accent-green to-emerald-600",
      shadow: "shadow-accent-green/20"
    }
  },
  {
    id: 5,
    title: "La Era de los Transformers e IA Generativa",
    year: "Presente",
    description: "La consolidación de los modelos fundacionales inteligentes. La invención de la arquitectura Transformer en 2017 ('Attention Is All You Need') desbloqueó la capacidad de procesar enormes cantidades de texto y comprender el contexto mediante auto-atención. Hoy, modelos como GPT, Claude y Gemini muestran capacidades de razonamiento fluido, código y creación multimodal.",
    milestones: ["Mecanismo de Auto-Atención", "Modelos de Lenguaje Multimodales", "Inferencia de Propósito General"],
    quote: {
      text: "El lenguaje es el código fuente del pensamiento humano, y los transformadores han aprendido a compilarlo.",
      author: "Investigación en IA Moderna"
    },
    image: "/history/history_llm.png",
    theme: {
      accent: "bg-purple-600",
      bgAccent: "bg-purple-50 text-purple-600",
      text: "text-purple-600",
      gradient: "from-purple-600 to-pink-600",
      shadow: "shadow-purple-500/20"
    }
  }
];

const History: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const activeSlide = (slides[currentIndex] || slides[0]) as Slide;

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
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

  // Autoplay functionality
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      timer = setInterval(() => {
        handleNext();
      }, 5000); // changes slide every 5 seconds
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, handleNext]);

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
          Historia de la Inteligencia Artificial
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Un recorrido interactivo a través de los hitos tecnológicos, teóricos y fundacionales que dieron origen a la IA moderna.
        </p>
      </div>

      {/* Main Slider Container */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <div className="relative w-full bg-white border border-border-default rounded-3xl shadow-xl overflow-hidden card-elevated flex flex-col">
          
          {/* Top progress indicator bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 z-20">
            <div 
              className={`h-full bg-gradient-to-r ${activeSlide.theme.gradient} transition-all duration-500 ease-out`}
              style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
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
            {slides.map((slide, idx) => (
              <div 
                key={slide.id} 
                className="w-full shrink-0 flex flex-col md:flex-row min-h-[460px] max-h-[600px] h-full"
              >
                {/* Left side: Visual representation */}
                <div className="md:w-1/2 relative bg-slate-950 overflow-hidden flex items-center justify-center min-h-[260px] md:min-h-0">
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                  />
                  {/* Glassmorphic year badge */}
                  <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white font-mono text-sm font-bold tracking-wider shadow-lg">
                    📅 {slide.year}
                  </div>
                </div>

                {/* Right side: Explanation text and milestones */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between overflow-y-auto bg-surface-secondary">
                  <div>
                    {/* Step indicator */}
                    <span className={`text-xs font-mono font-bold tracking-widest uppercase ${slide.theme.text} mb-3 block`}>
                      Hito {String(slide.id).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                    </span>

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-4 tracking-tight leading-tight">
                      {slide.title}
                    </h2>

                    {/* Accent bar separator */}
                    <div className={`h-1 w-16 bg-gradient-to-r ${slide.theme.gradient} rounded-full mb-6`} />

                    {/* Description */}
                    <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6">
                      {slide.description}
                    </p>

                    {/* Milestones tags */}
                    <div className="space-y-2 mb-6">
                      <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Conceptos clave</h3>
                      <div className="flex flex-wrap gap-2">
                        {slide.milestones.map((m, i) => (
                          <span 
                            key={i} 
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${slide.theme.bgAccent}`}
                          >
                            #{m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quote block */}
                  <div className="border-l-4 border-slate-300 pl-4 py-1 italic text-text-tertiary text-xs md:text-sm bg-surface-primary/60 rounded-r-xl pr-3 select-none">
                    <p className="mb-1 text-text-secondary">"{slide.quote.text}"</p>
                    <cite className="not-italic font-bold text-text-tertiary block text-[11px]">— {slide.quote.author}</cite>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls overlay and bottom bar */}
          <div className="h-16 px-6 border-t border-border-subtle bg-surface-secondary flex items-center justify-between z-10 shrink-0">
            {/* Play/Pause Autoplay button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-default hover:border-slate-300 text-xs font-semibold text-text-secondary transition-all cursor-pointer"
              title={isPlaying ? "Pausar reproducción automática" : "Iniciar reproducción automática"}
            >
              <span>{isPlaying ? "⏸️ Pausar" : "▶️ Reproducir"}</span>
            </button>

            {/* Pagination Dots indicator */}
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx 
                      ? `w-8 ${activeSlide.theme.accent} shadow-md` 
                      : "bg-slate-200 hover:bg-slate-300"
                  }`}
                  aria-label={`Ir a la diapositiva ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev/Next buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-border-default hover:bg-slate-50 flex items-center justify-center text-lg text-text-secondary transition-all cursor-pointer"
                aria-label="Diapositiva anterior"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-border-default hover:bg-slate-50 flex items-center justify-center text-lg text-text-secondary transition-all cursor-pointer"
                aria-label="Siguiente diapositiva"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard tooltip */}
        <p className="text-[11px] text-text-muted text-center mt-3 font-medium select-none">
          💡 Tip: Puedes usar las teclas de flecha <span className="px-1.5 py-0.5 rounded border border-border-default font-mono bg-white">←</span> y <span className="px-1.5 py-0.5 rounded border border-border-default font-mono bg-white">→</span> para navegar.
        </p>
      </div>
    </div>
  );
};

export default History;
