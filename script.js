// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Search Overlay Functionality
const searchIcon = document.getElementById('search-icon');
const searchOverlay = document.getElementById('search-overlay');
const closeSearch = document.getElementById('close-search');

if (searchIcon && searchOverlay && closeSearch) {
    searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        searchOverlay.style.display = 'flex';
        // Focus on search input when opened
        const searchInput = searchOverlay.querySelector('input');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.style.display = 'none';
    });

    // Close search overlay when clicking outside
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.style.display = 'none';
        }
    });

    // Close search overlay with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.style.display === 'flex') {
            searchOverlay.style.display = 'none';
        }
    });
}

// Cart Sidebar Functionality
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');

if (cartIcon && cartSidebar && closeCart) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // Close cart sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (cartSidebar.classList.contains('active') && 
            !cartSidebar.contains(e.target) && 
            !cartIcon.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
    });
}

// Shopping Cart Management
let cart = [];

// Add to Cart Functionality
const addToCartButtons = document.querySelectorAll('.product-card .btn');

addToCartButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get product information
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        const productImage = productCard.querySelector('img').src;
        
        // Create product object
        const product = {
            id: Date.now() + index, // Simple ID generation
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };
        
        // Add to cart
        addToCart(product);
        
        // Show success feedback
        showAddToCartFeedback(button);
    });
});

function addToCart(product) {
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.name === product.name);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    updateCartDisplay();
    updateCartIcon();
}

function updateCartDisplay() {
    const cartBody = document.querySelector('.cart-body');
    
    if (cart.length === 0) {
        cartBody.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        updateSubtotal(0);
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const price = parseFloat(item.price.replace('₦', ''));
        const itemTotal = price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
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
        `;
    });
    
    cartBody.innerHTML = cartHTML;
    updateSubtotal(total);
}

function updateQuantity(productId, change) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            updateCartIcon();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateCartIcon();
}

function updateSubtotal(total) {
    const subtotalElement = document.querySelector('.subtotal span:last-child');
    if (subtotalElement) {
        subtotalElement.textContent = `₦${total.toFixed(2)}`;
    }
}

function updateCartIcon() {
    // Add cart count badge if there are items
    const cartIcon = document.getElementById('cart-icon');
    let badge = cartIcon.querySelector('.cart-badge');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            cartIcon.appendChild(badge);
        }
        badge.textContent = totalItems;
        badge.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: #d4357a;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;
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
const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if it's just "#" or if it's for modal functionality
        if (href === '#' || link.hasAttribute('onclick')) {
            return;
        }
        
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Newsletter Form Enhancement
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        const submitButton = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;
        
        // Reset after form submission (whether successful or not)
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Search Functionality
const searchForm = document.querySelector('.search-overlay-content');

if (searchForm) {
    const searchInput = searchForm.querySelector('input');
    const searchButton = searchForm.querySelector('button');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm) {
            // Simple search functionality - highlight matching products
            const products = document.querySelectorAll('.product-card');
            let found = false;
            
            products.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                const productCard = product.closest('.product-card');
                
                if (productName.includes(searchTerm)) {
                    productCard.style.border = '3px solid #d4357a';
                    productCard.style.transform = 'scale(1.02)';
                    found = true;
                } else {
                    productCard.style.border = '';
                    productCard.style.transform = '';
                }
            });
            
            // Close search overlay and scroll to products
            searchOverlay.style.display = 'none';
            
            if (found) {
                const productSection = document.getElementById('shop');
                if (productSection) {
                    productSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                alert(`No products found for "${searchTerm}"`);
            }
            
            // Clear search highlights after 5 seconds
            setTimeout(() => {
                products.forEach(product => {
                    product.style.border = '';
                    product.style.transform = '';
                });
            }, 5000);
        }
        
        searchInput.value = '';
    }
    
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
}

// Category Card Click Handlers
const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const categoryId = card.id;
        
        // Scroll to the products section
        const productSection = document.getElementById('shop');
        if (productSection) {
            productSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // You can add more specific filtering logic here
        // For now, we'll just scroll to the products section
    });
});

// Profile Dropdown Enhancement
const profileIcon = document.getElementById('profile-icon');
const profileDropdown = document.getElementById('profile-dropdown');

if (profileIcon && profileDropdown) {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.style.opacity = '0';
            profileDropdown.style.visibility = 'hidden';
        }
    });
}

// Loading Animation for Images
const images = document.querySelectorAll('img');

images.forEach(img => {
    img.addEventListener('load', () => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            img.style.opacity = '1';
        }, 100);
    });
});

// Intersection Observer for Animations
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe product cards and category cards
    const animatedElements = document.querySelectorAll('.product-card, .category-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    updateCartIcon();
});
