def load_model(name):
    with open(f"trained_models/{name}.json", "r") as f:
        return json.load(f)

def save_model(model, name):
    with open(f"trained_models/{name}.json", "w") as f:
        json.dump(model, f)