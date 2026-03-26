import os
from google import genai

# Use a lazy loader for the client to prevent hanging on import
_client = None

def get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key="AIzaSyCBoG48svSpQP5TDxcdtByIU1SmSdc9CL4")
    return _client

def load_profile():
    # Use absolute path for reliability
    profile_path = r"c:\Users\loja\Desktop\career-ai\freelance_profile.md"
    if os.path.exists(profile_path):
        with open(profile_path, "r", encoding="utf-8") as f:
            return f.read()
    return "Profile not found."

def job_agent(task):
    client = get_client()
    profile = load_profile()
    
    prompt = f"""
    You are an expert Freelance Career Agent for Nicolli Rezk.
    
    NICOLI'S PROFILE:
    {profile}
    
    USER TASK:
    {task}
    
    GOAL:
    Find real-world job categories on platforms like Upwork, Freelancer, Workana, and LinkedIn.
    Then, draft a professional "Cover Letter" or "Proposal" that Nicolli can use immediately.
    
    PROPOSAL GUIDELINES:
    - Use a premium, professional tone.
    - Highlight skills matching the job (UX/UI, HTML/CSS).
    - Include Nicolli's LinkedIn: https://www.linkedin.com/in/nicolli-rezk-496417206/
    - Mention their Portfolio: https://nicolli-rezk-projects.surge.sh
    
    RESPOND IN PORTUGUESE (PT-BR).
    Format as:
    1. **Vagas Sugeridas** (Platform, Title, Key Skills)
    2. **Busca Recomendada** (Exact search strings)
    3. **Modelo de Proposta/Proposal** (Ready to copy)
    4. **Dica de Portfólio** (Which projects to show)
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    return response.text