// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => nav.classList.toggle('open'));

// ===== ANIMATED COUNTERS =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const step = target / (1500 / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}

const statsSection = document.querySelector('.stats');
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.stat__number').forEach(animateCounter);
    observer.disconnect();
  }
}, { threshold: 0.3 });
observer.observe(statsSection);

// ===== MODAL =====
const modalOverlay = document.getElementById('modalOverlay');

function openModal(title, icon, desc) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalIcon').textContent = icon;
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

document.querySelectorAll('.cat-item, .feature-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .4s ease, transform .4s ease';
  fadeObserver.observe(el);
});
