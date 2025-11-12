$(document).ready(function () {
    // Scroll section functionality
    $('.scroll-section').each(function () {
        const $section = $(this);
        const $container = $section.find('.scroll-container');
        const $leftBtn = $section.find('.scroll-btn.left');
        const $rightBtn = $section.find('.scroll-btn.right');

        $container.on('wheel', function (evt) {
            evt.preventDefault();
            const delta = evt.originalEvent.deltaY || evt.originalEvent.wheelDelta;
            const scrollAmount = delta > 0 ? 200 : -200;

            this.scrollLeft += scrollAmount;
        });

        $leftBtn.on('click', function () {
            $container.animate({
                scrollLeft: $container.scrollLeft() - 350
            }, 500, 'swing');
        });

        $rightBtn.on('click', function () {
            $container.animate({
                scrollLeft: $container.scrollLeft() + 350
            }, 500, 'swing');
        });

        const items = $container.find('.scroll-item').get();
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('visible');
                }
            });
        }, {threshold: 0.3});

        items.forEach(item => observer.observe(item));
    });

    // Cards animation
    const $cards = $('.card');
    const cardObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('card-visible');
            }
        });
    }, {threshold: 0.2});

    $cards.each(function () {
        cardObserver.observe(this);
    });

    // Smooth scroll to cards section
    $('.scroll-down').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $('#cards').offset().top
        }, 800);
    });
});
