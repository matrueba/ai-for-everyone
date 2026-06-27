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
        title: "El principio de todo",
        year: "1943",
        description: `Warren S. McCulloch y Walter Pitts publican "A Logical Calculus of the Ideas Immanent in Nervous Activity". Este artículo define el camino y sienta las bases de la IA moderna al establecer que el cerebro puede entenderse como un sistema computacional. Además, introduce por primera vez el concepto de redes neuronales artificiales, una idea que inspiraría el desarrollo de sistemas informáticos capaces de simular funciones y procesos similares a los del cerebro.`,
        milestones: ["Redes Neuronales", "Cerebro Computacional", "Logica Proposicional"],
        quote: {
            text: "Debido a la naturaleza 'todo o nada' de la actividad nerviosa, las relaciones neuronales pueden representarse mediante la lógica.",
            author: "McCulloch & Pitts"
        },
        image: "/history/history_1943.png",
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
        title: "El juego de imitación",
        year: "1950",
        description: `El matemático británico Alan Turing publica "Computing Machinery and Intelligence" , un texto fundacional en el campo de la Inteligencia Artificial que aborda una de las preguntas más famosas de la ciencia: "¿Pueden pensar las máquinas?". Turing propone evaluar la inteligencia artificial a través del "juego de imitación", conocido actualmente como el Test de Turing. Esta prueba mide la capacidad de una máquina para replicar el comportamiento humano de manera tan convincente que un evaluador no pueda distinguirla de una persona.`,
        milestones: ["Test de Turing", "Alan Turing", "Filosofia de la IA"],
        quote: {
            text: "¿Pueden pensar las máquinas? Yo propongo que consideremos esta pregunta mediante el juego de imitación.",
            author: "Alan Turing"
        },
        image: "/history/history_1950.png",
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
        title: "El bautismo de la Inteligencia Artificial",
        year: "1955 - 1956",
        description: `En 1955, los investigadores John McCarthy, Marvin Minsky, Nathaniel Rochester y Claude Shannon redactan "A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence" . Este documento acuña por primera vez el término "Inteligencia Artificial". Al año siguiente, se lleva a cabo la histórica conferencia en el Dartmouth College, estableciendo formalmente el campo de estudio y sus bases conceptuales para las décadas venideras.`,
        milestones: ["Proyecto Dartmouth", "John McCarthy", "Marvin Minsky"],
        quote: {
            text: "Se propone un estudio de 2 meses y 10 hombres sobre la inteligencia artificial en el Dartmouth College...",
            author: "Dartmouth Proposal (1955)"
        },
        image: "/history/history_1956.png",
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
        title: "El Perceptrón",
        year: "1958",
        description: `Frank Rosenblatt crea el Perceptrón, el primer algoritmo que modela una red neuronal simple. Este algoritmo dio forma práctica al concepto de neuronas artificiales al modelar un clasificador binario. Aunque en su momento estaba limitado a la resolución de problemas linealmente separables, el Perceptrón sentó las bases algorítmicas para el futuro del Deep Learning.`,
        milestones: ["Perceptrón", "Clasificación Binaria", "Frank Rosenblatt"],
        quote: {
            text: "El perceptrón es el primer esquema de un cerebro artificial capaz de percibir e identificar su entorno.",
            author: "Frank Rosenblatt"
        },
        image: "/history/history_1958.png",
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
        title: "El procesamiento del lenguaje y el conocimiento especializado",
        year: "1965",
        description: `Joseph Weizenbaum desarrolla ELIZA, considerado el primer chatbot de la historia, logrando un hito en el procesamiento del lenguaje natural al simular una conversación humana. En paralelo, en la Universidad de Stanford, Edward Feigenbaum, Bruce Buchanan, Joshua Lederberg y Carl Djerassi comienzan a desarrollar DENDRAL. Este fue el primer sistema experto capaz de automatizar la toma de decisiones de los químicos orgánicos mediante la formación de hipótesis. El éxito de DENDRAL demostró que la IA podía realizar tareas hiperespecializadas con una precisión igual o superior a la de los expertos humanos.`,
        milestones: ["ELIZA Chatbot", "Sistemas Expertos", "DENDRAL"],
        quote: {
            text: "El éxito de DENDRAL demostró que la IA podía realizar tareas especializadas con precisión de experto.",
            author: "Edward Feigenbaum"
        },
        image: "/history/history_1965.png",
        theme: {
            accent: "bg-purple-600",
            bgAccent: "bg-purple-50 text-purple-600",
            text: "text-purple-600",
            gradient: "from-purple-600 to-pink-600",
            shadow: "shadow-purple-500/20"
        }
    },
    {
        id: 6,
        title: "El primer \"invierno\" de la IA",
        year: "1970 - 1980",
        description: `En 1969, Marvin Minsky y Seymour Papert publican el libro "Perceptrons: An Introduction to Computational Geometry", donde analizan de manera crítica las severas limitaciones matemáticas de las redes neuronales de una sola capa. Este trabajo, sumado a la falta de resultados prácticos inmediatos provocó en esta década el denominado "primer invierno de la Inteligencia Artificial", una época de estancamiento, pérdida de interés y falta de financiación. Sin embargo, a principios de los años 80, el campo comenzó a resurgir lentamente impulsado por el auge comercial de los sistemas expertos y la inversión en proyectos como los ordenadores de Quinta Generación en Japón.`,
        milestones: ["Invierno de la IA", "Limitaciones de Redes", "Quinta Generación"],
        quote: {
            text: "El libro 'Perceptrons' demostró matemáticamente las limitaciones de las redes de una sola capa.",
            author: "Marvin Minsky & Seymour Papert"
        },
        image: "/history/history_1970.png",
        theme: {
            accent: "bg-accent-indigo",
            bgAccent: "bg-accent-indigo/10 text-accent-indigo",
            text: "text-accent-indigo",
            gradient: "from-accent-indigo to-violet-600",
            shadow: "shadow-accent-indigo/20"
        }
    },
    {
        id: 7,
        title: "Retropropagación",
        year: "1986",
        description: `Geoffrey Hinton, David Rumelhart y Ronald Williams publican el artículo seminal "Learning representations by back-propagating errors". Aunque las bases matemáticas del algoritmo de retropropagación (backpropagation) ya habían sido exploradas en años previos, este trabajo demuestra por primera vez su viabilidad para entrenar redes neuronales multicapa. Al superar las limitaciones de investigaciones anteriores, este hallazgo despierta un renovado interés por la Inteligencia Artificial y se convierte en la base fundamental del Deep Learning moderno.`,
        milestones: ["Backpropagation", "Redes Multicapa", "Geoffrey Hinton"],
        quote: {
            text: "Mostramos que un procedimiento de aprendizaje simple puede encontrar representaciones útiles.",
            author: "Hinton, Rumelhart & Williams"
        },
        image: "/history/history_1986.png",
        theme: {
            accent: "bg-accent-cyan",
            bgAccent: "bg-accent-cyan/10 text-accent-cyan",
            text: "text-accent-cyan",
            gradient: "from-accent-cyan to-teal-500",
            shadow: "shadow-accent-cyan/20"
        }
    },
    {
        id: 8,
        title: "Visión artificial y reconocimiento de imágenes",
        year: "1989",
        description: `Yann LeCun y un equipo de investigadores de AT&T Bell Labs logran un avance histórico al aplicar con éxito el algoritmo de retropropagación en una red neuronal multicapa diseñada para reconocer códigos postales escritos a mano. Esta es una de las primeras aplicaciones prácticas del Deep Learning mediante el uso de Redes Neuronales Convolucionales (CNN). El éxito del sistema demuestra el potencial real de las redes neuronales para las tareas de visión artificial y sienta las bases para el crecimiento de la IA aplicada a imágenes en las décadas posteriores.`,
        milestones: ["Redes Convolucionales", "Visión Artificial", "Yann LeCun"],
        quote: {
            text: "La aplicación de backpropagation a imágenes del mundo real abre las puertas al reconocimiento de patrones.",
            author: "Yann LeCun"
        },
        image: "/history/history_1989.png",
        theme: {
            accent: "bg-accent-orange",
            bgAccent: "bg-accent-orange/10 text-accent-orange",
            text: "text-accent-orange",
            gradient: "from-accent-orange to-amber-600",
            shadow: "shadow-accent-orange/20"
        }
    },
    {
        id: 9,
        title: "Deep Blue y la memoria LSTM",
        year: "1997",
        description: `Es un año de hitos tanto mediáticos como técnicos. Por un lado, la supercomputadora Deep Blue de IBM hace historia al derrotar al entonces campeón mundial, Garry Kasparov. Es la primera vez que un programa vence a un campeón vigente en un torneo en condiciones de reglamento. Su capacidad para calcular millones de movimientos por segundo demuestra que las máquinas pueden superar a los humanos en juegos de alta complejidad estratégica, considerados hasta entonces un sello distintivo del intelecto humano.\n\nParalelamente, Sepp Hochreiter y Jürgen Schmidhuber presentan la memoria a corto-largo plazo (LSTM). Este nuevo tipo de red neuronal recurrente (RNN) se diseña para superar un problema matemático crítico (el desvanecimiento del gradiente), permitiendo a los sistemas capturar e hilar dependencias a largo plazo en los datos de manera eficaz.`,
        milestones: ["Deep Blue vs Kasparov", "Memoria LSTM", "Redes Recurrentes"],
        quote: {
            text: "LSTM resuelve el desvanecimiento del gradiente, permitiendo recordar eventos a largo plazo.",
            author: "Hochreiter & Schmidhuber"
        },
        image: "/history/history_1997.png",
        theme: {
            accent: "bg-accent-green",
            bgAccent: "bg-accent-green/10 text-accent-green",
            text: "text-accent-green",
            gradient: "from-accent-green to-emerald-600",
            shadow: "shadow-accent-green/20"
        }
    },
    {
        id: 10,
        title: "La consolidación del Deep Learning",
        year: "1998",
        description: `Yann LeCun, Yoshua Bengio y sus colaboradores publican una serie de artículos profundamente influyentes (como la arquitectura LeNet-5) sobre la aplicación de redes neuronales al reconocimiento de escritura a mano en documentos. Su trabajo se centra en el uso de redes neuronales convolucionales para optimizar la retropropagación, haciéndola más estable y eficaz al entrenar redes más profundas. Al refinar este proceso y demostrar el inmenso poder de las CNN para extraer patrones visuales, la investigación de LeCun y Bengio cimentó las técnicas que hoy en día impulsan una amplísima gama de aplicaciones de IA.`,
        milestones: ["LeNet-5", "Reconocimiento de Patrones", "Yoshua Bengio"],
        quote: {
            text: "Combinar CNNs y propagación de gradientes representa la consolidación práctica del aprendizaje en imágenes.",
            author: "LeCun, Bengio et al."
        },
        image: "/history/history_1998.png",
        theme: {
            accent: "bg-purple-600",
            bgAccent: "bg-purple-50 text-purple-600",
            text: "text-purple-600",
            gradient: "from-purple-600 to-pink-600",
            shadow: "shadow-purple-500/20"
        }
    },
    {
        id: 11,
        title: "El despertar del Deep Learning",
        year: "2006",
        description: `Geoffrey Hinton y su equipo publican investigaciones clave como "A fast learning algorithm for deep belief nets", en las que demuestran cómo entrenar redes neuronales profundas capa por capa de forma mucho más eficaz. Este enfoque supera los obstáculos técnicos del pasado y consolida la transición hacia lo que hoy llamamos Deep Learning, permitiendo a las máquinas aprender representaciones jerárquicas complejas de los datos. Este hito marca el inicio del boom moderno de la Inteligencia Artificial.`,
        milestones: ["Deep Belief Nets", "Aprendizaje Jerarquico", "Geoffrey Hinton"],
        quote: {
            text: "Un algoritmo de aprendizaje rápido y codicioso puede encontrar buenos parámetros para redes profundas.",
            author: "Geoffrey Hinton"
        },
        image: "/history/history_2006.png",
        theme: {
            accent: "bg-accent-indigo",
            bgAccent: "bg-accent-indigo/10 text-accent-indigo",
            text: "text-accent-indigo",
            gradient: "from-accent-indigo to-violet-600",
            shadow: "shadow-accent-indigo/20"
        }
    },
    {
        id: 12,
        title: "ImageNet",
        year: "2007",
        description: `Fei-Fei Li y su equipo de la Universidad de Princeton inician el proyecto ImageNet, consistente en la creación de una gigantesca base de datos de imágenes anotadas manualmente. La escala y calidad sin precedentes de este conjunto de datos desataron una revolución en la investigación de la visión artificial, proporcionando el campo de entrenamiento necesario para que los modelos de Deep Learning aprendieran a reconocer y clasificar objetos complejos.`,
        milestones: ["ImageNet", "Fei-Fei Li", "Big Data en IA"],
        quote: {
            text: "ImageNet es un esfuerzo a gran escala para mapear el mundo real de las imágenes.",
            author: "Fei-Fei Li"
        },
        image: "/history/history_2007.png",
        theme: {
            accent: "bg-accent-cyan",
            bgAccent: "bg-accent-cyan/10 text-accent-cyan",
            text: "text-accent-cyan",
            gradient: "from-accent-cyan to-teal-500",
            shadow: "shadow-accent-cyan/20"
        }
    },
    {
        id: 13,
        title: "IBM Watson",
        year: "2011",
        description: `Watson, la supercomputadora de IBM diseñada para responder preguntas en lenguaje natural, acapara los titulares mundiales al competir en el popular concurso televisivo Jeopardy! y derrotar a sus dos campeones históricos, Ken Jennings y Brad Rutter. La capacidad de Watson para procesar, interpretar los matices del lenguaje humano y cruzar información con su vasta base de conocimientos en milisegundos puso de relieve los enormes avances en el Procesamiento del Lenguaje Natural.`,
        milestones: ["IBM Watson", "Jeopardy!", "Procesamiento de Lenguaje Natural"],
        quote: {
            text: "Watson demostró que la IA es capaz de procesar el juego de palabras y sutilezas del lenguaje humano en tiempo real.",
            author: "IBM Watson Team"
        },
        image: "/history/history_2011.png",
        theme: {
            accent: "bg-accent-orange",
            bgAccent: "bg-accent-orange/10 text-accent-orange",
            text: "text-accent-orange",
            gradient: "from-accent-orange to-amber-600",
            shadow: "shadow-accent-orange/20"
        }
    },
    {
        id: 14,
        title: "La revolución de AlexNet",
        year: "2012",
        description: `Un equipo de investigadores de la Universidad de Toronto, dirigido por Geoffrey Hinton y liderado por Alex Krizhevsky e Ilya Sutskever, logra un resultado rompedor en el concurso ImageNet Large Scale Visual Recognition Challenge. Su red neuronal convolucional, bautizada como AlexNet, alcanza una tasa de error del 16 %, destrozando el récord del año anterior (25 %). Al aprovechar por primera vez la inmensa potencia de cálculo de las tarjetas gráficas (GPUs) para entrenar la red, este logro demostró la aplastante superioridad del Deep Learning frente a los métodos tradicionales y cambió la trayectoria de la IA para siempre.`,
        milestones: ["AlexNet", "Aceleración por GPU", "Revolución Deep Learning"],
        quote: {
            text: "El entrenamiento con GPU nos permitió entrenar una red de 60 millones de parámetros.",
            author: "Krizhevsky, Sutskever & Hinton"
        },
        image: "/history/history_2012.png",
        theme: {
            accent: "bg-accent-green",
            bgAccent: "bg-accent-green/10 text-accent-green",
            text: "text-accent-green",
            gradient: "from-accent-green to-emerald-600",
            shadow: "shadow-accent-green/20"
        }
    },
    {
        id: 15,
        title: "Redes Generativas Antagónicas (GANs)",
        year: "2014",
        description: `Ian Goodfellow y un equipo de investigadores presentan un nuevo marco de aprendizaje automático: las Redes Generativas Antagónicas. Este diseño enfrenta a dos redes neuronales en un juego competitivo: un "generador" que intenta crear datos artificiales indistinguibles de la realidad, y un "discriminador" encargado de detectar si esos datos son reales o creados por la máquina. Esta fricción constante obliga a ambas redes a mejorar de forma iterativa e ininterrumpida. El impacto de las GANs fue monumental, ya que demostró empíricamente que la IA podía poseer capacidades creativas.`,
        milestones: ["GANs", "Ian Goodfellow", "Redes Antagónicas"],
        quote: {
            text: "El generador y el discriminador se entrenan juntos, en un juego de suma cero.",
            author: "Ian Goodfellow"
        },
        image: "/history/history_2014.png",
        theme: {
            accent: "bg-purple-600",
            bgAccent: "bg-purple-50 text-purple-600",
            text: "text-purple-600",
            gradient: "from-purple-600 to-pink-600",
            shadow: "shadow-purple-500/20"
        }
    },
    {
        id: 16,
        title: "AlphaGo",
        year: "2016",
        description: `El sistema AlphaGo, desarrollado por Google DeepMind, derrota por 4-1 a Lee Sedol, campeón mundial y leyenda del Go. Debido a la inmensidad de movimientos posibles en el Go, se consideraba imposible que una máquina ganara mediante fuerza bruta. La victoria de AlphaGo supuso un hito revolucionario al demostrar que el Deep Learning y el aprendizaje por refuerzo podían dotar a una máquina de algo similar a la "intuición" humana para gestionar tareas de extrema complejidad estratégica.`,
        milestones: ["AlphaGo", "DeepMind vs Lee Sedol", "Aprendizaje por Refuerzo"],
        quote: {
            text: "Este es el partido más hermoso que he jugado, y la máquina demostró movimientos creativos.",
            author: "Lee Sedol"
        },
        image: "/history/history_2016.png",
        theme: {
            accent: "bg-accent-indigo",
            bgAccent: "bg-accent-indigo/10 text-accent-indigo",
            text: "text-accent-indigo",
            gradient: "from-accent-indigo to-violet-600",
            shadow: "shadow-accent-indigo/20"
        }
    },
    {
        id: 17,
        title: "\"Attention Is All You Need\"",
        year: "2017",
        description: `Un equipo de investigadores de Google liderado por Ashish Vaswani, publica uno de los artículos más importantes de la década: "Attention Is All You Need". Este texto supone un cambio de paradigma al introducir la arquitectura Transformer y el mecanismo de "atención". Al permitir que el procesamiento de datos se hiciera en paralelo, los Transformers dejaron atrás las limitaciones de las redes recurrentes y sentaron la base tecnológica para los grandes modelos de lenguaje actuales.`,
        milestones: ["Transformers", "Mecanismo de Atención", "Ashish Vaswani"],
        quote: {
            text: "La atención es todo lo que necesitas para dispensar de la recurrencia y convolución por completo.",
            author: "Ashish Vaswani et al."
        },
        image: "/history/history_2017.png",
        theme: {
            accent: "bg-accent-cyan",
            bgAccent: "bg-accent-cyan/10 text-accent-cyan",
            text: "text-accent-cyan",
            gradient: "from-accent-cyan to-teal-500",
            shadow: "shadow-accent-cyan/20"
        }
    },
    {
        id: 18,
        title: "AlphaFold 2 descifra la biología",
        year: "2020",
        description: `El sistema AlphaFold 2 de DeepMind logra un hito histórico en la biología al predecir con una precisión asombrosa las estructuras tridimensionales de las proteínas a partir de sus secuencias de aminoácidos. Este logro resuelve "el problema del plegamiento de proteínas", un enigma que había frustrado a los científicos durante medio siglo. Su impacto es incalculable, acelerando drásticamente la investigación de enfermedades, el desarrollo de fármacos y la comprensión de los mecanismos moleculares de la vida.`,
        milestones: ["AlphaFold 2", "Plegamiento de Proteinas", "Biologia Estructural"],
        quote: {
            text: "AlphaFold ha acelerado de manera sin precedentes nuestra comprensión del funcionamiento molecular de las células.",
            author: "Nature Editorial"
        },
        image: "/history/history_2020.png",
        theme: {
            accent: "bg-accent-orange",
            bgAccent: "bg-accent-orange/10 text-accent-orange",
            text: "text-accent-orange",
            gradient: "from-accent-orange to-amber-600",
            shadow: "shadow-accent-orange/20"
        }
    },
    {
        id: 19,
        title: "GPT-3 y la era de los LLM",
        year: "2020 - 2023",
        description: `En 2020, OpenAI presenta GPT-3, un modelo de lenguaje con 175.000 millones de parámetros que demuestra una capacidad inaudita para generar textos indistinguibles de los humanos, traducir, programar y razonar a partir de instrucciones naturales (prompts). A finales de 2022, el lanzamiento público de ChatGPT democratiza esta tecnología, desencadenando la mayor adopción tecnológica de la historia y marcando la explosión definitiva de los Grandes Modelos de Lenguaje. En 2023, la llegada de modelos multimodales aún más potentes consolida el inicio de una nueva era donde la IA generativa transforma todas las esferas de la sociedad.`,
        milestones: ["GPT-3 / ChatGPT", "Modelos de Lenguaje (LLMs)", "IA Generativa"],
        quote: {
            text: "La IA generativa se ha convertido en una herramienta general de aumento cognitivo.",
            author: "OpenAI"
        },
        image: "/history/history_2023.png",
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
                    Un poco de historia ...
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
                                    {/* Glassmorphic year badge with slide-associated colors */}
                                    <div className={`absolute top-6 left-6 backdrop-blur-md px-4 py-2 rounded-full border border-current/10 font-mono text-sm font-bold tracking-wider shadow-lg ${slide.theme.bgAccent}`}>
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
                                        <div className={`h-1 w-16 bg-gradient-to-r ${slide.theme.gradient} rounded-full mb-6`} />

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
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="h-16 px-6 border-t border-border-subtle bg-surface-secondary flex items-center justify-between z-10 shrink-0">

                        {/* Pagination Dots indicator */}
                        <div className="flex items-center gap-2">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx
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
