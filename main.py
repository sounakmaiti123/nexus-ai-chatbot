from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
import os

# Load .env file
load_dotenv()

# Create app
app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Request body model
class ChatRequest(BaseModel):
    message: str

# Chat endpoint
@app.post("/chat")
def chat(req: ChatRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are Nexus AI, a helpful assistant."},
                {"role": "user", "content": req.message}
            ]
        )

        return {
            "reply": response.choices[0].message.content
        }

    except Exception as e:
        print("OPENAI ERROR:", e)
        return {
            "error": str(e)
        }


# Health check (optional but useful)
@app.get("/")
def root():
    return {"status": "Backend is running"}
