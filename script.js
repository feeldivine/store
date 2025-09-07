const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

// Add a click event listener to the hamburger menu
hamburger.addEventListener("click", () => {
    // Toggle 'active' class on both hamburger and nav menu
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Optional: Close the menu when a link is clicked
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));
