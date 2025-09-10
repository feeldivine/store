document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT SELECTORS ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const searchIcon = document.getElementById('search-icon');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.getElementById('close-search');
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const profileIcon = document.getElementById('profile-icon');
    const profileDropdown = document.getElementById('profile-dropdown');
    const addToCartButtons = document.querySelectorAll('.product-card .btn');
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const newsletterForm = document.querySelector('.newsletter-form');
    const searchForm = document.querySelector('.search-overlay-content');
    const categoryCards = document.querySelectorAll('.category-card');
    const images = document.querySelectorAll('img');

    // --- STATE ---
    let cart = [];

    // --- FUNCTIONS ---

    // Mobile Navigation Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // Search Overlay Functionality
    if (searchIcon && searchOverlay && closeSearch) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.style.display = 'flex';
            const searchInput = searchOverlay.querySelector('input');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        });

        const closeSearchOverlay = () => searchOverlay.style.display = 'none';
        closeSearch.addEventListener('click', closeSearchOverlay);
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                closeSearchOverlay();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.style.display === 'flex') {
                closeSearchOverlay();
            }
        });
    }
    
    // Cart Sidebar Functionality
    if (cartIcon && cartSidebar && closeCart) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('active');
        });
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }

    // MODIFIED: Profile Dropdown Functionality (on click)
    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', (e) => {
            e.preventDefault();
            profileDropdown.classList.toggle('show');
        });
    }

    // Close popups (Cart and Profile) when clicking outside
    document.addEventListener('click', (e) => {
        if (cartSidebar && cartSidebar.classList.contains('active') && !cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
        if (profileDropdown && profileDropdown.classList.contains('show') && !profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });

    // Shopping Cart Management
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            const product = {
                id: Date.now() + index,
                name: productCard.querySelector('h3').textContent,
                price: productCard.querySelector('.price').textContent,
                image: productCard.querySelector('img').src,
                quantity: 1
            };
            addToCart(product);
            showAddToCartFeedback(button);
        });
    });

    function addToCart(product) {
        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }
        updateCartDisplay();
    }
    
    window.updateQuantity = function(productId, change) {
        const product = cart.find(item => item.id === productId);
        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                removeFromCart(productId);
            } else {
                updateCartDisplay();
            }
        }
    }
    
    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
    }

    function updateCartDisplay() {
        const cartBody = document.querySelector('.cart-body');
        if (!cartBody) return;

        if (cart.length === 0) {
            cartBody.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        } else {
            cartBody.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" width="50">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">${item.price}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
                </div>
            `).join('');
        }
        updateSubtotal();
        updateCartIcon();
    }

    function updateSubtotal() {
        const subtotalElement = document.querySelector('.subtotal span:last-child');
        if (subtotalElement) {
            const total = cart.reduce((sum, item) => {
                const price = parseFloat(item.price.replace('₦', ''));
                return sum + (price * item.quantity);
            }, 0);
            subtotalElement.textContent = `₦${total.toFixed(2)}`;
        }
    }

    function updateCartIcon() {
        if (!cartIcon) return;
        let badge = cartIcon.querySelector('.cart-badge');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalItems > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                cartIcon.appendChild(badge);
                Object.assign(badge.style, {
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: '#d4357a', color: 'white', borderRadius: '50%',
                    width: '20px', height: '20px', fontSize: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold'
                });
            }
            badge.textContent = totalItems;
        } else if (badge) {
            badge.remove();
        }
    }

    function showAddToCartFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.background = '#4CAF50';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1500);
    }
    
    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Header offset
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Newsletter Form Enhancement
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', () => {
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                // You might want to clear the form here too
                // newsletterForm.reset();
            }, 2000);
        });
    }

    // Search Functionality
    if (searchForm) {
        const searchInput = searchForm.querySelector('input');
        const performSearch = () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (!searchTerm) return;

            const products = document.querySelectorAll('.product-card');
            let found = false;
            products.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                const isMatch = productName.includes(searchTerm);
                product.style.border = isMatch ? '3px solid #d4357a' : '';
                product.style.transform = isMatch ? 'scale(1.02)' : '';
                if (isMatch) found = true;
            });

            searchOverlay.style.display = 'none';

            if (found) {
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert(`No products found for "${searchTerm}"`);
            }
            
            setTimeout(() => {
                products.forEach(product => {
                    product.style.border = '';
                    product.style.transform = '';
                });
            }, 5000);
            searchInput.value = '';
        };

        searchForm.querySelector('button').addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    // Category Card Click Handlers
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Intersection Observer for Animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = document.querySelectorAll('.product-card, .category-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // --- INITIALIZE ---
    updateCartDisplay();
});

// Modal functions need to be global
function showModal(type) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    let content = '';
    // (Modal content switch statement from previous examples goes here)
    // For brevity, it's omitted but should be included if needed.
    modalBody.innerHTML = `<h2>${type.charAt(0).toUpperCase() + type.slice(1)}</h2><p>Content for ${type} goes here.</p>`; // Placeholder
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
