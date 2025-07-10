// Contact page specific functionality
const contactInfo = [
    {
        icon: 'fas fa-phone',
        title: 'Telefone',
        details: ['(11) 99999-9999', '(11) 3333-4444'],
        color: 'blue',
    },
    {
        icon: 'fas fa-envelope',
        title: 'Email',
        details: ['contato@techhub.com', 'vendas@techhub.com'],
        color: 'purple',
    },
    {
        icon: 'fas fa-map-marker-alt',
        title: 'Endereço',
        details: ['Tech Park, 2000', 'São Paulo, SP - 01234-567'],
        color: 'emerald',
    },
    {
        icon: 'fas fa-clock',
        title: 'Horário',
        details: ['Segunda à Sexta: 9h às 18h', 'Sábado: 9h às 12h'],
        color: 'orange',
    },
];

const faqItems = [
    {
        question: 'Qual o prazo médio dos projetos?',
        answer: 'Varia de 2 semanas a 6 meses, dependendo da complexidade e escopo do projeto.',
    },
    {
        question: 'Oferecem suporte pós-entrega?',
        answer: 'Sim, oferecemos suporte e manutenção contínua para todos os nossos projetos.',
    },
    {
        question: 'Trabalham com metodologias ágeis?',
        answer: 'Utilizamos Scrum e Kanban para garantir entregas rápidas e qualidade.',
    },
];

document.addEventListener('DOMContentLoaded', function() {
    renderContactInfo();
    renderFAQ();
    setupContactForm();
});

function renderContactInfo() {
    const contactInfoGrid = document.getElementById('contactInfoGrid');
    if (!contactInfoGrid) return;

    contactInfoGrid.innerHTML = contactInfo.map(info => `
        <div class="contact-info-card ${info.color}">
            <div class="contact-info-icon">
                <i class="${info.icon}"></i>
            </div>
            <h3 class="contact-info-title">${info.title}</h3>
            <div class="contact-info-details">
                ${info.details.map(detail => `<p>${detail}</p>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderFAQ() {
    const faqList = document.getElementById('faqList');
    if (!faqList) return;

    faqList.innerHTML = faqItems.map(item => `
        <div class="faq-item">
            <h4 class="faq-question">${item.question}</h4>
            <p class="faq-answer">${item.answer}</p>
        </div>
    `).join('');
}

function setupContactForm() {
    // Account type change handler
    const accountTypeOptions = document.querySelectorAll('input[name="accountType"]');
    const companyField = document.querySelector('.company-field');
    const nameLabel = document.getElementById('nameLabel');

    accountTypeOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'company') {
                companyField.classList.remove('hidden');
                nameLabel.textContent = 'do Responsável';
            } else {
                companyField.classList.add('hidden');
                nameLabel.textContent = 'Completo';
            }
        });
    });
}

function handleContactForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        accountType: formData.get('accountType'),
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
    };

    // Simulate form submission
    const submitBtn = e.target.querySelector('.form-submit');
    const originalHTML = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        e.target.reset();
        
        // Reset form state
        document.querySelector('.company-field').classList.add('hidden');
        document.getElementById('nameLabel').textContent = 'Completo';
        document.querySelectorAll('.account-type-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector('.account-type-option').classList.add('active');
        
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
    }, 1500);
}