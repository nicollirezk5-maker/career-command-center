import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, onSnapshot, query, addDoc, serverTimestamp, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzXy2oqlrzIbqqmHANk9jho_UDGKEYJbQ",
  authDomain: "carrer-6c985.firebaseapp.com",
  projectId: "carrer-6c985",
  storageBucket: "carrer-6c985.firebasestorage.app",
  messagingSenderId: "668557103693",
  appId: "1:668557103693:web:234418979d14902c6ec204",
  measurementId: "G-62ZG4ZKZ0P"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Simple auth for testing
signInAnonymously(auth).catch(err => console.error("Firebase Auth Error:", err));

document.addEventListener('DOMContentLoaded', () => {

    const navItems = document.querySelectorAll('.sidebar nav li');
    const contentArea = document.getElementById('content-area');
    const syncBtn = document.getElementById('btn-sync');

    // Routing
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            loadSection(item.dataset.section);
        });
    });

    // Interactivity: Background Parallax
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.querySelectorAll('.bg-blob').forEach((blob, index) => {
            const speed = (index + 1) * 20;
            blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

    async function loadSection(section) {
        contentArea.innerHTML = '<div class="loading">Carregando...</div>';
        contentArea.classList.remove('content-fade');
        
        setTimeout(async () => {
            contentArea.classList.add('content-fade');
            switch(section) {
                case 'overview':
                    renderOverview();
                    break;
                case 'portfolio':
                    renderPortfolio();
                    break;
                case 'jobs':
                    renderJobs();
                    break;
                case 'agent':
                    renderAgent();
                    break;
            }
        }, 100);
    }

    // Initial Load
    loadSection('overview');

    async function renderOverview() {
        contentArea.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Projetos Ativos</h3>
                    <p class="value" id="count-projects">...</p>
                    <p class="trend up">Portfólio detectado</p>
                </div>
                <div class="stat-card">
                    <h3>Modelos de Proposta</h3>
                    <p class="value" id="count-jobs">...</p>
                    <p class="trend up">Otimizadas pela IA</p>
                </div>
                <div class="stat-card">
                    <h3>Total Ganhos (Mês)</h3>
                    <p class="value" id="total-ganhos">R$ 0,00</p>
                    <p class="trend up" style="color: #00ff88;">Sincronizado via Firebase</p>
                </div>
            </div>
            
            <div class="dashboard-split" style="display: grid; grid-template-columns: 1fr 400px; gap: 2rem;">
                <div class="card-section">
                    <div class="section-title">
                        <h2>Destaques do Portfólio</h2>
                    </div>
                    <div class="project-grid" id="featured-projects"></div>
                </div>

                <div class="card-section finance-section">
                    <div class="section-title">
                        <h2>Rastreador de Ganhos 💰</h2>
                    </div>
                    <div class="stat-card finance-input-card">
                        <input type="text" id="income-project" placeholder="Nome do Projeto (ex: Logo Food)">
                        <input type="number" id="income-value" placeholder="Valor (R$)">
                        <button class="btn-primary" id="btn-add-income" style="width: 100%; margin-top: 10px;">Registrar Ganho</button>
                    </div>
                    <div id="finance-list" class="finance-list">
                        <div class="loading">Carregando finanças...</div>
                    </div>
                </div>
            </div>
        `;
        
        const projects = await fetchProjects('featured-projects', 3);
        document.getElementById('count-projects').innerText = projects.length;
        
        const jobsResponse = await fetch('/api/jobs');
        const jobsData = await jobsResponse.json();
        document.getElementById('count-jobs').innerText = jobsData.jobs.length;

        // GitHub Sync
        try {
            const githubResponse = await fetch('/api/github');
            const githubData = await githubResponse.json();
            if (githubData.user && githubData.user.login) {
                // Add GitHub Stat if we want, or just show it in the split
                const featuredProjects = document.getElementById('featured-projects');
                const githubCard = document.createElement('div');
                githubCard.className = 'project-card content-fade github-profile-card';
                githubCard.innerHTML = `
                    <div class="project-info" style="padding: 2rem;">
                        <img src="${githubData.user.avatar_url}" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 1rem;">
                        <h4>GitHub: ${githubData.user.login}</h4>
                        <p>${githubData.user.public_repos} repositórios públicos detectados.</p>
                        <button class="btn-primary-outline" style="margin-top: 1rem;" onclick="window.open('${githubData.user.html_url}', '_blank')">Ver Perfil</button>
                    </div>
                `;
                featuredProjects.prepend(githubCard);
            }
        } catch (e) {
            console.error("GitHub Error:", e);
        }

        // Firebase Sync: Ganhos
        const q = query(collection(db, "ganhos"), orderBy("timestamp", "desc"));
        const financeList = document.getElementById('finance-list');
        const totalGanhosLabel = document.getElementById('total-ganhos');

        onSnapshot(q, (snapshot) => {
            let total = 0;
            if (snapshot.empty) {
                financeList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); margin-top: 1rem;">Nenhum ganho registrado.</p>';
                totalGanhosLabel.innerText = "R$ 0,00";
                return;
            }
            
            financeList.innerHTML = snapshot.docs.map(doc => {
                const data = doc.data();
                const val = parseFloat(data.value || 0);
                total += val;
                return `
                    <div class="finance-card content-fade">
                        <div class="finance-info">
                            <strong>${data.project}</strong>
                            <span>${new Date(data.timestamp?.toDate()).toLocaleDateString() || 'Recent'}</span>
                        </div>
                        <div class="finance-value">+ R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    </div>
                `;
            }).join('');
            
            totalGanhosLabel.innerText = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        });

        // Add Income Handler
        const addBtn = document.getElementById('btn-add-income');
        const projectInput = document.getElementById('income-project');
        const valueInput = document.getElementById('income-value');

        addBtn.onclick = async () => {
            const project = projectInput.value.trim();
            const value = valueInput.value.trim();
            
            if (!project || !value) return;
            
            addBtn.disabled = true;
            addBtn.innerText = "Registrando...";
            
            try {
                await addDoc(collection(db, "ganhos"), {
                    project: project,
                    value: parseFloat(value),
                    timestamp: serverTimestamp()
                });
                projectInput.value = "";
                valueInput.value = "";
            } catch (err) {
                alert("Erro ao salvar: " + err.message);
            } finally {
                addBtn.disabled = false;
                addBtn.innerText = "Registrar Ganho";
            }
        };
    }




    async function fetchProjects(containerId, limit = null) {
              try {
            const response = await fetch('/api/my_portfolio');

            const data = await response.json();
            const projects = data.projects;
            
            const container = document.getElementById(containerId);
            if (!container) return projects;
            
            let displayProjects = limit ? projects.slice(0, limit) : projects;
            
            container.innerHTML = displayProjects.map((p, index) => `
                <div class="project-card content-fade" style="animation-delay: ${index * 0.1}s" onclick="window.open('${p.url || '#'}', '_blank')">
                    <div class="project-img">
                        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : '<div class="project-img-placeholder"></div>'}
                    </div>
                    <div class="project-info">
                        <h4>${p.name}</h4>
                        <p>${p.description}</p>
                        <div class="tags">
                            ${p.tags ? p.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                        </div>
                    </div>
                </div>
            `).join('');
            
            return projects;
        } catch (err) {
            console.error(`Erro ao carregar projetos (${containerId}):`, err);
            return [];
        }
    }




    // Interactive Effects: 3D Tilt
    window.handleTilt = (e, card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    window.resetTilt = (card) => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    async function renderPortfolio() {
        contentArea.innerHTML = `
            <div class="section-title">
                <h2>Todos os Projetos</h2>
            </div>
            <div class="project-grid" id="full-portfolio"></div>
        `;
        fetchProjects('full-portfolio');
    }

    async function renderJobs() {
        contentArea.innerHTML = `
            <div class="section-title">
                <h2>Modelos de Proposta (minhas_propostas.md)</h2>
            </div>
            <div class="jobs-list" id="jobs-list"></div>
        `;
        
        let proposalsCache = [];

        try {
            const response = await fetch('/api/jobs');
            const data = await response.json();
            proposalsCache = data.jobs;
            const container = document.getElementById('jobs-list');
            
            container.innerHTML = proposalsCache.map((j, index) => `
                <div class="stat-card proposal-card content-fade">
                    <div class="proposal-header">
                        <div class="proposal-info-main">
                            <h3 class="proposal-title">${j.title}</h3>
                            <span class="status-badge ${j.status.toLowerCase().includes('ativa') ? 'active' : j.status.toLowerCase().includes('negociação') ? 'pending' : 'done'}">
                                ${j.status}
                            </span>
                        </div>
                        <div class="budget-tag">${j.budget}</div>
                    </div>
                    
                    <p class="proposal-meta">
                        <strong>Plataformas:</strong> ${j.platforms} | <strong>Foco:</strong> ${j.focus}
                    </p>
                    
                    <div class="proposal-preview">
                        "${j.text.substring(0, 160)}..."
                    </div>
                    
                    <div class="proposal-actions">
                        <button class="btn-primary-outline" onclick="window.open('https://www.linkedin.com', '_blank')">Ver Vaga</button>
                        <button class="btn-primary" onclick="copyProposal(${index})">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            Copiar Proposta
                        </button>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error("Erro ao carregar propostas:", error);
            container.innerHTML = `<p>Erro ao carregar propostas. Verifique o console.</p>`;
        }

        window.copyProposal = (index) => {
            const text = proposalsCache[index].text;
            navigator.clipboard.writeText(text);
            alert('Proposta copiada para o clipboard!');
        };
    }


    function renderAgent() {
        contentArea.innerHTML = `
            <div class="chat-wrapper">
                <div id="chat-output" class="chat-messages">
                    <div class="welcome-screen content-fade">
                        <div class="ai-avatar chat-avatar" style="width: 64px; height: 64px; font-size: 1.5rem; margin-bottom: 1.5rem;">AI</div>
                        <h2>Como posso ajudar, Nicolli?</h2>
                        <p>Diga-me o que você precisa: otimizar uma proposta, buscar vagas ou apenas organizar suas ideias de design.</p>
                    </div>
                </div>
                <div class="chat-input-area">
                    <div class="chat-input-container">
                        <textarea id="chat-input" placeholder="Envie uma mensagem para o Assistente Nicolli..." rows="1"></textarea>
                        <button id="send-btn" class="send-button" disabled>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                    <p class="chat-disclaimer">O Assistente Nicolli 2.0 pode cometer erros em informações críticas.</p>
                </div>
            </div>
        `;
        
        const sendBtn = document.getElementById('send-btn');
        const chatInput = document.getElementById('chat-input');
        const chatOutput = document.getElementById('chat-output');

        // Auto-resize textarea
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto';
            chatInput.style.height = (chatInput.scrollHeight) + 'px';
            sendBtn.disabled = chatInput.value.trim() === '';
        });

        const appendMessage = (text, role) => {
            const isUser = role === 'user';
            const row = document.createElement('div');
            row.className = `message-row ${isUser ? 'user-row' : 'ai-row'} content-fade`;
            
            row.innerHTML = `
                <div class="chat-avatar">${isUser ? 'NR' : 'AI'}</div>
                <div class="chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}">
                    ${text}
                </div>
            `;
            
            // Remove welcome screen if first message
            const welcome = chatOutput.querySelector('.welcome-screen');
            if (welcome) welcome.remove();
            
            chatOutput.appendChild(row);
            chatOutput.scrollTop = chatOutput.scrollHeight;
            return row.querySelector('.chat-bubble');
        };

        const sendMessage = async () => {
            const msg = chatInput.value.trim();
            if (!msg) return;

            appendMessage(msg, 'user');
            chatInput.value = '';
            chatInput.style.height = 'auto';
            sendBtn.disabled = true;

            try {
                // Temporary thinking bubble
                const responseBubble = appendMessage('Digitando...', 'ai');
                
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: msg })
                });
                const data = await response.json();
                
                // Typing Effect
                responseBubble.innerHTML = '';
                let i = 0;
                const text = data.response;
                const type = () => {
                    if (i < text.length) {
                        responseBubble.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
                        i++;
                        chatOutput.scrollTop = chatOutput.scrollHeight;
                        setTimeout(type, 15);
                    }
                };
                type();
            } catch (error) {
                appendMessage('Desculpe, tive um erro ao processar. Tente novamente.', 'ai');
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    syncBtn.addEventListener('click', () => {
        loadSection('overview');
    });
});

