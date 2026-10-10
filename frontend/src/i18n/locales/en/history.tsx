import type { Dict } from "../../dict";

export const history: Dict["history"] = {
    title: "A bit of history …",
    subtitle:
        "An interactive walk through the technological, theoretical and foundational milestones that gave birth to modern AI.",

    goToSlide: (n: number) => `Go to slide ${n}`,
    prevSlide: "Previous slide",
    nextSlide: "Next slide",
    keyboardTip: {
        prefix: "💡 Tip: you can use the arrow keys",
        middle: "and",
        suffix: "to navigate.",
    },

    slides: {
        1: {
            title: "Where it all began",
            year: "1943",
            description: `Warren S. McCulloch and Walter Pitts publish "A Logical Calculus of the Ideas Immanent in Nervous Activity". This paper charts the course and lays the foundations of modern AI by establishing that the brain can be understood as a computational system. It also introduces, for the first time, the concept of artificial neural networks — an idea that would inspire the development of computer systems able to simulate brain-like functions and processes.`,
            milestones: ["Neural Networks", "Computational Brain", "Propositional Logic"],
            quote: {
                text: "Because of the 'all-or-none' character of nervous activity, neural events can be represented by means of propositional logic.",
                author: "McCulloch & Pitts",
            },
        },
        2: {
            title: "The imitation game",
            year: "1950",
            description: `British mathematician Alan Turing publishes "Computing Machinery and Intelligence", a foundational text in the field of Artificial Intelligence that tackles one of science's most famous questions: "Can machines think?". Turing proposes assessing artificial intelligence through the "imitation game", known today as the Turing Test. The test measures a machine's ability to replicate human behaviour so convincingly that an evaluator cannot tell it apart from a person.`,
            milestones: ["Turing Test", "Alan Turing", "Philosophy of AI"],
            quote: {
                text: "Can machines think? I propose to consider this question by means of the imitation game.",
                author: "Alan Turing",
            },
        },
        3: {
            title: "Artificial Intelligence gets its name",
            year: "1955 - 1956",
            description: `In 1955, researchers John McCarthy, Marvin Minsky, Nathaniel Rochester and Claude Shannon write "A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence". This document coins the term "Artificial Intelligence" for the first time. The following year the historic conference at Dartmouth College takes place, formally establishing the field of study and its conceptual foundations for the decades to come.`,
            milestones: ["Dartmouth Project", "John McCarthy", "Marvin Minsky"],
            quote: {
                text: "We propose that a 2 month, 10 man study of artificial intelligence be carried out at Dartmouth College...",
                author: "Dartmouth Proposal (1955)",
            },
        },
        4: {
            title: "The Perceptron",
            year: "1958",
            description: `Frank Rosenblatt creates the Perceptron, the first algorithm to model a simple neural network. It gave practical shape to the concept of artificial neurons by modelling a binary classifier. Although at the time it was limited to linearly separable problems, the Perceptron laid the algorithmic foundations for the future of Deep Learning.`,
            milestones: ["Perceptron", "Binary Classification", "Frank Rosenblatt"],
            quote: {
                text: "The perceptron is the first outline of an artificial brain able to perceive and identify its surroundings.",
                author: "Frank Rosenblatt",
            },
        },
        5: {
            title: "Language processing and specialized knowledge",
            year: "1965",
            description: `Joseph Weizenbaum develops ELIZA, considered the first chatbot in history, reaching a milestone in natural language processing by simulating a human conversation. In parallel, at Stanford University, Edward Feigenbaum, Bruce Buchanan, Joshua Lederberg and Carl Djerassi begin developing DENDRAL. This was the first expert system able to automate the decision-making of organic chemists through hypothesis formation. DENDRAL's success proved that AI could carry out hyper-specialized tasks with accuracy equal to or better than human experts.`,
            milestones: ["ELIZA Chatbot", "Expert Systems", "DENDRAL"],
            quote: {
                text: "DENDRAL's success proved that AI could perform specialized tasks with expert-level accuracy.",
                author: "Edward Feigenbaum",
            },
        },
        6: {
            title: 'The first AI "winter"',
            year: "1970 - 1980",
            description: `In 1969, Marvin Minsky and Seymour Papert publish "Perceptrons: An Introduction to Computational Geometry", a critical analysis of the severe mathematical limitations of single-layer neural networks. That work, combined with the lack of immediate practical results, triggered what became known as the "first winter of Artificial Intelligence" — a decade of stagnation, waning interest and drained funding. By the early 1980s, however, the field slowly began to recover, driven by the commercial boom of expert systems and investment in projects such as Japan's Fifth Generation computers.`,
            milestones: ["AI Winter", "Network Limitations", "Fifth Generation"],
            quote: {
                text: "The book 'Perceptrons' mathematically proved the limitations of single-layer networks.",
                author: "Marvin Minsky & Seymour Papert",
            },
        },
        7: {
            title: "Backpropagation",
            year: "1986",
            description: `Geoffrey Hinton, David Rumelhart and Ronald Williams publish the seminal paper "Learning representations by back-propagating errors". Although the mathematical foundations of backpropagation had been explored in earlier years, this work demonstrates for the first time that it is viable for training multilayer neural networks. By overcoming the limitations of previous research, the finding rekindles interest in Artificial Intelligence and becomes the cornerstone of modern Deep Learning.`,
            milestones: ["Backpropagation", "Multilayer Networks", "Geoffrey Hinton"],
            quote: {
                text: "We show that a simple learning procedure can discover useful internal representations.",
                author: "Hinton, Rumelhart & Williams",
            },
        },
        8: {
            title: "Computer vision and image recognition",
            year: "1989",
            description: `Yann LeCun and a team of researchers at AT&T Bell Labs achieve a historic breakthrough by successfully applying backpropagation to a multilayer neural network designed to recognize handwritten postal codes. This is one of the first practical applications of Deep Learning through Convolutional Neural Networks (CNNs). The system's success demonstrates the real potential of neural networks for computer vision tasks and sets the stage for the growth of image-based AI in the following decades.`,
            milestones: ["Convolutional Networks", "Computer Vision", "Yann LeCun"],
            quote: {
                text: "Applying backpropagation to real-world images opens the door to pattern recognition.",
                author: "Yann LeCun",
            },
        },
        9: {
            title: "Deep Blue and LSTM memory",
            year: "1997",
            description: `A year of milestones both in the headlines and in the lab. On one side, IBM's Deep Blue supercomputer makes history by defeating the reigning world champion, Garry Kasparov. It is the first time a program beats a sitting champion in a tournament under regulation conditions. Its ability to compute millions of moves per second shows that machines can outperform humans at games of high strategic complexity, until then a hallmark of human intellect.\n\nIn parallel, Sepp Hochreiter and Jürgen Schmidhuber introduce Long Short-Term Memory (LSTM). This new kind of recurrent neural network (RNN) is designed to overcome a critical mathematical problem (the vanishing gradient), allowing systems to effectively capture and carry long-range dependencies in data.`,
            milestones: ["Deep Blue vs Kasparov", "LSTM Memory", "Recurrent Networks"],
            quote: {
                text: "LSTM solves the vanishing gradient, making it possible to remember events over the long term.",
                author: "Hochreiter & Schmidhuber",
            },
        },
        10: {
            title: "Deep Learning consolidates",
            year: "1998",
            description: `Yann LeCun, Yoshua Bengio and their collaborators publish a series of deeply influential papers (such as the LeNet-5 architecture) on applying neural networks to handwriting recognition in documents. Their work focuses on using convolutional neural networks to optimize backpropagation, making it more stable and effective when training deeper networks. By refining this process and demonstrating the immense power of CNNs to extract visual patterns, LeCun and Bengio's research cemented the techniques that today drive a vast range of AI applications.`,
            milestones: ["LeNet-5", "Pattern Recognition", "Yoshua Bengio"],
            quote: {
                text: "Combining CNNs and gradient propagation marks the practical consolidation of learning on images.",
                author: "LeCun, Bengio et al.",
            },
        },
        11: {
            title: "Deep Learning awakens",
            year: "2006",
            description: `Geoffrey Hinton and his team publish key research such as "A fast learning algorithm for deep belief nets", showing how to train deep neural networks layer by layer far more effectively. This approach overcomes the technical obstacles of the past and consolidates the transition to what we now call Deep Learning, letting machines learn complex hierarchical representations of data. This milestone marks the start of the modern Artificial Intelligence boom.`,
            milestones: ["Deep Belief Nets", "Hierarchical Learning", "Geoffrey Hinton"],
            quote: {
                text: "A fast, greedy learning algorithm can find good parameters for deep networks.",
                author: "Geoffrey Hinton",
            },
        },
        12: {
            title: "ImageNet",
            year: "2007",
            description: `Fei-Fei Li and her team at Princeton University start the ImageNet project: building a gigantic database of manually annotated images. The unprecedented scale and quality of this dataset unleashed a revolution in computer vision research, providing the training ground Deep Learning models needed to learn to recognize and classify complex objects.`,
            milestones: ["ImageNet", "Fei-Fei Li", "Big Data in AI"],
            quote: {
                text: "ImageNet is a large-scale effort to map out the real world of images.",
                author: "Fei-Fei Li",
            },
        },
        13: {
            title: "IBM Watson",
            year: "2011",
            description: `Watson, IBM's supercomputer designed to answer questions in natural language, grabs headlines worldwide by competing on the popular quiz show Jeopardy! and defeating its two historic champions, Ken Jennings and Brad Rutter. Watson's ability to process and interpret the nuances of human language, and to cross-reference its vast knowledge base in milliseconds, highlighted the enormous progress in Natural Language Processing.`,
            milestones: ["IBM Watson", "Jeopardy!", "Natural Language Processing"],
            quote: {
                text: "Watson showed that AI can process wordplay and the subtleties of human language in real time.",
                author: "IBM Watson Team",
            },
        },
        14: {
            title: "The AlexNet revolution",
            year: "2012",
            description: `A team of researchers at the University of Toronto, directed by Geoffrey Hinton and led by Alex Krizhevsky and Ilya Sutskever, achieves a breakthrough result at the ImageNet Large Scale Visual Recognition Challenge. Their convolutional neural network, named AlexNet, reaches a 16% error rate, shattering the previous year's record (25%). By harnessing the immense compute power of graphics cards (GPUs) to train the network for the first time, this achievement proved the overwhelming superiority of Deep Learning over traditional methods and changed AI's trajectory forever.`,
            milestones: ["AlexNet", "GPU Acceleration", "Deep Learning Revolution"],
            quote: {
                text: "GPU training allowed us to train a network with 60 million parameters.",
                author: "Krizhevsky, Sutskever & Hinton",
            },
        },
        15: {
            title: "Generative Adversarial Networks (GANs)",
            year: "2014",
            description: `Ian Goodfellow and a team of researchers introduce a new machine learning framework: Generative Adversarial Networks. The design pits two neural networks against each other in a competitive game: a "generator" that tries to create artificial data indistinguishable from reality, and a "discriminator" tasked with detecting whether that data is real or machine-made. This constant friction forces both networks to improve iteratively and relentlessly. The impact of GANs was monumental, since it empirically showed that AI could hold creative capabilities.`,
            milestones: ["GANs", "Ian Goodfellow", "Adversarial Networks"],
            quote: {
                text: "The generator and the discriminator are trained together, in a zero-sum game.",
                author: "Ian Goodfellow",
            },
        },
        16: {
            title: "AlphaGo",
            year: "2016",
            description: `AlphaGo, developed by Google DeepMind, defeats Go world champion and legend Lee Sedol 4-1. Because of the sheer number of possible moves in Go, it was considered impossible for a machine to win by brute force. AlphaGo's victory was a revolutionary milestone, showing that Deep Learning and reinforcement learning could give a machine something akin to human "intuition" for handling tasks of extreme strategic complexity.`,
            milestones: ["AlphaGo", "DeepMind vs Lee Sedol", "Reinforcement Learning"],
            quote: {
                text: "This is the most beautiful game I have played, and the machine showed creative moves.",
                author: "Lee Sedol",
            },
        },
        17: {
            title: '"Attention Is All You Need"',
            year: "2017",
            description: `A team of Google researchers led by Ashish Vaswani publishes one of the most important papers of the decade: "Attention Is All You Need". The text marks a paradigm shift by introducing the Transformer architecture and the "attention" mechanism. By allowing data to be processed in parallel, Transformers left behind the limitations of recurrent networks and laid the technological foundation for today's large language models.`,
            milestones: ["Transformers", "Attention Mechanism", "Ashish Vaswani"],
            quote: {
                text: "Attention is all you need to dispense with recurrence and convolutions entirely.",
                author: "Ashish Vaswani et al.",
            },
        },
        18: {
            title: "AlphaFold 2 decodes biology",
            year: "2020",
            description: `DeepMind's AlphaFold 2 reaches a historic milestone in biology by predicting, with astonishing accuracy, the three-dimensional structures of proteins from their amino acid sequences. This achievement solves "the protein folding problem", a puzzle that had frustrated scientists for half a century. Its impact is incalculable, dramatically accelerating disease research, drug development and our understanding of the molecular mechanisms of life.`,
            milestones: ["AlphaFold 2", "Protein Folding", "Structural Biology"],
            quote: {
                text: "AlphaFold has accelerated our understanding of how cells work at the molecular level like nothing before.",
                author: "Nature Editorial",
            },
        },
        19: {
            title: "GPT-3 and the era of LLMs",
            year: "2020 - 2023",
            description: `In 2020, OpenAI introduces GPT-3, a language model with 175 billion parameters that shows an unheard-of ability to generate text indistinguishable from human writing, to translate, to program and to reason from natural instructions (prompts). In late 2022, the public launch of ChatGPT democratizes this technology, triggering the fastest technology adoption in history and marking the definitive explosion of Large Language Models. In 2023, the arrival of even more powerful multimodal models consolidates the start of a new era in which generative AI transforms every sphere of society.`,
            milestones: ["GPT-3 / ChatGPT", "Language Models (LLMs)", "Generative AI"],
            quote: {
                text: "Generative AI has become a general-purpose tool for cognitive augmentation.",
                author: "OpenAI",
            },
        },
    },
};
