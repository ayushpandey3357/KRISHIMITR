from backend.app import build_disease_model, MODEL_PATH


def main():
    model = build_disease_model()
    model.save(MODEL_PATH)
    print(f"Saved untrained disease model to {MODEL_PATH}. Replace with a trained model for better accuracy.")


if __name__ == "__main__":
    main()
