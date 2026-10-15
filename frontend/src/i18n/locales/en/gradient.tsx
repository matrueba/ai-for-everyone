import type { Dict } from "../../dict";

export const gradient: Dict["gradient"] = {
    page: {
        title: "Gradient Descent",
        subtitle:
            "Explore how different models learn by minimizing their cost functions using the Gradient Descent optimization algorithm.",
        tabTheory: "Theory",
        tabLinear: "Linear Regression",
        tabLogistic: "Logistic Regression",
    },

    theory: {
        optimization: {
            heading: "Training and Optimization",
            p1: (
                <>
                    As explained in the training section, the main goal when training an Artificial Intelligence model
                    is to <strong>optimize its parameters</strong>. That is how we can assess how well it fits our data
                    and make sure its predictions are accurate when it faces new information.
                </>
            ),
            p2: (
                <>
                    To achieve this we use the algorithm known as <strong>Gradient Descent</strong>, the fundamental
                    optimization engine that modern Artificial Intelligence models are built on.
                </>
            ),
        },

        cost: {
            heading: "The Cost Function",
            p1: (
                <>
                    The first step of this process is to define the <strong>cost function</strong>. This mathematical
                    expression measures the error the model makes when trying to predict the output value from the input
                    data.
                </>
            ),
            p2: (
                <>
                    Obviously our goal is for predictions to be as accurate as possible; in other words, the algorithm
                    will always try to <strong>minimize this error function</strong>. There are different functions to
                    compute that error depending on the type of problem:
                </>
            ),
            mse: {
                title: "Mean Squared Error (MSE)",
                body: "Mainly used for problems that predict continuous values (Regression).",
            },
            crossEntropy: {
                title: "Cross-Entropy (Log Loss)",
                body: "Used when the goal is to predict categories or classes (Classification).",
            },
        },

        analogy: {
            heading: "The Descent Analogy",
            p1: (
                <>
                    Translated into mathematical terms, we want the error to reach a <strong>global minimum</strong>{" "}
                    inside a multidimensional space.
                </>
            ),
            mathAlt: "Mathematical representation of gradient descent",
            lead: "To make sense of it, let's use a visual analogy:",
            quote: "“Imagine you are on an expedition high up in a mountain range wrapped in thick fog. Your goal is to reach the lowest point, where base camp lies. Since you cannot see around you, you use your feet to feel the slope of the ground and take a step in the direction where it drops most steeply.”",
            descentAlt: "Gradient descent animation",
            descentCaption: "Visual representation of the descent along the error surface towards the global minimum",
            p2: (
                <>
                    This analogy also illustrates one of the algorithm's biggest challenges, though:{" "}
                    <strong>local minima</strong>. Surrounded by fog, the model has no global view of the landscape. You
                    could walk down to the bottom of a small valley believing you have reached the lowest possible
                    point, without realizing there is a far deeper valley elsewhere (the global minimum).
                </>
            ),
            p3: (
                <>
                    If the algorithm reaches a valley where the ground rises again in every direction, it stops. Much of
                    the complexity of model design lies precisely in escaping these deceptive local minima to find the
                    true global minimum. This is where the <strong>hyperparameters</strong> we will meet along this
                    journey come into play.
                </>
            ),
        },

        math: {
            heading: "The Math of the Search",
            p1: (
                <>
                    Here the concept of the <strong>gradient</strong> comes in: the direction in which a function grows
                    fastest. It follows that taking the opposite direction moves us along the steepest descent.
                </>
            ),
            terms: {
                weights: (
                    <>
                        <strong>Parameters:</strong> the model weights we are optimizing.
                    </>
                ),
                gradient: (
                    <>
                        <strong>Gradient:</strong> tells us the direction and the steepness of the slope at our current
                        point.
                    </>
                ),
                learningRate: (
                    <>
                        <strong>Learning Rate:</strong> controls the step size. Too large and we might jump over the
                        bottom of the valley; too small and learning becomes extremely slow.
                    </>
                ),
            },
        },

        cta: (
            <>
                In the <strong>Linear Regression</strong> and <strong>Logistic Regression</strong> tabs you can dig
                deeper into how the algorithm applies to each type of problem.
            </>
        ),
    },

    controls: {
        start: "Start training",
        pause: "Pause",
        reset: "Reset",
        learningRate: "LR:",
        iteration: "Iteration",
    },

    linear: {
        title: "Linear Regression",
        subtitle: "Predict continuous values by fitting a straight line or plane.",
        loading: "Loading linear regression…",
        mode2d: "Example 1 (2D)",
        mode3d: "House Price (3D)",

        heading: "Linear Regression Fundamentals",
        p1: (
            <>
                When the goal is to predict a <strong>continuous numeric value</strong> (a price, a salary, a distance),
                the simplest model is Linear Regression.
            </>
        ),
        scenario: {
            title: "Example Scenario: House Price Prediction",
            lead: (
                <>
                    We want to predict the value (<strong>y</strong>) of a home based on two main features:
                </>
            ),
            bullets: {
                1: (
                    <>
                        Its size in square meters (<strong>X₁</strong>).
                    </>
                ),
                2: (
                    <>
                        A 1-to-10 score rating its location (<strong>X₂</strong>).
                    </>
                ),
            },
        },
        p2: (
            <>
                For the AI to learn, we start from a dataset containing many example homes where we already know both
                their features and their real price. The <strong>Gradient Descent</strong> algorithm will uncover the
                patterns in that data.
            </>
        ),
        modelHeading: "The Mathematical Model",
        modelLead:
            "Being a linear regression, the function that defines our model is a linear equation with this structure:",
        legend: {
            y: (
                <>
                    <strong>y:</strong> the model's prediction (estimated price).
                </>
            ),
            x: (
                <>
                    <strong>X₁ / X₂:</strong> input variables (m² and location score).
                </>
            ),
            w: (
                <>
                    <strong>W₁ / W₂:</strong> parameters, i.e. the weight of each
                    feature.
                </>
            ),
            b: (
                <>
                    <strong>b:</strong> baseline offset parameter (bias).
                </>
            ),
        },
        realtimeHeading: "Real-Time Optimization",
        realtimeBody: (
            <>
                The goal is for Gradient Descent to automatically tune the values of <strong>W</strong> and{" "}
                <strong>b</strong> until it finds the ones that minimize the error. In the interactive playground you
                can watch this function move and fit itself to the data.
            </>
        ),
        lrBox: {
            title: "Explore why the Learning Rate (LR) matters",
            tooLowLabel: "If the rate is too low:",
            tooLowBody:
                "The algorithm takes tiny steps. It will need thousands of iterations and training becomes painfully slow.",
            tooHighLabel: "If the rate is too high:",
            tooHighBody:
                "The algorithm takes erratic steps and “bounces” from side to side, never settling into the global minimum.",
        },
    },

    logistic: {
        title: "Logistic Regression",
        subtitle: "Classify data points into categories using the sigmoid function.",
        loading: "Loading logistic regression…",
        mode2d: "Example 1 (2D)",
        mode3d: "Admission Probability (3D)",

        heading: "Logistic Regression Fundamentals",
        p1: (
            <>
                When the goal is to predict a <strong>binary category or class</strong> (Yes/No, Spam/Not Spam,
                Admitted/Rejected) instead of a continuous number, we turn to Logistic Regression.
            </>
        ),
        scenario: {
            title: "Example Scenario: University Admission",
            lead: (
                <>
                    We want to predict the probability that a student is admitted (<strong>y = 1</strong> or{" "}
                    <strong>0</strong>) based on two main features:
                </>
            ),
            bullets: {
                1: (
                    <>
                        Weekly study hours (<strong>X₁</strong>).
                    </>
                ),
                2: (
                    <>
                        The entrance exam score (<strong>X₂</strong>).
                    </>
                ),
            },
        },
        p2: (
            <>
                Unlike linear regression, we cannot simply draw a straight line through the data. We must apply
                non-linear functions that squash the output between <strong>0 and 1</strong> (0% and 100%). The typical
                function used for this is the <strong>sigmoid</strong>. Later on we will meet other non-linear functions
                used in classification problems, such as the hyperbolic tangent.
            </>
        ),
        sigmoidAlt: "Sigmoid function",
        sigmoidCaption: "The sigmoid function maps any real value into a value bounded between 0 and 1.",
        modelHeading: "The Mathematical Model",
        modelLead:
            "The model output is computed by passing the linear combination of the features through the sigmoid function:",
        legend: {
            y: (
                <>
                    <strong>y:</strong> predicted probability (between 0 and 1) of
                    admission.
                </>
            ),
            z: (
                <>
                    <strong>z:</strong> linear combination of the features.
                </>
            ),
            x: (
                <>
                    <strong>X₁ / X₂:</strong> input variables (hours and exam score).
                </>
            ),
            w: (
                <>
                    <strong>W₁ / W₂ / b:</strong> weights and bias that define the
                    decision boundary.
                </>
            ),
            sigma: (
                <>
                    <strong>σ():</strong> the sigmoid function.
                </>
            ),
        },
        borderHeading: "The Sigmoid and the Boundary",
        borderBody: (
            <>
                The sigmoid squashes any real value into the (0, 1) interval. If <strong>y ≥ 0.5</strong>, we classify
                the prediction as class 1 (Admitted); if it is lower, as class 0. The locus where the probability is
                exactly 0.5 (that is, z = 0) is known as the <strong>decision boundary</strong>.
            </>
        ),
        lossBox: {
            title: "The Loss Function: Cross-Entropy",
            body: (
                <>
                    In logistic regression we do not use Mean Squared Error but{" "}
                    <strong>Binary Cross-Entropy (Log Loss)</strong>. This function heavily penalizes errors made with
                    high confidence. For example, predicting a probability of 0.01 when the true class is 1 produces an
                    exponentially large penalty.
                </>
            ),
        },
    },

    plots: {
        regression2d: {
            title: "Model Fit",
            xLabel: "Feature (X)",
            yLabel: "Target (y)",
        },
        regression3d: {
            title: "House Price Prediction",
            subtitle: "Regression plane over m² and location (normalized data)",
            iteration: "Iteration",
            cost: "Cost",
            xLabel: "Size",
            yLabel: "Location",
            zLabel: "Price",
            dataName: "Homes (training data)",
            planeName: "Regression plane",
            fitted: "Fitted function",
            formulaVars: { price: "price", area: "m²", location: "location" },
        },
        cost: {
            titles: {
                "1d": "Cost Function (1D)",
                "2d": "Error Reduction (2D)",
                mse: "Error Reduction (MSE)",
            },
            subtitles: {
                "1d": "Loss minimization over w",
                "2d": "Optimization path over w and b",
                mse: "Loss minimization over time",
            },
            axisWeight: "Weight (w)",
            axisBias: "Bias (b)",
            axisIteration: "Iteration",
            axisCostMse: "Cost (MSE)",
            axisCostJ: "Cost J(w)",
            searching: "Searching for the global minimum…",
            currentCost: "Current cost:",
        },
        backprop3d: {
            title: "Parameter Space Optimization",
            subtitle: "Gradient descent · log(1+cost) scale",
            pathName: "Optimization path",
            currentName: "Current position",
            axisCost: "Cost",
            statW1: "W₁ (study hours)",
            statW2: "W₂ (exam score)",
            statCost: "Cost (Log Loss)",
        },
        logistic2d: {
            title: "Model Classification Boundary",
            xLabel: "Feature (X)",
            yLabel: "Probability (P(y=1))",
            iteration: "Iteration:",
            logLoss: "Log Loss:",
        },
        logistic3d: {
            title: "3D Admission Prediction",
            subtitle: "Probability of being admitted (Yes/No)",
            iteration: "Iteration:",
            logLoss: "Log Loss:",
            studentsName: "Students",
            surfaceName: "Probability (Sigmoid)",
            xLabel: "Study Hours (x₁)",
            yLabel: "Entrance Exam (x₂)",
            zLabel: "Admission Prob. P(y=1)",
            footerLabel: "Admission Probability Function",
            formulaVars: { hours: "hours", score: "score" },
        },
    },
};
