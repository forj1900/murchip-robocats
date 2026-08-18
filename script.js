// Mobile nav toggle
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
});

mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// Scroll reveal
const revealTargets = document.querySelectorAll(
  '.feature-card, .split-text, .split-art, .how-step, .model-card, .review-card, .cta-box'
);
revealTargets.forEach((el) => el.setAttribute('data-reveal', ''));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => observer.observe(el));

// Fake order form submit
const orderForm = document.getElementById('orderForm');
const formNote = document.getElementById('formNote');

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = 'Заявка принята! Проверяем вашу посадочную площадку и свободное окно Starlink V7 🚀';
  orderForm.reset();
});
