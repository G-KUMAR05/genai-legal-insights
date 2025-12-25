import os
import json
from typing import List
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import PyPDF2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# 1. Configure CORS (To allow your React app to talk to this backend)
# backend/main.py

app.add_middleware(
    CORSMiddleware,
    # CHANGE THIS LINE: Allow all origins to rule out port mismatches
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Configure Gemini API
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GENAI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel('gemini-flash-latest') # Flash is faster/cheaper for this# Flash is faster/cheaper for this

def extract_text_from_pdf(file_file):
    try:
        pdf_reader = PyPDF2.PdfReader(file_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

@app.post("/analyze")
async def analyze_document(
    files: List[UploadFile] = File(...),
    settings: str = Form(...)
):
    """
    Receives file(s) and settings, extracts text, and sends to Gemini for analysis.
    """
    combined_text = ""
    
    # 1. Extract text from uploaded files
    for file in files:
        content = ""
        if file.content_type == "application/pdf":
            content = extract_text_from_pdf(file.file)
        elif file.content_type == "text/plain":
            content = (await file.read()).decode("utf-8")
        # Add docx support here if needed using python-docx
        
        combined_text += f"\n--- Document: {file.filename} ---\n{content}"

    if not combined_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from files.")

    # 2. Parse settings (from the JSON string sent by frontend)
    try:
        settings_dict = json.loads(settings)
    except:
        settings_dict = {}

    # 3. Construct Prompt for Gemini
    # We strictly enforce the JSON structure required by your frontend 'AnalysisResult' interface
    prompt = f"""
    Act as a senior legal AI assistant. Analyze the following document text.
    
    User Settings:
    - Include Future Scenarios: {settings_dict.get('futureScenarios', False)}
    - Suggest Changes: {settings_dict.get('suggestChanges', False)}
    - Highlight Dates: {settings_dict.get('highlightDates', False)}

    Return a valid JSON object (NO markdown formatting, just raw JSON) with the following structure:
    {{
      "summary": "A concise summary of the document (string).",
      "justification": "Why this document is low/high risk or relevant (string).",
      "score": 0 to 100 (integer, where 100 is perfect compliance/quality),
      "risks": ["Risk 1", "Risk 2", "Risk 3"] (array of strings),
      "recommendations": ["Rec 1", "Rec 2"] (array of strings)
    }}

    Document Content:
    {combined_text[:30000]}  # Truncate to avoid token limits if necessary
    """

    # 4. Call Gemini
    try:
        response = model.generate_content(prompt)
        
        # Clean up response (remove ```json ... ``` if Gemini adds it)
        cleaned_response = response.text.replace("```json", "").replace("```", "").strip()
        
        # Parse JSON to ensure validity before sending to frontend
        analysis_result = json.loads(cleaned_response)
        
        return analysis_result

    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)