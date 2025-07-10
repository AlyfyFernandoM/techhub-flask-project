// Global state
let currentUser = null;
let isAuthenticated = false;

// Demo users
const demoUsers = {
    'admin@techhub.com': {
        id: '1',
        name: 'Admin TechHUB',
        email: 'admin@techhub.com',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'admin',
        accountType: 'individual',
        createdAt: new Date().toISOString(),
    },
    'empresa@techhub.com': {
        id: '2',
        name: 'João Silva',
        email: 'empresa@techhub.com',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'user',
        accountType: 'company',
        company: {
            name: 'TechCorp Solutions',
            cnpj: '12.345.678/0001-90',
            size: 'medium',
            industry: 'Tecnologia',
        },
        createdAt: new Date().toISOString(),
    },
};

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeCommon();
    setupCommonEventListeners();
    checkAuthState();
});

function initializeCommon() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Set active navigation link based on current page
    setActiveNavLink();
}

function setupCommonEventListeners() {
    // Account type selectors in modals
    document.querySelectorAll('.account-type-option').forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Update visual state
            this.parentElement.querySelectorAll('.account-type-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Obrigado por se inscrever! Confirme sua inscrição em ${email}`);
            this.reset();
        });
    }
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Mobile menu functions
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    
    mobileNav.classList.toggle('hidden');
    
    if (mobileNav.classList.contains('hidden')) {
        mobileMenuIcon.className = 'fas fa-bars';
    } else {
        mobileMenuIcon.className = 'fas fa-times';
    }
}

// Modal functions
function openLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function openRegisterModal() {
    document.getElementById('registerModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

// Password toggle function
function togglePassword(button) {
    const input = button.parentElement.querySelector('input');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Auth functions
function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
        email: formData.get('email'),
        password: formData.get('password'),
        accountType: formData.get('accountType')
    };

    // Simulate loading
    const submitBtn = e.target.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    submitBtn.disabled = true;

    setTimeout(() => {
        const user = demoUsers[credentials.email];
        
        if (user && credentials.password === 'admin123' && user.accountType === credentials.accountType) {
            currentUser = user;
            isAuthenticated = true;
            localStorage.setItem('techhub_user', JSON.stringify(user));
            updateAuthUI();
            closeLoginModal();
            e.target.reset();
            alert('Login realizado com sucesso!');
        } else {
            alert('Email, senha ou tipo de conta inválidos');
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        accountType: formData.get('accountType')
    };

    // Simulate loading
    const submitBtn = e.target.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';
    submitBtn.disabled = true;

    setTimeout(() => {
        if (data.password !== data.confirmPassword) {
            alert('As senhas não coincidem');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        if (data.password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        const user = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            role: 'user',
            accountType: data.accountType,
            createdAt: new Date().toISOString(),
        };

        currentUser = user;
        isAuthenticated = true;
        localStorage.setItem('techhub_user', JSON.stringify(user));
        updateAuthUI();
        closeRegisterModal();
        e.target.reset();
        alert('Conta criada com sucesso!');
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

function logout() {
    currentUser = null;
    isAuthenticated = false;
    localStorage.removeItem('techhub_user');
    updateAuthUI();
    alert('Logout realizado com sucesso!');
}

function checkAuthState() {
    const savedUser = localStorage.getItem('techhub_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            isAuthenticated = true;
            updateAuthUI();
        } catch (error) {
            localStorage.removeItem('techhub_user');
        }
    }
}

function updateAuthUI() {
    const authSection = document.querySelector('.auth-section');
    const mobileAuth = document.querySelector('.mobile-auth');
    
    if (!authSection || !mobileAuth) return;
    
    if (isAuthenticated && currentUser) {
        // Update desktop auth section
        authSection.innerHTML = `
            <div class="user-menu" onclick="toggleUserMenu()">
                <div class="user-avatar">
                    ${currentUser.avatar 
                        ? `<img src="${currentUser.avatar}" alt="${currentUser.name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">` 
                        : '<i class="fas fa-user"></i>'
                    }
                </div>
                <div class="user-info">
                    <div class="user-name">${currentUser.name}</div>
                    ${currentUser.accountType === 'company' && currentUser.company 
                        ? `<div class="user-company">${currentUser.company.name}</div>` 
                        : ''
                    }
                </div>
                <i class="fas fa-chevron-down"></i>
                <div class="user-dropdown hidden" id="userDropdown">
                    <div class="dropdown-header">
                        <div class="dropdown-avatar">
                            ${currentUser.avatar 
                                ? `<img src="${currentUser.avatar}" alt="${currentUser.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` 
                                : '<i class="fas fa-user"></i>'
                            }
                        </div>
                        <div class="dropdown-info">
                            <div class="dropdown-name">${currentUser.name}</div>
                            <div class="dropdown-email">${currentUser.email}</div>
                            ${currentUser.accountType === 'company' && currentUser.company 
                                ? `<div class="dropdown-company"><i class="fas fa-building"></i> ${currentUser.company.name}</div>` 
                                : ''
                            }
                        </div>
                        <div class="account-badge ${currentUser.accountType}">
                            ${currentUser.accountType === 'company' ? 'Conta Empresarial' : 'Conta Individual'}
                        </div>
                    </div>
                    <div class="dropdown-menu">
                        <a href="#" class="dropdown-item">
                            <i class="fas fa-user"></i>
                            <span>Meu Perfil</span>
                        </a>
                        <a href="#" class="dropdown-item">
                            <i class="fas fa-cog"></i>
                            <span>Configurações</span>
                        </a>
                        ${currentUser.accountType === 'company' 
                            ? `<a href="#" class="dropdown-item">
                                <i class="fas fa-building"></i>
                                <span>Painel Empresarial</span>
                            </a>` 
                            : ''
                        }
                        <hr>
                        <a href="#" class="dropdown-item logout" onclick="logout()">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Sair</span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Update mobile auth section
        mobileAuth.innerHTML = `
            <div class="mobile-user-info">
                <div class="mobile-user-avatar">
                    ${currentUser.avatar 
                        ? `<img src="${currentUser.avatar}" alt="${currentUser.name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">` 
                        : '<i class="fas fa-user"></i>'
                    }
                </div>
                <div class="mobile-user-details">
                    <div class="mobile-user-name">${currentUser.name}</div>
                    <div class="mobile-user-email">${currentUser.email}</div>
                </div>
            </div>
            <button class="mobile-logout-btn" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i>
                <span>Sair</span>
            </button>
        `;
    } else {
        // Reset to login button
        authSection.innerHTML = `
            <button class="login-btn" onclick="openLoginModal()">
                <i class="fas fa-sign-in-alt"></i>
                <span>Entrar</span>
            </button>
        `;

        mobileAuth.innerHTML = `
            <button class="mobile-login-btn" onclick="openLoginModal()">Entrar</button>
            <div class="mobile-contact">
                <div class="mobile-contact-item">
                    <i class="fas fa-phone"></i>
                    <span>(11) 99999-9999</span>
                </div>
                <div class="mobile-contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>contato@techhub.com</span>
                </div>
            </div>
        `;
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

// Close user menu when clicking outside
document.addEventListener('click', function(e) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && dropdown && !userMenu.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

// Close mobile menu when clicking on links
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('mobile-nav-link')) {
        const mobileNav = document.getElementById('mobileNav');
        const mobileMenuIcon = document.getElementById('mobileMenuIcon');
        
        if (mobileNav && mobileMenuIcon) {
            mobileNav.classList.add('hidden');
            mobileMenuIcon.className = 'fas fa-bars';
        }
    }
});

// Close modals when clicking outside
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
});

// Escape key to close modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = 'auto';
    }
});

// Newsletter handler
function handleNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    alert(`Obrigado por se inscrever! Confirme sua inscrição em ${email}`);
    e.target.reset();
}