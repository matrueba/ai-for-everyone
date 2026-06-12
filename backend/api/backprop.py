import numpy as np

def generate_adam_steps(iterations=100, learning_rate=0.01, beta1=0.9, beta2=0.999, epsilon=1e-8):
    # Fixed seed for reproducibility
    np.random.seed(42)
    
    # Generate dummy data: y = 2x + 1 + noise
    X = np.linspace(-5, 5, 20)
    y = 2 * X + 1 + np.random.normal(0, 1, size=X.shape)
    
    # Initialize parameters
    w = -5.0 
    b = -5.0
    
    # Adam parameters initialization
    m_w, v_w = 0, 0
    m_b, v_b = 0, 0
    
    steps = []
    
    # Pre-calculate cost surface for visualization (same as GD)
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
    
    for i in range(1, iterations + 1):
        # Forward pass
        predictions = w * X + b
        error = predictions - y
        cost = np.mean(error ** 2)
        
        # Save step info
        steps.append({
            "iteration": i - 1,
            "w": float(w),
            "b": float(b),
            "cost": float(cost),
            "predictions": predictions.tolist()
        })
        
        # Backward pass (gradients)
        dw = (2 / len(X)) * np.dot(error, X)
        db = (2 / len(X)) * np.sum(error)
        
        # Adam updates
        m_w = beta1 * m_w + (1 - beta1) * dw
        v_w = beta2 * v_w + (1 - beta2) * (dw ** 2)
        
        m_b = beta1 * m_b + (1 - beta1) * db
        v_b = beta2 * v_b + (1 - beta2) * (db ** 2)
        
        # Bias correction
        m_w_corr = m_w / (1 - beta1 ** i)
        v_w_corr = v_w / (1 - beta2 ** i)
        
        m_b_corr = m_b / (1 - beta1 ** i)
        v_b_corr = v_b / (1 - beta2 ** i)
        
        # Update parameters
        w -= learning_rate * m_w_corr / (np.sqrt(v_w_corr) + epsilon)
        b -= learning_rate * m_b_corr / (np.sqrt(v_b_corr) + epsilon)
        
    return {
        "data": {"x": X.tolist(), "y": y.tolist()},
        "steps": steps,
        "cost_surface": cost_surface
    }

def generate_adam_3d(iterations=100, learning_rate=0.01, beta1=0.9, beta2=0.999, epsilon=1e-8):
    np.random.seed(42)
    
    # Generate data for z = 2x1 + 3x2 + 1 + noise
    n_points = 100
    x1 = np.random.uniform(-5, 5, n_points)
    x2 = np.random.uniform(-5, 5, n_points)
    y = 2 * x1 + 3 * x2 + 1 + np.random.normal(0, 1, n_points)
    
    # Initialize parameters
    w1, w2, b = -5.0, -5.0, -5.0
    
    # Adam parameters initialization
    m_w1, v_w1 = 0, 0
    m_w2, v_w2 = 0, 0
    m_b, v_b = 0, 0
    
    steps = []
    
    # Pre-calculate cost surface (w1 vs w2, fixing b at target 1.0)
    w1_range = np.linspace(-6, 8, 50)
    w2_range = np.linspace(-6, 10, 50)
    W1, W2 = np.meshgrid(w1_range, w2_range)
    Z_cost = np.zeros(W1.shape)
    
    target_b = 1.0
    for i in range(W1.shape[0]):
        for j in range(W1.shape[1]):
            preds = W1[i, j] * x1 + W2[i, j] * x2 + target_b
            Z_cost[i, j] = np.mean((preds - y) ** 2)
            
    cost_surface = {
        "x": w1_range.tolist(),
        "y": w2_range.tolist(),
        "z": Z_cost.tolist()
    }
    
    for i in range(1, iterations + 1):
        preds = w1 * x1 + w2 * x2 + b
        error = preds - y
        cost = np.mean(error ** 2)
        
        steps.append({
            "iteration": i - 1,
            "w1": float(w1),
            "w2": float(w2),
            "b": float(b),
            "cost": float(cost)
        })
        
        dw1 = (2 / n_points) * np.dot(error, x1)
        dw2 = (2 / n_points) * np.dot(error, x2)
        db = (2 / n_points) * np.sum(error)
        
        # Adam updates
        m_w1 = beta1 * m_w1 + (1 - beta1) * dw1
        v_w1 = beta2 * v_w1 + (1 - beta2) * (dw1 ** 2)
        
        m_w2 = beta1 * m_w2 + (1 - beta1) * dw2
        v_w2 = beta2 * v_w2 + (1 - beta2) * (dw2 ** 2)
        
        m_b = beta1 * m_b + (1 - beta1) * db
        v_b = beta2 * v_b + (1 - beta2) * (db ** 2)
        
        # Bias correction
        m_w1_corr = m_w1 / (1 - beta1 ** i)
        v_w1_corr = v_w1 / (1 - beta2 ** i)
        
        m_w2_corr = m_w2 / (1 - beta1 ** i)
        v_w2_corr = v_w2 / (1 - beta2 ** i)
        
        m_b_corr = m_b / (1 - beta1 ** i)
        v_b_corr = v_b / (1 - beta2 ** i)
        
        # Update parameters
        w1 -= learning_rate * m_w1_corr / (np.sqrt(v_w1_corr) + epsilon)
        w2 -= learning_rate * m_w2_corr / (np.sqrt(v_w2_corr) + epsilon)
        b -= learning_rate * m_b_corr / (np.sqrt(v_b_corr) + epsilon)
        
    return {
        "data": {"x1": x1.tolist(), "x2": x2.tolist(), "y": y.tolist()},
        "steps": steps,
        "cost_surface": cost_surface
    }

def run_gradient_descent_matrix(X, y, iterations=100, learning_rate=0.01):
    """
    Generic Gradient Descent using matrix multiplication.
    Supports input X of any dimension (n_samples, n_features).
    """
    X = np.array(X)
    y = np.array(y)
    
    # Ensure X is 2D (samples, features)
    if X.ndim == 1:
        X = X.reshape(-1, 1)
    
    # Ensure y is 2D (samples, 1) for matrix operations
    if y.ndim == 1:
        y = y.reshape(-1, 1)
        
    n_samples, n_features = X.shape
    
    # Initialize weights and bias
    # W shape: (n_features, 1)
    W = np.zeros((n_features, 1))
    b = 0.0
    
    steps = []
    
    for i in range(iterations):
        # Forward pass: y_pred = X @ W + b
        predictions = X @ W + b
        error = predictions - y
        cost = np.mean(error ** 2)
        
        # Save step info
        steps.append({
            "iteration": i,
            "weights": W.flatten().tolist(),
            "bias": float(b),
            "cost": float(cost)
        })
        
        # Backward pass (gradients)
        # Gradient of W: (2/m) * X^T @ error
        dW = (2 / n_samples) * (X.T @ error)
        # Gradient of b: (2/m) * sum(error)
        db = (2 / n_samples) * np.sum(error)
        
        # Update parameters
        W -= learning_rate * dW
        b -= learning_rate * db
        
    return {
        "final_weights": W.flatten().tolist(),
        "final_bias": float(b),
        "steps": steps
    }

def get_matrix_cost_surface(X, y, w1_range, w2_range, fixed_b=0.0, mode='wb'):
    """
    Calculates cost surface.
    mode='wb': w1_range is for Weight[0], w2_range is for Bias.
    mode='ww': w1_range is for Weight[0], w2_range is for Weight[1], fixed_b is used.
    """
    X = np.array(X)
    y = np.array(y).reshape(-1, 1)
    
    W1, W2 = np.meshgrid(w1_range, w2_range)
    Z = np.zeros(W1.shape)
    
    for i in range(W1.shape[0]):
        for j in range(W1.shape[1]):
            if mode == 'wb':
                # W[0] vs Bias
                W_temp = np.zeros((X.shape[1], 1))
                W_temp[0] = W1[i, j]
                preds = X @ W_temp + W2[i, j]
            else:
                # W[0] vs W[1]
                W_temp = np.zeros((X.shape[1], 1))
                W_temp[0] = W1[i, j]
                if X.shape[1] > 1:
                    W_temp[1] = W2[i, j]
                preds = X @ W_temp + fixed_b
                
            Z[i, j] = np.mean((preds - y) ** 2)
            
    if mode == 'wb':
        return {"w": w1_range.tolist(), "b": w2_range.tolist(), "z": Z.tolist()}
    else:
        return {"x": w1_range.tolist(), "y": w2_range.tolist(), "z": Z.tolist()}

def sigmoid(z):
    # Clip to prevent overflow
    z = np.clip(z, -500, 500)
    return 1 / (1 + np.exp(-z))

def run_logistic_regression_matrix(X, y, iterations=100, learning_rate=0.01):
    """
    Logistic Regression Gradient Descent using matrix multiplication.
    Supports input X of any dimension (n_samples, n_features).
    """
    X = np.array(X)
    y = np.array(y)
    
    if X.ndim == 1:
        X = X.reshape(-1, 1)
    
    if y.ndim == 1:
        y = y.reshape(-1, 1)
        
    n_samples, n_features = X.shape
    
    W = np.zeros((n_features, 1))
    b = 0.0
    
    steps = []
    
    for i in range(iterations):
        predictions = sigmoid(X @ W + b)
        error = predictions - y
        
        eps = 1e-15
        cost = -np.mean(y * np.log(predictions + eps) + (1 - y) * np.log(1 - predictions + eps))
        
        steps.append({
            "iteration": i,
            "weights": W.flatten().tolist(),
            "bias": float(b),
            "cost": float(cost)
        })
        
        dW = (1 / n_samples) * (X.T @ error)
        db = (1 / n_samples) * np.sum(error)
        
        W -= learning_rate * dW
        b -= learning_rate * db
        
    return {
        "final_weights": W.flatten().tolist(),
        "final_bias": float(b),
        "steps": steps
    }

def get_logistic_cost_surface(X, y, w1_range, w2_range, fixed_b=0.0, mode='wb'):
    X = np.array(X)
    y = np.array(y).reshape(-1, 1)
    
    W1, W2 = np.meshgrid(w1_range, w2_range)
    Z = np.zeros(W1.shape)
    eps = 1e-15
    
    for i in range(W1.shape[0]):
        for j in range(W1.shape[1]):
            if mode == 'wb':
                W_temp = np.zeros((X.shape[1], 1))
                W_temp[0] = W1[i, j]
                preds = sigmoid(X @ W_temp + W2[i, j])
            else:
                W_temp = np.zeros((X.shape[1], 1))
                W_temp[0] = W1[i, j]
                if X.shape[1] > 1:
                    W_temp[1] = W2[i, j]
                preds = sigmoid(X @ W_temp + fixed_b)
                
            Z[i, j] = -np.mean(y * np.log(preds + eps) + (1 - y) * np.log(1 - preds + eps))
            
    if mode == 'wb':
        return {"w": w1_range.tolist(), "b": w2_range.tolist(), "z": Z.tolist()}
    else:
        return {"x": w1_range.tolist(), "y": w2_range.tolist(), "z": Z.tolist()}

