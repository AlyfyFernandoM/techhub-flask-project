const services = [
    {
        icon: 'fas fa-brain',
        title: 'Inteligência Artificial',
        description: 'Soluções de IA e Machine Learning para automatizar e otimizar processos empresariais',
        features: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Análise Preditiva'],
        color: 'blue',
        category_slug: 'IA & Machine Learning' 
    },
    {
        icon: 'fas fa-globe',
        title: 'Desenvolvimento Web',
        description: 'Aplicações web modernas e responsivas com tecnologias de ponta e performance otimizada',
        features: ['React/Vue/Angular', 'Node.js', 'Progressive Web Apps', 'API REST', 'Microserviços'],
        color: 'purple',
        category_slug: 'Desenvolvimento Web' 
    },
    {
        icon: 'fas fa-mobile-alt',
        title: 'Desenvolvimento Mobile',
        description: 'Apps nativos e híbridos para iOS e Android com performance superior e UX excepcional',
        features: ['React Native', 'Flutter', 'Swift/Kotlin', 'Cross-platform', 'App Store Deploy'],
        color: 'emerald',
        category_slug: 'Apps Mobile' 
    },
    {
        icon: 'fas fa-shield-alt',
        title: 'Cybersecurity',
        description: 'Proteção avançada contra ameaças digitais e implementação de segurança robusta',
        features: ['Penetration Testing', 'Blockchain Security', 'Encryption', 'Monitoring', 'Compliance'],
        color: 'red',
        category_slug: 'Cybersecurity' 
    },
    {
        icon: 'fas fa-palette',
        title: 'UX/UI Design',
        description: 'Design de experiência centrado no usuário com interfaces modernas e intuitivas',
        features: ['Design System', 'Prototipagem', 'User Research', 'Usability Testing', 'Branding'],
        color: 'orange',
        category_slug: 'Design & UX' 
    },
    {
        icon: 'fas fa-code',
        title: 'DevOps & Cloud',
        description: 'Infraestrutura escalável e automação de deploy na nuvem com monitoramento avançado',
        features: ['CI/CD', 'Docker/Kubernetes', 'AWS/Azure', 'Monitoring', 'Auto-scaling'],
        color: 'indigo',
        category_slug: 'DevOps & Cloud' 
    },
    {
        icon: 'fas fa-file-alt', 
        title: 'Desenvolvimento de Portfólio',
        description: 'Crie um portfólio digital impactante que destaque suas melhores obras e habilidades.',
        features: ['Design Personalizado', 'Otimização SEO', 'Responsividade', 'Integração Social'],
        color: 'green',
        category_slug: 'Desenvolvimento de Portfólio'
    },
    {
        icon: 'fas fa-bullseye',
        title: 'Desenvolvimento de Landing Page',
        description: 'Crie páginas de destino de alta conversão, focadas em um objetivo específico.',
        features: ['Design Otimizado', 'Conteúdo Persuasivo', 'Otimização de Velocidade', 'Testes A/B'],
        color: 'pink',
        category_slug: 'Desenvolvimento de Landing Page'
    }
];

const processSteps = [
    {
        step: '01',
        title: 'Análise & Planejamento',
        description: 'Entendemos suas necessidades e definimos a estratégia tecnológica ideal',
    },
    {
        step: '02',
        title: 'Design & Prototipagem',
        description: 'Criamos protótipos e validamos a solução antes do desenvolvimento',
    },
    {
        step: '03',
        title: 'Desenvolvimento',
        description: 'Implementamos a solução usando metodologias ágeis e melhores práticas',
    },
    {
        step: '04',
        title: 'Testes & Deploy',
        description: 'Realizamos testes rigorosos e fazemos o deploy em produção',
    },
    {
        step: '05',
        title: 'Suporte & Manutenção',
        description: 'Oferecemos suporte contínuo e atualizações para manter tudo funcionando',
    },
];

document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    renderProcess();
});

function renderServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-icon ${service.color}">
                <i class="${service.icon}"></i>
            </div>
            <h3 class="service-title">${service.title}</h3>
            <p class="service-description">${service.description}</p>
            <div class="service-features">
                ${service.features.map(feature => `
                    <div class="service-feature">
                        <i class="fas fa-check-circle"></i>
                        <span>${feature}</span>
                    </div>
                `).join('')}
            </div>
            <div class="service-footer service-buttons">
                <a href="/servicos_por_categoria?category=${encodeURIComponent(service.category_slug)}" class="btn-contract-service">
                    Contratar Serviço
                </a>
                
                <!-- CORREÇÃO AQUI: O href deve apontar para a rota GET que exibe o formulário -->
                <a href="/solicitar_orcamento?category=${encodeURIComponent(service.category_slug)}" class="btn-contract-company">
                    Contratar Empresa
                </a>
            </div>
        </div>
    `).join('');
}

function renderProcess() {
    const processGrid = document.getElementById('processGrid');
    if (!processGrid) return;

    processGrid.innerHTML = processSteps.map((step, index) => `
        <div class="process-step">
            <div class="process-number">
                <span>${step.step}</span>
                ${index < processSteps.length - 1 ? '<div class="process-line"></div>' : ''}
            </div>
            <div class="process-content">
                <h3 class="process-title">${step.title}</h3>
                <p class="process-description">${step.description}</p>
            </div>
        </div>
    `).join('');
}

// Funções do Modal 
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    mobileNav.classList.toggle('hidden');
    mobileMenuIcon.classList.toggle('fa-bars');
    mobileMenuIcon.classList.toggle('fa-times');
}

function openLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('registerModal').classList.add('hidden'); 
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
}

function openRegisterModal() {
    document.getElementById('registerModal').classList.remove('hidden');
    document.getElementById('loginModal').classList.add('hidden'); 
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.add('hidden');
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

function handleLogin(event) {
    event.preventDefault();
    alert('Função de login não implementada. Credenciais de demonstração: admin@techhub.com / admin123 ou empresa@techhub.com / admin123');
    closeLoginModal();
}

function handleRegister(event) {
    event.preventDefault();
    alert('Função de registro não implementada.');
    closeRegisterModal();
}

function togglePassword(button) {
    const passwordInput = button.previousElementSibling;
    const icon = button.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function handleNewsletter(event) {
    event.preventDefault();
    alert('Assinatura da newsletter não implementada!');
}

