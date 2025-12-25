# backend/test_models.py
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: API Key not found in .env")
else:
    genai.configure(api_key=api_key)
    print(f"Checking models with key: {api_key[:5]}...")

    try:
        print("\nAVAILABLE MODELS:")
        found_any = False
        for m in genai.list_models():
            # We only care about models that can generate text
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
                found_any = True

        if not found_any:
            print("No content generation models found. Check your API key permissions.")

    except Exception as e:
        print(f"Connection Error: {e}")