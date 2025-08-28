document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('companySearch');
    const companiesGrid = document.getElementById('companiesGrid');
    const companyCards = companiesGrid ? Array.from(companiesGrid.getElementsByClassName('company-card')) : [];

    if (searchInput && companiesGrid && companyCards.length > 0) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = searchInput.value.toLowerCase();

            companyCards.forEach(card => {
                const companyName = card.querySelector('.company-name').textContent.toLowerCase();

                if (companyName.includes(searchTerm)) {
                    card.style.display = 'flex'; // Mostra o cartão
                } else {
                    card.style.display = 'none'; // Esconde o cartão
                }
            });
        });
    } else {
        console.warn('Elementos para busca de empresas não encontrados ou não há empresas para pesquisar.');
    }
});