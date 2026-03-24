// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => nav.classList.toggle('open'));

// ===== STICKY HEADER =====
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  header.style.boxShadow = window.scrollY > 20
    ? '0 4px 24px rgba(0,0,0,.3)'
    : 'none';
});

// ===== CATEGORY TABS =====
const catTabs = document.querySelectorAll('.cat-tab');
const prodRows = document.querySelectorAll('.prod-row');
const noResults = document.getElementById('noResults');
let activeFilter = 'todos';

catTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    activeFilter = tab.dataset.filter;
    catTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    applyFilters();
  });
});

// ===== SEARCH =====
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', applyFilters);

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  prodRows.forEach(row => {
    const catMatch = activeFilter === 'todos' || row.dataset.cat === activeFilter;
    const name = row.querySelector('h3').textContent.toLowerCase();
    const desc = row.querySelector('p').textContent.toLowerCase();
    const searchMatch = !query || name.includes(query) || desc.includes(query);

    if (catMatch && searchMatch) {
      row.classList.remove('hidden');
      visible++;
    } else {
      row.classList.add('hidden');
    }
  });

  noResults.style.display = visible === 0 ? 'block' : 'none';
}

// ===== MODAL =====
const modalOverlay = document.getElementById('modalOverlay');

function openModal(title, emoji, cat, desc, price) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalEmoji').textContent = emoji;
  document.getElementById('modalCat').textContent = cat;
  document.getElementById('modalDesc').textContent = desc;
  document.getElementById('modalPrice').textContent = price;
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

// ===== ANIMATED COUNTERS =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}

const empresaSection = document.querySelector('.empresa');
const counterObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.estat-num').forEach(animateCounter);
    counterObserver.disconnect();
  }
}, { threshold: 0.3 });
if (empresaSection) counterObserver.observe(empresaSection);

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  toast.classList.add('show');
  contactForm.reset();
  setTimeout(() => toast.classList.remove('show'), 4000);
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

document.querySelectorAll('.servicio-card, .prod-row, .hcard, .empresa-stat, .contact-aside__block').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity .4s ease, transform .4s ease';
  fadeObserver.observe(el);
});
