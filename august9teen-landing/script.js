document.addEventListener('DOMContentLoaded', () => {
    // Navigation functionality
    const homeTab = document.getElementById('home-tab');
    const techTab = document.getElementById('tech-tab');
    const blogTab = document.getElementById('blog-tab');
    const homeSection = document.getElementById('home-section');
    const techSection = document.getElementById('tech-section');
    const blogSection = document.getElementById('blog-section');

    homeTab.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(homeSection, homeTab);
        hideSection(techSection, techTab);
        hideSection(blogSection, blogTab);
    });

    techTab.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(techSection, techTab);
        hideSection(homeSection, homeTab);
        hideSection(blogSection, blogTab);
    });

    blogTab.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(blogSection, blogTab);
        hideSection(homeSection, homeTab);
        hideSection(techSection, techTab);
    });

    function showSection(section, tab) {
        section.classList.add('active');
        tab.classList.add('active');
    }

    function hideSection(section, tab) {
        section.classList.remove('active');
        tab.classList.remove('active');
    }

    // Logo glitch effect
    const logo = document.querySelector('.logo');
    
    function triggerGlitch() {
        logo.classList.add('glitch');
        setTimeout(() => {
            logo.classList.remove('glitch');
        }, 400);
    }

    // Initial glitch
    setTimeout(triggerGlitch, 1000);

    // Periodic glitch every 5 seconds
    setInterval(() => {
        triggerGlitch();
    }, 5000);

    // Random micro-glitches
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance of micro-glitch
            triggerGlitch();
        }
    }, 10000);
});
