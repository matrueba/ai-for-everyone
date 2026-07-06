import numpy as np


def sigmoid(z):
    z = np.clip(z, -500, 500)
    return 1 / (1 + np.exp(-z))


def train_playground_network(hidden_size=6, epochs=8000, learning_rate=0.8,
                             n_points=300, radius=1.8, seed=42):
    """
    Trains a tiny MLP (2 inputs -> hidden_size ReLU neurons -> 1 sigmoid output)
    on a toy "is the point inside the circle?" classification problem.

    Returns the trained weights plus a sample of the dataset so the frontend
    can draw the network and visualize neuron activations during inference.
    """
    rng = np.random.default_rng(seed)
    X = rng.uniform(-3, 3, size=(n_points, 2))
    y = ((X[:, 0] ** 2 + X[:, 1] ** 2) < radius ** 2).astype(float).reshape(-1, 1)

    W1 = rng.normal(0, 1, (2, hidden_size))
    b1 = np.zeros((1, hidden_size))
    W2 = rng.normal(0, 1, (hidden_size, 1))
    b2 = np.zeros((1, 1))

    for _ in range(epochs):
        # Forward pass
        Z1 = X @ W1 + b1
        A1 = np.maximum(0, Z1)
        Z2 = A1 @ W2 + b2
        A2 = sigmoid(Z2)

        # Backward pass (binary cross-entropy + sigmoid simplification)
        dZ2 = (A2 - y) / n_points
        dW2 = A1.T @ dZ2
        db2 = dZ2.sum(axis=0, keepdims=True)
        dZ1 = (dZ2 @ W2.T) * (Z1 > 0)
        dW1 = X.T @ dZ1
        db1 = dZ1.sum(axis=0, keepdims=True)

        W1 -= learning_rate * dW1
        b1 -= learning_rate * db1
        W2 -= learning_rate * dW2
        b2 -= learning_rate * db2

    accuracy = float(np.mean((A2 > 0.5) == (y > 0.5)))

    # Subsample the dataset for the frontend scatter plot
    n_display = min(150, n_points)
    idx = rng.choice(n_points, size=n_display, replace=False)

    return {
        "architecture": [2, hidden_size, 1],
        "activation_hidden": "relu",
        "activation_output": "sigmoid",
        "W1": W1.tolist(),
        "b1": b1.flatten().tolist(),
        "W2": W2.flatten().tolist(),
        "b2": float(b2[0, 0]),
        "radius": radius,
        "accuracy": accuracy,
        "data": {
            "x1": X[idx, 0].tolist(),
            "x2": X[idx, 1].tolist(),
            "label": y[idx, 0].tolist(),
        },
    }
