// Home page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    generateTechGrid();
    renderFeaturedProducts();
});

function generateTechGrid() {
    const techGrid = document.querySelector('.tech-grid');
    if (!techGrid) return;
    
    for (let i = 0; i < 144; i++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'tech-grid-item';
        gridItem.style.animationDelay = `${i * 0.1}s`;
        techGrid.appendChild(gridItem);
    }
}

function renderFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;

    const featuredProducts = [
        {
            id: 1,
            name: 'AI Analytics Platform',
            category: 'ai',
            price: 'R$ 899,90',
            image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
            rating: 4.8,
            description: 'Plataforma de análise inteligente com IA avançada',
            tech: ['Python', 'TensorFlow', 'React'],
        },
        {
            id: 2,
            name: 'Progressive Web App',
            category: 'web',
            price: 'R$ 599,90',
            image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
            rating: 4.9,
            description: 'Aplicação web progressiva de alta performance',
            tech: ['React', 'TypeScript', 'PWA'],
        },
        {
            id: 5,
            name: 'Cybersecurity Suite',
            category: 'security',
            price: 'R$ 1599,90',
            image: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
            rating: 4.9,
            description: 'Suite completa de segurança cibernética',
            tech: ['Blockchain', 'Encryption', 'AI Security'],
        },
    ];

    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="featured-product-card">
            <div class="featured-product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="featured-badge">⭐ Destaque</div>
            </div>
            <div class="featured-product-content">
                <h3 class="featured-product-title">${product.name}</h3>
                <p class="featured-product-description">${product.description}</p>
                <div class="featured-product-tech">
                    ${product.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="featured-product-footer">
                    <span class="featured-product-price">${product.price}</span>
                    <a href="produtos.html" class="featured-product-btn">
                        <span>Ver Detalhes</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}