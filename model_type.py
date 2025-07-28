import google.generativeai as genai

# Set your API key
genai.configure(api_key="AIzaSyBvU_gJFjTi0Cf3gLlZWNGJ4RLvSBv3bOM")

# List available models
models = genai.list_models()

# Print model names and their capabilities
for model in models:
    print(f"Model Name: {model.name}")
    print(f"  Generation Methods: {model.supported_generation_methods}")
    print(f"  Multimodal Support: {'vision' in model.name}")
    print("-" * 40)
