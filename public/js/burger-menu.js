document.addEventListener('DOMContentLoaded', function () {
    const burgerToggle = document.getElementById('burger-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (!burgerToggle || !navMenu) return;

    burgerToggle.addEventListener('click', function () {
        burgerToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.addEventListener('click', function (event) {
        if (!navMenu.contains(event.target) && !burgerToggle.contains(event.target)) {
            burgerToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                burgerToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
});
