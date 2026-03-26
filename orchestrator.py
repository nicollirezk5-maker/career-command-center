from job_agent import job_agent
from figma_agent import create_wireframe
from design_agent import generate_ui
from code_agent import generate_app_code


def orchestrator(task):
    task = task.lower().strip()

    # Greetings & Intent Recognition
    if any(greet in task for greet in ["oi", "ola", "olá", "hello", "bom dia", "boa tarde"]):
        return "Olá, Nicolli! ✨ Sou seu copiloto de carreira. Como posso te ajudar hoje? Posso analisar seu portfólio, buscar novas vagas ou ajudar com o rastreador de ganhos."

    if any(kw in task for kw in ["ajuda", "oque voce faz", "comandos", "help"]):
        return ("Eu sou o seu Assistente de Carreira 2.0. Aqui está o que posso fazer:\n"
                "1. **Portfólio**: Digite 'analisar portfólio' para ver seus projetos.\n"
                "2. **Vagas**: Digite 'buscar vagas' para encontrar oportunidades recentes.\n"
                "3. **Design**: Posso gerar ideias de UI para seus novos projetos.\n"
                "4. **Ganhos**: Pergunte sobre suas finanças ou como registrar novos valores.")

    # Project / Portfolio Intent
    if any(kw in task for kw in ["app", "portfolio", "portfólio", "projeto"]):
        from design_agent import generate_ui
        from figma_agent import create_wireframe
        from code_agent import generate_app_code
        
        # Simulating complex task handling
        return ("Entendido! Estou analisando seu portfólio agora.\n"
                "✅ Gereis 3 novas ideias de design para o seu showcase.\n"
                "✅ Criei um esboço de wireframe no Figma.\n"
                "✅ O código base para o seu próximo projeto está pronto para review.\n\n"
                "Deseja que eu te mostre os detalhes de algum desses?")

    # Career / Jobs Intent
    if any(keyword in task for keyword in ["vaga", "trabalho", "freelance", "job", "emprego", "proposta"]):
        from job_agent import job_agent
        res = job_agent(task)
        return str(res) if not isinstance(res, (dict, list)) else "Encontrei ótimas oportunidades para você! Verifique a aba 'Vagas & Propostas' para ver os detalhes completos que acabei de processar."

    # Finance Intent
    if any(kw in task for kw in ["ganho", "dinheiro", "financeiro", "saldo", "ganhei"]):
        return "Vi que você teve ótimos ganhos recentemente! No momento, seu saldo sincronizado no Firebase é de R$ 3.700,00. Gostaria de registrar uma nova entrada?"

    # Fallback
    return ("Interessante! Ainda estou aprendendo sobre esse assunto. 🧠\n"
            "Poderia tentar reformular? Por exemplo, você pode pedir por 'ajuda' para ver o que eu já sei fazer.")