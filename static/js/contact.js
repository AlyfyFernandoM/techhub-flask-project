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

const faqData = [ // Renomeado para faqData para evitar conflito com faqItems no renderFAQ
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
    // Adicione as FAQs da sua versão anterior, se desejar
    {
        question: "Como funciona o processo de solicitação de orçamento?",
        answer: "Você preenche o formulário detalhando seu projeto, seleciona as categorias ou empresas de interesse, e nós enviamos sua solicitação para as empresas relevantes. Elas entrarão em contato diretamente com você para apresentar propostas."
    },
    {
        question: "Posso solicitar orçamento para mais de um tipo de serviço?",
        answer: "Sim, no campo 'Descrição Detalhada do Projeto', você pode descrever todas as suas necessidades. Você também pode selecionar múltiplas categorias de serviços ou escolher 'Outro' para nos dar mais detalhes."
    },
    {
        question: "As empresas respondem diretamente para mim?",
        answer: "Sim, as empresas receberão seus detalhes de contato e entrarão em contato diretamente para discutir sua solicitação e enviar as propostas."
    },
    {
        question: "Existe algum custo para solicitar um orçamento?",
        answer: "Não, o serviço de solicitação de orçamento através do TechHUB é totalmente gratuito para você. Nosso objetivo é conectar você às melhores soluções."
    }
];

document.addEventListener('DOMContentLoaded', function() {
    renderContactInfo();
    renderFAQ(); // Chamada para renderizar o FAQ
    setupDynamicCompanyLoading(); // Nova função para a lógica de carregamento de empresas
    setupMobileMenu(); // Setup para o menu mobile
});

function renderContactInfo() {
    const contactInfoGrid = document.getElementById('contactInfoGrid');
    if (!contactInfoGrid) {
        console.warn("Elemento com ID 'contactInfoGrid' não encontrado. A seção de informações de contato não será renderizada.");
        return;
    }

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
    if (!faqList) {
        console.warn("Elemento com ID 'faqList' não encontrado. A seção de FAQ não será renderizada.");
        return;
    }

    faqList.innerHTML = ''; // Limpa qualquer conteúdo existente

    faqData.forEach((item, index) => { // Usando faqData
        const faqItem = document.createElement('div');
        faqItem.classList.add('faq-item');
        faqItem.innerHTML = `
            <div class="faq-question">
                <h4>${item.question}</h4>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
                <p>${item.answer}</p>
            </div>
        `;
        faqList.appendChild(faqItem);

        // Adiciona o evento de clique para expandir/colapsar
        const questionElement = faqItem.querySelector('.faq-question');
        questionElement.addEventListener('click', () => {
            faqItem.classList.toggle('active'); // Adiciona/remove a classe 'active'
            const icon = questionElement.querySelector('i');
            if (faqItem.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
}

function setupDynamicCompanyLoading() {
    const categorySelect = document.getElementById('category_name');
    const companiesSelect = document.getElementById('selected_companies');

    if (!categorySelect || !companiesSelect) {
        console.warn("Elementos 'category_name' ou 'selected_companies' não encontrados. A funcionalidade de carregamento dinâmico de empresas não será ativada.");
        return;
    }

    // Função para carregar empresas com base na categoria
    async function loadCompaniesByCategory(category) {
        companiesSelect.innerHTML = ''; // Limpa as opções atuais

        const loadingOption = document.createElement('option');
        loadingOption.textContent = 'Carregando empresas...';
        loadingOption.value = '';
        loadingOption.disabled = true;
        loadingOption.selected = true;
        companiesSelect.appendChild(loadingOption);

        let fetchUrl = `/api/empresas-por-categoria?category=${encodeURIComponent(category)}`;
        if (category === 'Outro') {
            fetchUrl = `/api/todas-empresas`; // API para todas as empresas se a categoria for "Outro"
        }

        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            companiesSelect.innerHTML = ''; // Limpa novamente após receber os dados
            if (data.empresas && data.empresas.length > 0) {
                data.empresas.forEach(empresa => {
                    const option = document.createElement('option');
                    option.value = empresa.id;
                    option.textContent = empresa.nome_empresa;
                    companiesSelect.appendChild(option);
                });
            } else {
                const noCompaniesOption = document.createElement('option');
                noCompaniesOption.textContent = 'Nenhuma empresa encontrada para esta categoria.';
                noCompaniesOption.value = '';
                noCompaniesOption.disabled = true;
                companiesSelect.appendChild(noCompaniesOption);
            }
        } catch (error) {
            console.error('Erro ao buscar empresas:', error);
            companiesSelect.innerHTML = '';
            const errorOption = document.createElement('option');
            errorOption.textContent = 'Erro ao carregar empresas.';
            errorOption.value = '';
            errorOption.disabled = true;
            companiesSelect.appendChild(errorOption);
        }
    }

    // Listener para o evento de mudança na seleção de categoria
    categorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        if (selectedCategory) {
            loadCompaniesByCategory(selectedCategory);
        } else {
            companiesSelect.innerHTML = '<option value="">Selecione uma categoria primeiro</option>';
        }
    });

    // Carregar empresas na inicialização se uma categoria já estiver selecionada
    // Isso é útil se a página for carregada com um parâmetro de categoria na URL
    if (categorySelect.value) {
        loadCompaniesByCategory(categorySelect.value);
    }
}

// Funções do Menu Mobile (se estiver neste arquivo)
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');

    if (mobileMenuBtn && mobileNav && mobileMenuIcon) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('hidden');
            if (mobileNav.classList.contains('hidden')) {
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
            } else {
                mobileMenuIcon.classList.remove('fa-bars');
                mobileMenuIcon.classList.add('fa-times');
            }
        });
    } else {
        console.warn("Elementos do menu mobile não encontrados. A funcionalidade do menu mobile pode não funcionar.");
    }
}

// Funções de Modal (Login/Registro) - Mantenha-as se estiverem em uso no seu HTML
function openLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    if (loginModal) {
        loginModal.classList.remove('hidden');
    }
    if (registerModal) {
        registerModal.classList.add('hidden'); 
    }
}

function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.add('hidden');
    }
}

function openRegisterModal() {
    const registerModal = document.getElementById('registerModal');
    const loginModal = document.getElementById('loginModal');
    if (registerModal) {
        registerModal.classList.remove('hidden');
    }
    if (loginModal) {
        loginModal.classList.add('hidden'); 
    }
}

function closeRegisterModal() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.classList.add('hidden');
    }
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

// Funções de simulação (handleLogin, handleRegister, handleNewsletter, togglePassword)
// Estas funções ainda contêm 'alert()' e simulações.
// Recomendo substituí-las por lógica real de submissão de formulário ou modais personalizados.
function handleLogin(event) {
    event.preventDefault();
    console.log('Função de login não implementada. Credenciais de demonstração: admin@techhub.com / admin123 ou empresa@techhub.com / admin123');
    // Substitua o alert por um modal customizado ou feedback na UI
    // alert('Função de login não implementada. Credenciais de demonstração: admin@techhub.com / admin123 ou empresa@techhub.com / admin123');
    closeLoginModal();
}

function handleRegister(event) {
    event.preventDefault();
    console.log('Função de registro não implementada.');
    // Substitua o alert por um modal customizado ou feedback na UI
    // alert('Função de registro não implementada.');
    closeRegisterModal();
}

function togglePassword(button) {
    if (!button) {
        console.error("Botão de togglePassword não encontrado.");
        return;
    }
    const passwordInput = button.previousElementSibling;
    const icon = button.querySelector('i');
    if (passwordInput && icon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    } else {
        console.error("Input de senha ou ícone não encontrados para togglePassword.");
    }
}

function handleNewsletter(event) {
    event.preventDefault();
    console.log('Assinatura da newsletter não implementada!');
}