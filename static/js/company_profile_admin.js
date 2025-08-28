document.addEventListener('DOMContentLoaded', () => {
    // Obtenha o ID da empresa da URL (ou de um data attribute no HTML)
    const empresaId = window.location.pathname.split('/').pop(); // Ex: /admin/empresa/123 -> 123
    const empresaEmail = document.querySelector('.profile-contact-info span').textContent.trim(); // Pega o email da empresa exibido

    // Elementos do botão de apagar empresa
    const deleteCompanyBtn = document.getElementById('deleteCompanyBtn');

    // Elementos do popover de e-mail individual
    const openIndividualEmailModalBtn = document.getElementById('openIndividualEmailModalBtn');
    const individualEmailModal = document.getElementById('individualEmailModal');
    const closeIndividualEmailModalBtn = document.getElementById('closeIndividualEmailModalBtn');
    const cancelIndividualEmailSendBtn = document.getElementById('cancelIndividualEmailSendBtn');
    const individualEmailForm = document.getElementById('individualEmailForm');
    const individualEmailSubjectInput = document.getElementById('individualEmailSubject');
    const individualEmailBodyTextarea = document.getElementById('individualEmailBody');
    const individualEmailMessageDiv = document.getElementById('individualEmailMessage');
    const sendIndividualEmailBtn = document.getElementById('sendIndividualEmailBtn');
    const sendIndividualEmailBtnText = document.getElementById('sendIndividualEmailBtnText');
    const sendIndividualEmailBtnSpinner = document.getElementById('sendIndividualEmailBtnSpinner');

    // --- Lógica para APAGAR EMPRESA ---
    if (deleteCompanyBtn) {
        deleteCompanyBtn.addEventListener('click', async () => {
            const confirmDelete = confirm(`Tem certeza que deseja apagar a conta da empresa "${document.querySelector('.profile-name').textContent}"? Esta ação é irreversível e enviará um e-mail de notificação.`);
            
            if (confirmDelete) {
                // Desabilitar o botão e mostrar um feedback visual
                deleteCompanyBtn.disabled = true;
                deleteCompanyBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Apagando...';
                
                try {
                    const response = await fetch(`/admin/empresa/delete/${empresaId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // Se estiver usando CSRF tokens, inclua aqui
                        }
                    });
                    const result = await response.json();

                    if (result.success) {
                        alert(result.message);
                        // Redirecionar para a lista de empresas cadastradas ou dashboard
                        window.location.href = '/empresas_cadastradas'; // Ajuste esta rota
                    } else {
                        alert(`Erro: ${result.message}`);
                        // Reabilitar o botão em caso de erro
                        deleteCompanyBtn.disabled = false;
                        deleteCompanyBtn.innerHTML = '<i class="fas fa-trash-alt mr-2"></i> Apagar Conta da Empresa';
                    }
                } catch (error) {
                    console.error('Erro ao apagar a empresa:', error);
                    alert('Ocorreu um erro ao apagar a empresa. Tente novamente.');
                    deleteCompanyBtn.disabled = false;
                    deleteCompanyBtn.innerHTML = '<i class="fas fa-trash-alt mr-2"></i> Apagar Conta da Empresa';
                }
            }
        });
    }

    // --- Lógica para ENVIAR E-MAIL INDIVIDUAL ---

    // Função para abrir o popover de e-mail individual
    function openIndividualEmailPopover() {
        if (individualEmailModal) {
            individualEmailModal.classList.remove('hidden');
            individualEmailSubjectInput.value = ''; // Limpa o campo de assunto
            individualEmailBodyTextarea.value = ''; // Limpa o campo de corpo
            individualEmailMessageDiv.textContent = ''; // Limpa mensagens de feedback
            individualEmailMessageDiv.className = 'mt-3 text-center text-sm font-medium'; // Reseta classes
            sendIndividualEmailBtn.disabled = false; // Habilita o botão
            sendIndividualEmailBtnText.textContent = 'Enviar E-mail'; // Reseta texto do botão
            sendIndividualEmailBtnSpinner.classList.add('hidden'); // Esconde spinner
        }
    }

    // Função para fechar o popover de e-mail individual
    function closeIndividualEmailPopover() {
        if (individualEmailModal) {
            individualEmailModal.classList.add('hidden');
        }
    }

    if (openIndividualEmailModalBtn) {
        openIndividualEmailModalBtn.addEventListener('click', openIndividualEmailPopover);
    }
    if (closeIndividualEmailModalBtn) {
        closeIndividualEmailModalBtn.addEventListener('click', closeIndividualEmailPopover);
    }
    if (cancelIndividualEmailSendBtn) {
        cancelIndividualEmailSendBtn.addEventListener('click', closeIndividualEmailPopover);
    }

    // Fechar popover ao clicar fora dele
    document.addEventListener('click', (event) => {
        if (individualEmailModal && !individualEmailModal.contains(event.target) && !openIndividualEmailModalBtn.contains(event.target)) {
            if (!individualEmailModal.classList.contains('hidden')) {
                closeIndividualEmailPopover();
            }
        }
    });

    if (individualEmailForm) {
        individualEmailForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const subject = individualEmailSubjectInput.value.trim();
            const body = individualEmailBodyTextarea.value.trim();

            if (!subject || !body) {
                individualEmailMessageDiv.textContent = 'Assunto e corpo do e-mail são obrigatórios.';
                individualEmailMessageDiv.className = 'mt-3 text-center text-sm font-medium text-red-600';
                return;
            }

            // Desabilitar botão e mostrar spinner
            sendIndividualEmailBtn.disabled = true;
            sendIndividualEmailBtnText.textContent = 'Enviando...';
            sendIndividualEmailBtnSpinner.classList.remove('hidden');
            individualEmailMessageDiv.textContent = '';

            try {
                const response = await fetch(`/admin/send_company_email/${empresaId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Se estiver usando CSRF tokens, inclua aqui
                    },
                    body: JSON.stringify({ subject, body })
                });

                const result = await response.json();

                if (result.success) {
                    individualEmailMessageDiv.textContent = result.message;
                    individualEmailMessageDiv.className = 'mt-3 text-center text-sm font-medium text-green-600';
                    setTimeout(closeIndividualEmailPopover, 3000); // Fecha após 3 segundos
                } else {
                    individualEmailMessageDiv.textContent = result.message || 'Erro ao enviar e-mail.';
                    individualEmailMessageDiv.className = 'mt-3 text-center text-sm font-medium text-red-600';
                }
            } catch (error) {
                console.error('Erro ao enviar e-mail individual:', error);
                individualEmailMessageDiv.textContent = 'Erro de conexão ou servidor.';
                individualEmailMessageDiv.className = 'mt-3 text-center text-sm font-medium text-red-600';
            } finally {
                sendIndividualEmailBtn.disabled = false;
                sendIndividualEmailBtnText.textContent = 'Enviar E-mail';
                sendIndividualEmailBtnSpinner.classList.add('hidden');
            }
        });
    }
});