// js/common.js (VERSÃO FINAL COM LOGIN CORRIGIDO)

document.addEventListener('DOMContentLoaded', () => {
    updateHeaderBasedOnLogin();

    // Fecha o modal de login se clicar fora dele
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.addEventListener('click', function(event) {
            if (event.target === loginModal) closeLoginModal();
        });
    }

    // Lógica para ativar a opção de tipo de conta selecionada
    const accountTypeOptions = document.querySelectorAll('.account-type-option');
    accountTypeOptions.forEach(option => {
        option.addEventListener('click', () => {
            accountTypeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // Fecha o dropdown do usuário se clicar fora dele
    document.addEventListener('click', function(event) {
        const userMenu = document.querySelector('.user-menu');
        const dropdown = document.querySelector('.user-dropdown');

        if (userMenu && !userMenu.contains(event.target)) {
            if (dropdown && !dropdown.classList.contains('hidden')) {
                dropdown.classList.add('hidden');
                dropdown.classList.remove('active');
            }
        }
    });
});

/**
 * Verifica se há um usuário na sessão e atualiza o cabeçalho.
 */
function updateHeaderBasedOnLogin() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    const navRight = document.querySelector('.nav-right .auth-section');

    if (user && navRight) {
        // Gera o menu do usuário logado
        const userMenuHTML = `
            <div class="user-menu">
                <button class="user-menu-button">
                    <div class="user-avatar">${user.initials || user.name.charAt(0).toUpperCase()}</div>
                    <span class="user-name">${user.name}</span>
                </button>
                <div class="user-dropdown hidden">
                    <div class="dropdown-header">
                        <div class="dropdown-avatar">${user.initials || user.name.charAt(0).toUpperCase()}</div>
                        <div class="dropdown-info">
                            <div class="dropdown-name">${user.name}</div>
                            <div class="dropdown-email">${user.email}</div>
                        </div>
                    </div>
                    <div class="dropdown-menu">
                        <a href="profile.html" class="dropdown-item"><i class="fas fa-user-circle"></i> Meu Perfil</a>
                        <div class="dropdown-item logout" onclick="handleLogout()">
                            <i class="fas fa-sign-out-alt"></i> Sair
                        </div>
                    </div>
                </div>
            </div>
        `;
        navRight.innerHTML = userMenuHTML;
        
        const userMenuButton = navRight.querySelector('.user-menu-button');
        const userDropdown = navRight.querySelector('.user-dropdown');
        if (userMenuButton && userDropdown) {
            userMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
                userDropdown.classList.toggle('active');
            });
        }
    }
}

/**
 * Processa o logout do usuário.
 */
function handleLogout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

/**
 * >>> NOVA FUNÇÃO DE LOGIN CORRIGIDA <<<
 * Processa o login do usuário buscando na lista de usuários cadastrados.
 */
function handleLogin(event) {
    event.preventDefault(); 
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password'); // Agora pegamos a senha também

    // 1. Busca a lista de todos os usuários cadastrados no localStorage
    const allUsers = JSON.parse(localStorage.getItem('techhub_users')) || [];

    // 2. Procura um usuário com o email e senha correspondentes
    const foundUser = allUsers.find(user => user.email === email && user.password === password);

    // 3. Verifica se o usuário foi encontrado
    if (foundUser) {
        // Se encontrou, salva o OBJETO INTEIRO (com ID, nome, etc.) na sessão
        sessionStorage.setItem('currentUser', JSON.stringify(foundUser));
        window.location.href = 'profile.html'; // Redireciona para o perfil
    } else {
        // Se não encontrou, mostra um erro
        alert('Email ou senha incorretos. Por favor, tente novamente.');
    }
}


// --- Funções Auxiliares (Modal, Menu Mobile, etc.) ---

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    mobileNav.classList.toggle('hidden');

    mobileMenuIcon.classList.toggle('fa-bars');
    mobileMenuIcon.classList.toggle('fa-times');
}

function openLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) loginModal.classList.remove('hidden');
}

function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) loginModal.classList.add('hidden');
}

function togglePassword(button) {
    const input = button.previousElementSibling;
    const icon = button.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}