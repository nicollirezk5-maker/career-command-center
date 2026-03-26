from job_agent import job_agent

task = "Encontre vagas de UX/UI Designer remoto e escreva uma proposta"
print("Iniciando busca de vagas...")
result = job_agent(task)
print("\n--- RESULTADO DO AGENTE ---\n")
print(result)
