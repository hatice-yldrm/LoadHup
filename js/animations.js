document.addEventListener("DOMContentLoaded", () => {

    initCounterAnimation();
    initScrollReveal();
    initHeroFloat();

});

function initCounterAnimation() {

    const counters = document.querySelectorAll(".counter");

    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const counter = entry.target;

            const target = Number(counter.dataset.target);

            let current = 0;

            const increment = target / 100;

            function updateCounter() {

                current += increment;

                if (current < target) {

                    counter.textContent = Math.ceil(current);

                    requestAnimationFrame(updateCounter);

                } else {

                    counter.textContent = target.toLocaleString("tr-TR");

                }

            }

            updateCounter();

            observer.unobserve(counter);

        });

    }, {

        threshold: .5

    });

    counters.forEach(counter => observer.observe(counter));

}

function initScrollReveal() {

    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

                observer.unobserve(entry.target);

            }

        });

    }, {

        threshold: .2

    });

    elements.forEach(element => observer.observe(element));

}

function initHeroFloat() {

    const heroImage = document.querySelector(".hero-right img");

    if (!heroImage) return;

    heroImage.classList.add("floating");

}