document.addEventListener('DOMContentLoaded', function () {
    const contactCard = document.querySelector('.contact-card');
    if (contactCard) {
        setTimeout(() => {
            contactCard.classList.add('visible');
        }, 100);
    }

    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        return;
    }

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const form = event.target;
        const data = new FormData(form);
        const messageBox = document.getElementById("responseMessage");
        messageBox.innerHTML = "<div class='text-info'>Sending...</div>";

        try {
            const response = await fetch("https://formspree.io/f/mqagrwao", {
                method: "POST",
                body: data,
                headers: {"Accept": "application/json"}
            });

            if (response.ok) {
                messageBox.innerHTML = "<div class='text-success fw-bold'>Thank you! Your message has been sent ✅</div>";
                form.reset();
            } else {
                messageBox.innerHTML = "<div class='text-danger fw-bold'>Error: please try again later.</div>";
            }
        } catch (error) {
            console.error(error);
            messageBox.innerHTML = "<div class='text-danger fw-bold'>Network error 😞</div>";
        }
    });
});
