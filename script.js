document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Hamburger Menu ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }));
    }

    // --- 2. Search Overlay Functionality ---
    const searchIcon = document.getElementById('search-icon');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.getElementById('close-search');

    if (searchIcon && searchOverlay && closeSearch) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent link from navigating
            searchOverlay.classList.add('active');
        });

        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }

    // --- 3. Shopping Cart Sidebar Functionality ---
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');

    if (cartIcon && cartSidebar && closeCart) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('open');
        });

        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
    }

    // --- 4. Profile Dropdown Functionality ---
    const profileIcon = document.getElementById('profile-icon');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', (e) => {
            e.preventDefault();
            profileDropdown.classList.toggle('show');
        });
    }

    // --- Close Profile Dropdown when clicking outside ---
    window.addEventListener('click', (e) => {
        if (profileIcon && profileDropdown) {
            // Check if the click is outside the profile icon and the dropdown itself
            if (!profileIcon.parentElement.contains(e.target)) {
                 profileDropdown.classList.remove('show');
            }
        }
    });
});
