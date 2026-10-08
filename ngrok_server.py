import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pyngrok import ngrok

# 1. SETUP API & CORS
app = FastAPI()
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

class ModelInput(BaseModel):
    prompt: str 

# 2. YOUR MODEL ENDPOINT
@app.post("/api/run-model")
def run_model(req: ModelInput):
    # ---------------------------------------------------------
    # IMPORT AND RUN YOUR HACKATHON MODEL HERE
    # import FULL_HACKATHON_DEMO
    # result = FULL_HACKATHON_DEMO.run(req.prompt)
    # ---------------------------------------------------------
    return {"status": "success", "output": f"Ngrok Tunnel Success! Received: {req.prompt}"}

if __name__ == "__main__":
    # 3. NGROK TUNNEL SETUP
    # IMPORTANT: If Ngrok asks for an auth token, uncomment the line below and add your token from dashboard.ngrok.com
    ngrok.set_auth_token("3JqKWfBbVJIZvi4o44nAV8hqSA6_4wh1LWk2LHVAjoSJQhus7")
    
    port = 8000
    public_url = ngrok.connect(port).public_url
    
    print("\n" + "="*60)
    print("SUCCESS: NGROK TUNNEL IS LIVE!")
    print(f"COPY THIS URL TO YOUR WEBSITE: {public_url}")
    print("="*60 + "\n")
    
    # 4. START LOCAL SERVER
    uvicorn.run(app, host="0.0.0.0", port=port)
