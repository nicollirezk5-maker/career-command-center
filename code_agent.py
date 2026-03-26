def generate_app_code(app_name):

    code = f"""
import React from "react";

export default function App() {{
  return (
    <div style={{
      padding: 40, 
      fontFamily: "Outfit, sans-serif", 
      backgroundColor: "#0a0a0a", 
      color: "white", 
      minHeight: "100vh"
    }}>
      <header style={{textAlign: "center", marginBottom: 60}}>
        <h1 style={{fontSize: "3rem"}}>{app_name}</h1>
        <p style={{fontSize: "1.2rem", color: "#888"}}>Sua presença digital de alto nível.</p>
        <div style={{marginTop: 30}}>
        </div>
      </header>

      <section style={{maxWidth: 800, margin: "0 auto"}}>
        <h2>Sobre Mim</h2>
        <p>Especialista em criar experiências digitais memoráveis.</p>
        
        <h2>Projetos</h2>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20}}>
            <div style={{padding: 20, backgroundColor: "#1a1a1a", borderRadius: 12}}>Projeto 1</div>
            <div style={{padding: 20, backgroundColor: "#1a1a1a", borderRadius: 12}}>Projeto 2</div>
        </div>
      </section>
    </div>
  );
}}
"""

    return code