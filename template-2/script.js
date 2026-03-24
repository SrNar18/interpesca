// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => nav.classList.toggle('open'));

// ===== STICKY HEADER SHADOW =====
window.addEventListener('scroll', () => {
  document.getElementById('header').style.boxShadow =
    window.scrollY > 10 ? '0 4px 20px rgba(44,62,85,.15)' : '0 2px 12px rgba(44,62,85,.08)';
});

// ===== MODAL =====
const modalOverlay = document.getElementById('modalOverlay');

function openModal(title, emoji, desc) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalEmoji').textContent = emoji;
  document.getElementById('modalDesc').textContent = desc;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== CONTACT FORM =====
const toast = document.getElementById('toast');
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  toast.classList.add('show');
  e.target.reset();
  setTimeout(() => toast.classList.remove('show'), 3500);
});

// ===== FADE IN ON SCROLL =====
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.cat-item, .testi-card, .step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .4s ease, transform .4s ease';
  fadeObserver.observe(el);
});
