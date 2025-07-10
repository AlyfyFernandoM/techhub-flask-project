// Products page specific functionality
const products = [
    {
        id: 1,
        name: 'AI Analytics Platform',
        category: 'ai',
        price: 'R$ 899,90',
        image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.8,
        description: 'Plataforma de análise inteligente com IA avançada para insights em tempo real',
        featured: true,
        tech: ['Python', 'TensorFlow', 'React'],
    },
    {
        id: 2,
        name: 'Progressive Web App',
        category: 'web',
        price: 'R$ 599,90',
        image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.9,
        description: 'Aplicação web progressiva de alta performance com experiência nativa',
        featured: true,
        tech: ['React', 'TypeScript', 'PWA'],
    },
    {
        id: 3,
        name: 'Native Mobile App',
        category: 'mobile',
        price: 'R$ 1299,90',
        image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.7,
        description: 'App nativo multiplataforma de última geração com performance otimizada',
        featured: false,
        tech: ['React Native', 'Node.js', 'MongoDB'],
    },
    {
        id: 4,
        name: 'Design System Pro',
        category: 'design',
        price: 'R$ 449,90',
        image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.6,
        description: 'Sistema de design completo e escalável para equipes modernas',
        featured: false,
        tech: ['Figma', 'Storybook', 'CSS-in-JS'],
    },
    {
        id: 5,
        name: 'Cybersecurity Suite',
        category: 'security',
        price: 'R$ 1599,90',
        image: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.9,
        description: 'Suite completa de segurança cibernética com proteção avançada',
        featured: true,
        tech: ['Blockchain', 'Encryption', 'AI Security'],
    },
    {
        id: 6,
        name: 'Smart Dashboard',
        category: 'ai',
        price: 'R$ 699,90',
        image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.8,
        description: 'Dashboard inteligente com insights em tempo real e visualizações avançadas',
        featured: false,
        tech: ['Vue.js', 'D3.js', 'Machine Learning'],
    },
    {
        id: 7,
        name: 'E-commerce Platform',
        category: 'web',
        price: 'R$ 999,90',
        image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.7,
        description: 'Plataforma de e-commerce completa com recursos avançados',
        featured: false,
        tech: ['Next.js', 'Stripe', 'PostgreSQL'],
    },
    {
        id: 8,
        name: 'IoT Management System',
        category: 'ai',
        price: 'R$ 1899,90',
        image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.9,
        description: 'Sistema de gerenciamento IoT com IA para automação inteligente',
        featured: true,
        tech: ['Python', 'MQTT', 'TensorFlow'],
    },
];

let currentFilter = 'all';
let displayedProducts = 6;

document.addEventListener('DOMContentLoaded', function() {
    setupProductFilters();
    renderProducts();
    checkURLParams();
});

function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProducts(category);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        filterProducts(category);
        
        // Update active filter button
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
    }
}

function renderProducts(category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const filteredProducts = category === 'all' 
        ? products.slice(0, displayedProducts)
        : products.filter(product => product.category === category).slice(0, displayedProducts);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.featured ? '<div class="product-featured">⭐ Destaque</div>' : ''}
                <div class="product-favorite">
                    <i class="fas fa-heart"></i>
                </div>
            </div>
            <div class="product-content">
                <div class="product-header">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating}</span>
                    </div>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-tech">
                    ${product.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="product-footer">
                    <span class="product-price">${product.price}</span>
                    <div class="product-actions">
                        <button class="product-action secondary" onclick="viewProduct(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="product-action primary" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Update load more button visibility
    updateLoadMoreButton(category);
}

function filterProducts(category) {
    currentFilter = category;
    displayedProducts = 6; // Reset displayed count
    renderProducts(category);
}

function loadMoreProducts() {
    displayedProducts += 6;
    renderProducts(currentFilter);
}

function updateLoadMoreButton(category) {
    const loadMoreSection = document.querySelector('.load-more');
    if (!loadMoreSection) return;

    const totalProducts = category === 'all' 
        ? products.length 
        : products.filter(product => product.category === category).length;

    if (displayedProducts >= totalProducts) {
        loadMoreSection.style.display = 'none';
    } else {
        loadMoreSection.style.display = 'block';
    }
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`Visualizando: ${product.name}\n\n${product.description}`);
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`${product.name} adicionado ao carrinho!`);
    }
}