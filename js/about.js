// About page specific functionality
const stats = [
    { icon: 'fas fa-users', value: '500+', label: 'Clientes Atendidos' },
    { icon: 'fas fa-award', value: '150+', label: 'Projetos Concluídos' },
    { icon: 'fas fa-chart-line', value: '98%', label: 'Taxa de Satisfação' },
    { icon: 'fas fa-star', value: '15+', label: 'Anos de Experiência' },
];

const values = [
    {
        icon: 'fas fa-microchip',
        title: 'Inovação Tecnológica',
        description: 'Utilizamos as mais avançadas tecnologias e frameworks para criar soluções de ponta.',
    },
    {
        icon: 'fas fa-code',
        title: 'Código de Qualidade',
        description: 'Desenvolvemos com as melhores práticas, testes automatizados e arquitetura escalável.',
    },
    {
        icon: 'fas fa-bolt',
        title: 'Performance',
        description: 'Otimização constante para entregar soluções rápidas, eficientes e confiáveis.',
    },
];

const timeline = [
    {
        year: '2009',
        title: 'Fundação',
        description: 'Início da jornada com foco em desenvolvimento web',
    },
    {
        year: '2012',
        title: 'Expansão Mobile',
        description: 'Entrada no mercado de aplicativos móveis',
    },
    {
        year: '2016',
        title: 'Era da IA',
        description: 'Especialização em inteligência artificial e machine learning',
    },
    {
        year: '2020',
        title: 'Cloud & DevOps',
        description: 'Foco em soluções cloud e automação',
    },
    {
        year: '2024',
        title: 'techHUB 2.0',
        description: 'Plataforma integrada de tecnologias emergentes',
    },
];

const team = [
    {
        name: 'Dr. Marcus Silva',
        role: 'CEO & Founder',
        image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'PhD em Ciência da Computação, 20+ anos em tecnologia',
    },
    {
        name: 'Ana Costa',
        role: 'CTO',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Especialista em IA e arquitetura de sistemas distribuídos',
    },
    {
        name: 'Carlos Mendes',
        role: 'Head of Engineering',
        image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Expert em desenvolvimento full-stack e DevOps',
    },
    {
        name: 'Lucia Santos',
        role: 'Head of Design',
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Design thinking e experiência do usuário',
    },
];

const testimonials = [
    {
        name: 'Carlos Mendes',
        role: 'CTO, StartupTech',
        content: 'O techHUB revolucionou nossa infraestrutura tecnológica. Soluções de IA que realmente funcionam!',
        rating: 5,
        image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
        name: 'Ana Rodriguez',
        role: 'Head of Engineering, DevCorp',
        content: 'Expertise técnica incomparável. O time do techHUB domina as tecnologias mais avançadas do mercado.',
        rating: 5,
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
        name: 'Roberto Silva',
        role: 'Tech Lead, InnovateLab',
        content: 'Transformação digital real. O techHUB entrega soluções que realmente impactam o negócio.',
        rating: 5,
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
];

document.addEventListener('DOMContentLoaded', function() {
    renderValues();
    renderStats();
    renderTimeline();
    renderTeam();
    renderTestimonials();
});

function renderValues() {
    const valuesContainer = document.getElementById('aboutValues');
    if (!valuesContainer) return;

    valuesContainer.innerHTML = values.map(value => `
        <div class="value-item">
            <div class="value-icon">
                <i class="${value.icon}"></i>
            </div>
            <div class="value-content">
                <h4 class="value-title">${value.title}</h4>
                <p class="value-description">${value.description}</p>
            </div>
        </div>
    `).join('');
}

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

function renderTimeline() {
    const timelineContainer = document.getElementById('timeline');
    if (!timelineContainer) return;

    timelineContainer.innerHTML = `
        <div class="timeline-line"></div>
        ${timeline.map((item, index) => `
            <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
                <div class="timeline-content">
                    <div class="timeline-year">${item.year}</div>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-description">${item.description}</p>
                </div>
                <div class="timeline-dot"></div>
            </div>
        `).join('')}
    `;
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