// Services page specific functionality
const services = [
    {
        icon: 'fas fa-brain',
        title: 'Inteligência Artificial',
        description: 'Soluções de IA e Machine Learning para automatizar e otimizar processos empresariais',
        features: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Análise Preditiva'],
        price: 'A partir de R$ 5.000',
        color: 'blue',
        duration: '2-4 meses',
        team: '3-5 especialistas',
    },
    {
        icon: 'fas fa-globe',
        title: 'Desenvolvimento Web',
        description: 'Aplicações web modernas e responsivas com tecnologias de ponta e performance otimizada',
        features: ['React/Vue/Angular', 'Node.js', 'Progressive Web Apps', 'API REST', 'Microserviços'],
        price: 'A partir de R$ 3.000',
        color: 'purple',
        duration: '1-3 meses',
        team: '2-4 desenvolvedores',
    },
    {
        icon: 'fas fa-mobile-alt',
        title: 'Desenvolvimento Mobile',
        description: 'Apps nativos e híbridos para iOS e Android com performance superior e UX excepcional',
        features: ['React Native', 'Flutter', 'Swift/Kotlin', 'Cross-platform', 'App Store Deploy'],
        price: 'A partir de R$ 4.000',
        color: 'emerald',
        duration: '2-4 meses',
        team: '2-3 desenvolvedores',
    },
    {
        icon: 'fas fa-shield-alt',
        title: 'Cybersecurity',
        description: 'Proteção avançada contra ameaças digitais e implementação de segurança robusta',
        features: ['Penetration Testing', 'Blockchain Security', 'Encryption', 'Monitoring', 'Compliance'],
        price: 'A partir de R$ 6.000',
        color: 'red',
        duration: '1-2 meses',
        team: '2-3 especialistas',
    },
    {
        icon: 'fas fa-palette',
        title: 'UX/UI Design',
        description: 'Design de experiência centrado no usuário com interfaces modernas e intuitivas',
        features: ['Design System', 'Prototipagem', 'User Research', 'Usability Testing', 'Branding'],
        price: 'A partir de R$ 2.500',
        color: 'orange',
        duration: '3-6 semanas',
        team: '1-2 designers',
    },
    {
        icon: 'fas fa-code',
        title: 'DevOps & Cloud',
        description: 'Infraestrutura escalável e automação de deploy na nuvem com monitoramento avançado',
        features: ['CI/CD', 'Docker/Kubernetes', 'AWS/Azure', 'Monitoring', 'Auto-scaling'],
        price: 'A partir de R$ 4.500',
        color: 'indigo',
        duration: '2-3 meses',
        team: '2-3 engenheiros',
    },
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
            <div class="service-meta">
                <div class="service-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${service.duration}</span>
                </div>
                <div class="service-meta-item">
                    <i class="fas fa-users"></i>
                    <span>${service.team}</span>
                </div>
            </div>
            <div class="service-footer">
                <span class="service-price">${service.price}</span>
                <a href="contato.html" class="service-link">
                    <span>Saiba mais</span>
                    <i class="fas fa-arrow-right"></i>
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