document.addEventListener('DOMContentLoaded', () => {
    // --- NOVO CÓDIGO PARA GERENCIAR CATEGORIAS ---
    const addCategoryForm = document.getElementById('addCategoryForm');
    const categoryNameInput = document.getElementById('categoryName');
    const addCategoryMessage = document.getElementById('addCategoryMessage');

    // Função para carregar categorias existentes
    async function loadExistingCategories() {
        const categoryListElement = document.getElementById('existingCategoriesList');
        if (!categoryListElement) return;

        try {
            categoryListElement.innerHTML = '<p class="text-center text-gray-500">Carregando categorias...</p>';
            
            const response = await fetch('/api/categorias');
            if (!response.ok) throw new Error('Falha na resposta da rede');
            const categories = await response.json();
            
            if (categories.length === 0) {
                categoryListElement.innerHTML = '<p class="text-center text-gray-500">Nenhuma categoria cadastrada ainda.</p>';
                return;
            }
            
            let html = '<ul class="space-y-2">';
            categories.forEach(category => {
                html += `
                    <li class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span class="text-gray-800">${category.name}</span>
                        <button 
                            onclick="deleteCategory(${category.id})" 
                            class="delete-btn px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded-md transition-colors"
                        >
                            <i class="fas fa-trash-alt mr-1"></i> Remover
                        </button>
                    </li>
                `;
            });
            html += '</ul>';
            
            categoryListElement.innerHTML = html;
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            categoryListElement.innerHTML = '<p class="text-center text-red-500">Erro ao carregar categorias. Tente recarregar a página.</p>';
        }
    }

    // Função para adicionar nova categoria
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const categoryName = categoryNameInput.value.trim();
            
            if (!categoryName) {
                addCategoryMessage.textContent = 'Por favor, insira um nome para a categoria.';
                addCategoryMessage.className = 'text-red-500 text-sm mt-2 text-center';
                return;
            }
            
            try {
                const response = await fetch('/api/categorias', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: categoryName })
                });

                if (!response.ok) {
                    throw new Error('Erro ao adicionar categoria');
                }

                const newCategory = await response.json();
                addCategoryMessage.textContent = `Categoria "${newCategory.name}" adicionada com sucesso!`;
                addCategoryMessage.className = 'text-green-500 text-sm mt-2 text-center';
                categoryNameInput.value = '';
                loadExistingCategories(); // Recarrega a lista
            } catch (error) {
                console.error('Erro ao adicionar categoria:', error);
                addCategoryMessage.textContent = 'Erro ao adicionar categoria. Tente novamente.';
                addCategoryMessage.className = 'text-red-500 text-sm mt-2 text-center';
            }
        });
    }

    // Função para deletar categoria (anexada ao objeto window para ser acessível pelo onclick)
    window.deleteCategory = async function(categoryId) {
        if (!confirm('Tem certeza que deseja remover esta categoria?')) return;
        
        try {
            const response = await fetch(`/api/categorias/${categoryId}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Erro ao remover categoria');
            }
            loadExistingCategories(); // Recarrega a lista
            // Usar uma mensagem não bloqueante em vez de alert
            addCategoryMessage.textContent = 'Categoria removida com sucesso!';
            addCategoryMessage.className = 'text-green-500 text-sm mt-2 text-center';
        } catch (error) {
            console.error('Erro ao remover categoria:', error);
            addCategoryMessage.textContent = 'Erro ao remover categoria.';
            addCategoryMessage.className = 'text-red-500 text-sm mt-2 text-center';
        }
    };

    // --- FIM DO NOVO CÓDIGO ---


    // Carrega os dados do backend
    loadDashboardData();
    loadExistingCategories(); // Carregar categorias ao iniciar

    const emailModal = document.getElementById('emailModal');
    const openEmailModalBtn = document.getElementById('openEmailModalBtn');
    const closeEmailModalBtn = document.getElementById('closeEmailModalBtn');
    const cancelEmailSendBtn = document.getElementById('cancelEmailSendBtn');
    const bulkEmailForm = document.getElementById('bulkEmailForm');
    const emailSubjectInput = document.getElementById('emailSubject');
    const emailBodyTextarea = document.getElementById('emailBody');
    const emailMessageDiv = document.getElementById('emailMessage');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const sendEmailBtnText = document.getElementById('sendEmailBtnText');
    const sendEmailBtnSpinner = document.getElementById('sendEmailBtnSpinner');

    if (openEmailModalBtn) {
        openEmailModalBtn.addEventListener('click', () => emailModal.classList.remove('hidden'));
    }
    if (closeEmailModalBtn) {
        closeEmailModalBtn.addEventListener('click', () => emailModal.classList.add('hidden'));
    }
    if (cancelEmailSendBtn) {
        cancelEmailSendBtn.addEventListener('click', () => emailModal.classList.add('hidden'));
    }
    
    if (bulkEmailForm) {
        bulkEmailForm.addEventListener('submit', sendBulkEmail);
    }

    async function sendBulkEmail(event) {
        event.preventDefault();

        const subject = emailSubjectInput.value.trim();
        const body = emailBodyTextarea.value.trim();

        if (!subject || !body) {
            emailMessageDiv.textContent = 'Preencha assunto e corpo.';
            emailMessageDiv.className = 'text-center mb-4 text-red-600';
            return;
        }

        sendEmailBtn.disabled = true;
        sendEmailBtnText.textContent = 'Enviando...';
        sendEmailBtnSpinner.classList.remove('hidden');
        emailMessageDiv.textContent = '';

        try {
            const response = await fetch('/admin/send_bulk_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subject, body }),
            });

            const result = await response.json();

            if (result.success) {
                emailMessageDiv.textContent = result.message;
                emailMessageDiv.className = 'text-center mb-4 text-green-600';
                setTimeout(() => emailModal.classList.add('hidden'), 3000);
            } else {
                emailMessageDiv.textContent = result.message || 'Erro ao enviar e-mail.';
                emailMessageDiv.className = 'text-center mb-4 text-red-600';
            }
        } catch (error) {
            console.error('Erro ao enviar e-mail em massa:', error);
            emailMessageDiv.textContent = 'Erro de conexão ou servidor.';
            emailMessageDiv.className = 'text-center mb-4 text-red-600';
        } finally {
            sendEmailBtn.disabled = false;
            sendEmailBtnText.textContent = 'Enviar';
            sendEmailBtnSpinner.classList.add('hidden');
        }
    }
});

async function loadDashboardData() {
    try {
        const metricsResponse = await fetch('/api/dashboard/metrics');
        const metrics = await metricsResponse.json();
        renderDashboardMetrics(metrics);

        const budgetByCategoryResponse = await fetch('/api/dashboard/budget_by_category');
        const budgetByCategoryData = await budgetByCategoryResponse.json();
        renderBudgetByCategoryChart(budgetByCategoryData);

        const monthlyRegistrationsResponse = await fetch('/api/dashboard/monthly_registrations');
        const monthlyRegistrationsData = await monthlyRegistrationsResponse.json();
        renderMonthlyRegistrationsChart(monthlyRegistrationsData);

        const popularServicesResponse = await fetch('/api/dashboard/popular_services');
        const popularServicesData = await popularServicesResponse.json();
        renderPopularServicesTable(popularServicesData);

        const activeCompaniesResponse = await fetch('/api/dashboard/active_companies');
        const activeCompaniesData = await activeCompaniesResponse.json();
        renderActiveCompaniesTable(activeCompaniesData);

    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
    }
}

function renderDashboardMetrics(metrics) {
    const budgetRequestsCount = document.getElementById('budgetRequestsCount');
    const registeredCompaniesCount = document.getElementById('registeredCompaniesCount');
    const monthlyRegistrationsCount = document.getElementById('monthlyRegistrationsCount');
    const registeredServicesCount = document.getElementById('registeredServicesCount');

    if (budgetRequestsCount) budgetRequestsCount.textContent = metrics.total_budget_requests;
    if (registeredCompaniesCount) registeredCompaniesCount.textContent = metrics.total_companies;
    if (monthlyRegistrationsCount) monthlyRegistrationsCount.textContent = metrics.monthly_registrations;
    if (registeredServicesCount) registeredServicesCount.textContent = metrics.total_services;
}

function renderBudgetByCategoryChart(categoryCounts) {
    const ctx = document.getElementById('budgetByCategoryChart');
    if (!ctx) return;

    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);

    if (Chart.getChart(ctx)) {
        Chart.getChart(ctx).destroy();
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Número de Orçamentos',
                data: data,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)', 
                    'rgba(139, 92, 246, 0.7)', 
                    'rgba(16, 185, 129, 0.7)', 
                    'rgba(249, 115, 22, 0.7)', 
                    'rgba(239, 68, 68, 0.7)', 
                    'rgba(99, 102, 241, 0.7)', 
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(249, 115, 22, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(99, 102, 241, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderMonthlyRegistrationsChart(monthlyCounts) {
    const ctx = document.getElementById('monthlyRegistrationsChart');
    if (!ctx) return;

    const labels = Object.keys(monthlyCounts);
    const data = Object.values(monthlyCounts);

    if (Chart.getChart(ctx)) {
        Chart.getChart(ctx).destroy();
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Novos Cadastros',
                data: data,
                borderColor: 'rgba(139, 92, 246, 1)', // purple
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderPopularServicesTable(popularServices) {
    const tableBody = document.getElementById('popularServicesTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (popularServices.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-gray-500">Nenhum serviço popular encontrado.</td></tr>';
        return;
    }

    popularServices.forEach(service => {
        const row = `
            <tr>
                <td class="py-2 px-4 border-b text-gray-800">${service.nome_servico}</td>
                <td class="py-2 px-4 border-b text-gray-800">${service.nome_empresa}</td>
                <td class="py-2 px-4 border-b text-gray-800">${service.total_solicitacoes}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

function renderActiveCompaniesTable(activeCompanies) {
    const tableBody = document.getElementById('activeCompaniesTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (activeCompanies.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-gray-500">Nenhuma empresa ativa encontrada.</td></tr>';
        return;
    }

    activeCompanies.forEach(company => {
        const row = `
            <tr>
                <td class="py-2 px-4 border-b text-gray-800">${company.nome_empresa}</td>
                <td class="py-2 px-4 border-b text-gray-800">${company.email_corporativo}</td>
                <td class="py-2 px-4 border-b text-gray-800">${company.total_servicos_publicados}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}