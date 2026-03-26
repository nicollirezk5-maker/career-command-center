import os
import re
from flask import Flask, request, jsonify, render_template, send_from_directory

app = Flask(__name__)

PORTFOLIO_ROOT = os.path.dirname(os.path.abspath(__file__))
PROPOSALS_FILE = os.path.join(PORTFOLIO_ROOT, "minhas_propostas.md")


def get_portfolio_projects():
    projects = []
    ignore = ["templates", "static", "__pycache__", ".git", ".gemini", "brain", "deploy_ready", "deploy_ready.zip", "figma-plugin"]
    
    if not os.path.exists(PORTFOLIO_ROOT):
        return []

    for item in os.listdir(PORTFOLIO_ROOT):
        path = os.path.join(PORTFOLIO_ROOT, item)
        if os.path.isdir(path) and not item.startswith(".") and item not in ignore:
            # Check for common entry points more flexibly
            files = os.listdir(path)
            has_index = any(f.lower() == "index.html" for f in files)
            has_styles = any(f.lower() in ["styles.css", "style.css", "main.css"] for f in files)
            
            if has_index or has_styles:
                # Look for a preview image with better prioritization
                image = None
                image_extensions = [".png", ".jpg", ".jpeg", ".webp"]
                
                # Priority 0: Premium Cover
                if "cover_premium.png" in files:
                    image = f"/static/projects/{item}/cover_premium.png"

                # Priority 1: "Real" screenshots or v2
                if not image:
                    real_candidates = [f for f in files if any(kw in f.lower() for kw in ["real", "_v2", "final", "preview", "screenshot"])]
                    if real_candidates:
                        # Pick the best one from candidates
                        best = next((f for f in real_candidates if "real" in f.lower()), real_candidates[0])
                        image = f"/static/projects/{item}/{best}"
                
                # Priority 2: Generic project image
                if not image:
                   for f in files:
                       fname = f.lower()
                       if any(fname.endswith(ext) for ext in image_extensions) and not any(kw in fname for kw in ["logo", "icon", "banner"]):
                           image = f"/static/projects/{item}/{f}"
                           break
                
                # Priority 3: Any image as absolute fallback
                if not image:
                    for f in files:
                        if any(f.lower().endswith(ext) for ext in image_extensions):
                            image = f"/static/projects/{item}/{f}"
                            break

                projects.append({
                    "id": item,
                    "name": item.replace("-", " ").title(),
                    "description": f"Projeto de portfólio localizado em {item}.",
                    "tags": ["UX/UI", "Design"] if "uxui" in item else ["Web Dev", "Fullstack"],
                    "image": image,
                    "url": f"/static/projects/{item}/index.html"
                })
    return projects

def parse_proposals():
    if not os.path.exists(PROPOSALS_FILE):
        return []
    
    with open(PROPOSALS_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Simple regex to find sections like "## Proposta X"
    sections = re.split(r"---", content)
    proposals = []
    
    for section in sections:
        match = re.search(r"## (.*?)\n\*\*Status\*\*: (.*?)\n\*\*Plataformas\*\*: (.*?)\n\*\*Foco\*\*: (.*?)\n\*\*Valor Estimado\*\*: (.*?)\n\n>(.*)", section, re.DOTALL)
        if match:
            title = match.group(1).strip()
            status = match.group(2).strip()
            platforms = match.group(3).strip()
            focus = match.group(4).strip()
            budget = match.group(5).strip()
            text = match.group(6).strip().replace("> ", "").replace(">", "")
            
            proposals.append({
                "title": title,
                "status": status,
                "platforms": platforms,
                "focus": focus,
                "budget": budget,
                "text": text
            })

    return proposals

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/static/projects/<path:path>")
def static_projects(path):
    # Security: Ensure we only serve from the intended portfolio folders
    return send_from_directory(PORTFOLIO_ROOT, path)

@app.route("/api/my_portfolio")
def api_projects():
    # Force reload projects on each call for now (due to cache/dev)
    return jsonify({"projects": get_portfolio_projects()})


@app.route("/api/jobs")
def api_jobs():
    return jsonify({"jobs": parse_proposals()})

@app.route("/chat", methods=["POST"])
def chat():
    # Lazy import to avoid hanging on start
    from orchestrator import orchestrator
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"response": "Mensagem vazia."})
    
    response = orchestrator(user_message)
    return jsonify({"response": response})

@app.route("/api/debug")
def api_debug():
    return jsonify({
        "cwd": os.getcwd(),
        "portfolio_root": PORTFOLIO_ROOT,
        "listdir": os.listdir(PORTFOLIO_ROOT) if os.path.exists(PORTFOLIO_ROOT) else "NOT_FOUND",
        "proposals_exists": os.path.exists(PROPOSALS_FILE)
    })

if __name__ == "__main__":

    app.run(debug=True, port=5000)