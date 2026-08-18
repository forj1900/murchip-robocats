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

// Real order form submission
const orderForm = document.getElementById('orderForm');
const formNote = document.getElementById('formNote');
const submitButton = orderForm.querySelector('button[type="submit"]');
const defaultButtonText = submitButton.textContent;

orderForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!orderForm.reportValidity()) {
    return;
  }

  const formData = new FormData(orderForm);
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляем…';
  formNote.classList.remove('is-success', 'is-error');
  formNote.textContent = 'Сохраняем место в очереди на марсианскую доставку…';

  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.get('email'),
        company: formData.get('company'),
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      throw new Error(result.error || 'Не удалось отправить заявку.');
    }

    orderForm.reset();
    formNote.classList.add('is-success');
    formNote.textContent = 'Заявка сохранена! Свяжемся, когда откроется окно доставки на Марс 🚀';
  } catch (error) {
    formNote.classList.add('is-error');
    formNote.textContent = error.message || 'Не удалось отправить заявку. Попробуйте ещё раз.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = defaultButtonText;
  }
});
