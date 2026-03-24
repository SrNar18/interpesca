// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => nav.classList.toggle('open'));

// ===== STICKY HEADER SHADOW =====
window.addEventListener('scroll', () => {
  document.getElementById('header').style.boxShadow =
    window.scrollY > 10 ? '0 4px 20px rgba(44,62,85,.15)' : '0 2px 12px rgba(44,62,85,.08)';
});

// ===== FILTER =====
const filtros = document.querySelectorAll('.filtro');
const prodCards = document.querySelectorAll('.prod-card');
const noResults = document.getElementById('noResults');
let activeFilter = 'todos';

filtros.forEach(btn => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    filtros.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
});

// ===== SEARCH =====
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', applyFilters);

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  prodCards.forEach(card => {
    const catMatch = activeFilter === 'todos' || card.dataset.cat === activeFilter;
    const name = card.querySelector('h3').textContent.toLowerCase();
    const desc = card.querySelector('p').textContent.toLowerCase();
    const searchMatch = !query || name.includes(query) || desc.includes(query);

    if (catMatch && searchMatch) {
      card.classList.remove('hidden');
      visible++;
    } else {
      card.classList.add('hidden');
    }
  });

  noResults.style.display = visible === 0 ? 'block' : 'none';
}

// ===== MODAL =====
const modalOverlay = document.getElementById('modalOverlay');

function openModal(title, emoji, desc, price) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalEmoji').textContent = emoji;
  document.getElementById('modalDesc').textContent = desc;
  document.getElementById('modalPrice').textContent = price;
  // Derive badge from category
  const card = [...prodCards].find(c => c.querySelector('h3').textContent === title);
  document.getElementById('modalBadge').textContent = card ? card.dataset.cat : '';
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  toast.classList.add('show');
  contactForm.reset();
  setTimeout(() => toast.classList.remove('show'), 3500);
});

// ===== ANIMATE ON SCROLL (simple fade-in) =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.prod-card, .testi-card, .step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .4s ease, transform .4s ease';
  observer.observe(el);
});
