import numpy as np

def generate_backprop_steps(iterations=100, learning_rate=0.01):
    # Fixed seed for reproducibility
    np.random.seed(42)
    
    # Generate dummy data: y = 2x + 1 + noise
    X = np.linspace(-5, 5, 20)
    y = 2 * X + 1 + np.random.normal(0, 1, size=X.shape)
    
    # Initialize parameters
    w = -5.0 # Way off
    b = -5.0
    
    steps = []
    
    # Pre-calculate cost surface for visualization
    w_range = np.linspace(-1, 5, 50)
    b_range = np.linspace(-2, 4, 50)
    W, B = np.meshgrid(w_range, b_range)
    Z = np.zeros(W.shape)
    
    for i in range(W.shape[0]):
        for j in range(W.shape[1]):
            predictions = W[i, j] * X + B[i, j]
            Z[i, j] = np.mean((predictions - y) ** 2)
    
    cost_surface = {
        "w": w_range.tolist(),
        "b": b_range.tolist(),
        "z": Z.tolist()
    }
    
    for i in range(iterations):
        # Forward pass
        predictions = w * X + b
        error = predictions - y
        cost = np.mean(error ** 2)
        
        # Save step info
        steps.append({
            "iteration": i,
            "w": float(w),
            "b": float(b),
            "cost": float(cost),
            "predictions": predictions.tolist()
        })
        
        # Backward pass (gradients)
        dw = (2 / len(X)) * np.dot(error, X)
        db = (2 / len(X)) * np.sum(error)
        
        # Update parameters
        w -= learning_rate * dw
        b -= learning_rate * db
        
    return {
        "data": {"x": X.tolist(), "y": y.tolist()},
        "steps": steps,
        "cost_surface": cost_surface
    }
