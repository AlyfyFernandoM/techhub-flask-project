// About page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Renderiza as novas seções da ASSESPRO-SP
    renderStats();
    renderEssence();
    renderPillars();

    // Renderiza as seções de Equipe e Depoimentos que foram mantidas
    renderTeam();
    renderTestimonials();
});

// --- DADOS DA ASSESPRO-SP (DAS IMAGENS) ---
const stats = [
    { icon: 'fas fa-building', value: '+2.500', label: 'Empresas Associadas' },
    { icon: 'fas fa-globe-americas', value: '+20', label: 'Estados' },
    { icon: 'fas fa-star', value: '+48', label: 'Anos de Atuação' },
    { icon: 'fas fa-handshake', value: '100+', label: 'Parceiros Estratégicos' }
];

const essence = [
    {
        icon: 'fas fa-sitemap',
        title: 'Representatividade Nacional',
        description: 'Presença em 20 estados e mais de 2.500 empresas associadas.'
    },
    {
        icon: 'fas fa-lightbulb',
        title: 'Inovação e Conhecimento',
        description: 'Eventos que promovem inovação e fortalecem os negócios.'
    },
    {
        icon: 'fas fa-rocket',
        title: 'Fortalecimento do Setor',
        description: 'Apoio estratégico para startups, MEI, PME e grandes empresas de tecnologia.'
    },
    {
        icon: 'fas fa-globe',
        title: 'Conexão Global',
        description: 'Representação do Brasil em entidades internacionais como Aleti e WITSA.'
    }
];

const pillars = [
    {
        icon: 'fas fa-bullseye',
        title: 'Propósito',
        description: 'Promover o desenvolvimento da sociedade por meio da aplicação de inovação e tecnologia.'
    },
    {
        icon: 'fas fa-tasks',
        title: 'Missão',
        description: 'Representar e fomentar os interesses coletivos das empresas associadas na construção de uma sociedade fortalecida pela TI.'
    },
    {
        icon: 'fas fa-eye',
        title: 'Visão',
        description: 'Trabalhar para que o setor de TI seja o principal vetor de desenvolvimento nacional.'
    }
];


// --- DADOS ORIGINAIS DE EQUIPE E DEPOIMENTOS (MANTIDOS) ---
const team = [
    {
        name: 'Alyfy Fernando',
        role: 'Estagiario',
        image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'PhD em Analise e Desenvolvimento de Sistemas',
    },
    {
        name: 'Eduardo Caippes',
        role: 'CTO',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Especialista em IA e arquitetura de sistemas distribuídos',
    },
    {
        name: 'Bruna Gonçalves',
        role: 'Head of Engineering',
        image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Expert em desenvolvimento full-stack e DevOps',
    },
    {
        name: 'Geovanna Ferreira',
        role: 'Head of Design',
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Design thinking e experiência do usuário',
    },
    {
        name: 'Luis Yerco',
        role: 'Estagiario',
        image: 'https://static.vecteezy.com/ti/vetor-gratis/p1/9292244-default-avatar-icon-vector-of-social-media-user-vetor.jpg',
        bio: 'Banco de Dados'
    }, 
    {
        name: 'Paulo Miguel',
        role: 'Estagiario',
        image: 'https://static.vecteezy.com/ti/vetor-gratis/p1/9292244-default-avatar-icon-vector-of-social-media-user-vetor.jpg',
        bio: 'Expert em desenvolvimento full-stack e DevOps'
    }
];

const testimonials = [
    {
        name: 'Carlos Mendes',
        role: 'CTO, StartupTech',
        content: 'A ASSESPRO-SP foi fundamental para conectarmos com novos mercados. Um apoio que realmente funciona!',
        rating: 5,
        image: 'https://img.freepik.com/fotos-gratis/jovem-barbudo-com-camisa-listrada_273609-5677.jpg?semt=ais_hybrid&w=740',
    },
    {
        name: 'Ana Rodriguez',
        role: 'Head of Engineering, DevCorp',
        content: 'Expertise e representatividade incomparáveis. A federação domina as pautas mais relevantes para o setor de tecnologia.',
        rating: 5,
        image: 'https://t4.ftcdn.net/jpg/05/54/32/25/360_F_554322527_L4qTbf9iGZFdxaokxfm6KoQClwfmUBSq.jpg',
    },
    {
        name: 'Roberto Silva',
        role: 'Tech Lead, InnovateLab',
        content: 'Transformação real para o ecossistema. A ASSESPRO-SP entrega iniciativas que realmente impactam o negócio das associadas.',
        rating: 5,
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
];


// --- FUNÇÕES DE RENDERIZAÇÃO ---

function renderStats() {
    const statsContainer = document.getElementById('aboutStats');
    if (!statsContainer) return;

    statsContainer.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <div class="stat-icon">
                <i class="${stat.icon}"></i>
            </div>
            <div class="stat-value">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
}

function renderEssence() {
    const essenceContainer = document.getElementById('essenceGrid');
    if (!essenceContainer) return;

    essenceContainer.innerHTML = essence.map(item => `
        <div class="service-card">
             <div class="service-icon">
                <i class="${item.icon}"></i>
            </div>
            <h3 class="service-title">${item.title}</h3>
            <p class="service-description">${item.description}</p>
        </div>
    `).join('');
}

function renderPillars() {
    const pillarsContainer = document.getElementById('pillarsGrid');
    if (!pillarsContainer) return;

    pillarsContainer.innerHTML = pillars.map(pillar => `
         <div class="service-card">
             <div class="service-icon">
                <i class="${pillar.icon}"></i>
            </div>
            <h3 class="service-title">${pillar.title}</h3>
            <p class="service-description">${pillar.description}</p>
        </div>
    `).join('');
}

function renderTeam() {
    const teamContainer = document.getElementById('teamGrid');
    if (!teamContainer) return;

    teamContainer.innerHTML = team.map(member => `
        <div class="team-member">
            <div class="team-member-image">
                <img src="${member.image}" alt="${member.name}">
                <div class="team-member-overlay"></div>
            </div>
            <div class="team-member-info">
                <h3 class="team-member-name">${member.name}</h3>
                <p class="team-member-role">${member.role}</p>
                <p class="team-member-bio">${member.bio}</p>
            </div>
        </div>
    `).join('');
}

function renderTestimonials() {
    const testimonialsContainer = document.getElementById('testimonialsGrid');
    if (!testimonialsContainer) return;

    testimonialsContainer.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card">
            <div class="testimonial-quote">
                <i class="fas fa-quote-left"></i>
                <p>"${testimonial.content}"</p>
            </div>
            
            <div class="testimonial-rating">
                ${Array(testimonial.rating).fill('<i class="fas fa-star"></i>').join('')}
            </div>
            
            <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.name}">
                <div class="author-info">
                    <div class="author-name">${testimonial.name}</div>
                    <div class="author-role">${testimonial.role}</div>
                </div>
            </div>
        </div>
    `).join('');
}