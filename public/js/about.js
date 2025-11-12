$(document).ready(function () {
    const aboutImage = document.querySelector('.about-image');
    const aboutText = document.querySelector('.about-text');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {threshold: 0.2});

    if (aboutImage) observer.observe(aboutImage);
    if (aboutText) observer.observe(aboutText);

    const galleryObserver = new IntersectionObserver(entries => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    $(entry.target).addClass('visible');
                }, index * 100);
            }
        });
    }, {threshold: 0.1});

    $('.gallery-item').each(function () {
        galleryObserver.observe(this);
    });
});
