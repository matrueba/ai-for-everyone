import { PageLink } from "../../../navigation";
import type { Dict } from "../../dict";

export const train: Dict["train"] = {
    header: {
        title: "Model Training",
        subtitle: "How do models actually learn to solve problems from data?",
    },

    intro: {
        p1: (
            <>
                In Artificial Intelligence (AI), <strong>training</strong> is the process by which a model learns to
                solve problems from data, without a human having to explicitly program the rules for doing so.
            </>
        ),
        p2: (
            <>
                During this process, the algorithm finds the underlying patterns and relationships in the data to build
                an <strong>internal mathematical model</strong> that characterizes how that information behaves. This is
                what lets the model produce answers when it is faced with new data it has never seen before.
            </>
        ),
    },

    elements: {
        heading: "Fundamental Elements",
        lead: "Three fundamental elements take part in the training process:",

        dataset: {
            title: "Training set",
            body: (
                <>
                    This is the raw information the model learns from. For learning to be effective, the data must be
                    properly structured, clean and reliable. We call each individual element of the set a{" "}
                    <strong>record</strong>. Data is usually laid out as a table (internally processed as numeric
                    matrices). Each row is a record and each column is a feature of the data.
                </>
            ),
            exampleLabel: "Example: predicting the value of a home",
            table: {
                headers: {
                    area: "Square Meters",
                    rooms: "Bedrooms",
                    elevator: "Has Elevator?",
                    price: "Price (Expected Output)",
                },
                rows: [
                    { area: "85 m²", rooms: "2", elevator: "Yes", price: "€250,000" },
                    { area: "120 m²", rooms: "3", elevator: "No", price: "€310,000" },
                    { area: "60 m²", rooms: "1", elevator: "Yes", price: "€180,000" },
                ],
            },
        },

        expected: {
            title: "Expected output",
            body: (
                <>
                    For training to work, the algorithm needs the true result of every record (in the table above, the{" "}
                    <strong>“Price”</strong> column). This is the “answer key” the model is measured against, so it can
                    tell how far off its prediction was.
                </>
            ),
        },

        algorithm: {
            title: "Algorithm",
            body: (
                <>
                    As we will see in the <PageLink to="gradient-descent">Gradient Descent</PageLink> section, AI offers
                    many algorithms depending on the problem to solve, with neural networks as today's main characters.
                    The algorithm is the underlying mathematical structure where the magic happens: it gives the model
                    the tools and the basic rules it needs to learn from data.
                </>
            ),
        },
    },

    cycle: {
        heading: "The Training Cycle Step by Step",
        lead: "Let's walk through the steps of this cycle:",

        steps: {
            1: {
                title: "Feeding data in batches",
                body: (
                    <>
                        The data is fed into the algorithm. For computational cost reasons, the training set is usually
                        split into small batches. Internally the algorithm runs huge matrix multiplications that eat a
                        lot of memory and CPU (if you want to know more about the math behind this, head to the{" "}
                        <PageLink to="gradient-descent">Gradient Descent</PageLink> section), so it is more efficient to
                        create small chunks that are fed in sequentially. Once the algorithm has processed every single
                        batch and completed the whole dataset, we say it has completed one{" "}
                        <strong>“epoch”</strong>.
                    </>
                ),
                imageAlt: "Dataset batching infographic",
                caption: "Infographic: Dataset Batching & Splitting Process",
            },
            2: {
                title: "Initial prediction (Guess)",
                body: (
                    <>
                        The algorithm processes the data it receives and tries to predict the final result. On this
                        first pass the model knows nothing yet and its settings are random, so its prediction is a blind
                        attempt — little more than a random guess.
                    </>
                ),
                imageAlt: "Forward pass / initial prediction infographic",
                caption: "Infographic: Forward Pass & Initial Output Prediction",
            },
            3: {
                title: "Error computation (Measure)",
                body: (
                    <>
                        We compare the result the model predicted against the real result (the expected output) to know
                        exactly how far off it was. That difference is the “error” or “loss”.
                    </>
                ),
                imageAlt: "Loss calculation infographic",
                caption: "Infographic: Loss Function Comparison & Error Scoring",
            },
            4: {
                title: "Parameter update (Adjust / Optimize)",
                body: (
                    <>
                        Based on the measured error, the model adjusts its internal parameters (its knobs and settings)
                        so that the next attempt has a smaller error. On the first rounds the error will be high, but as
                        the process repeats the parameters get fine-tuned and the prediction moves closer and closer to
                        the real output.
                    </>
                ),
                imageAlt: "Optimization and parameter update infographic",
                caption: "Infographic: Optimization & Parameter Updates via Gradient Descent",
            },
        },

        analogies: {
            dartboard: {
                title: "The Dartboard Analogy",
                body: "“Once the dart has landed, we walk up and measure the distance between the thrown dart (our prediction) and the bullseye (the correct result). That distance is the error: the further away it lands, the bigger the error we must correct for the next throw.”",
            },
            mixer: {
                title: "The Mixing Desk Analogy",
                body: "“Think of these parameters as the faders on a recording studio's mixing desk. At the start of training the faders are set at random and the music sounds awful (the error is very high). As the optimization process does its job, it nudges each fader slightly up or down. After every iteration the faders are better set and the ‘music’ (the prediction) gets closer to the perfect result.”",
            },
        },

        outro: (
            <>
                This process repeats iteratively over a set number of epochs until the model{" "}
                <strong>“stops learning”</strong> — that is, when the error between the prediction and reality no longer
                shrinks, or shrinks by a negligible amount. At that point we consider the model's training finished.
            </>
        ),
    },

    cta: {
        title: "Put the model's learning to the test!",
        body: (
            <>
                Head to the <PageLink to="gradient-descent">Gradient Descent</PageLink> section to explore the
                algorithms and the training process in depth.
            </>
        ),
    },
};
