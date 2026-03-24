// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => nav.classList.toggle('open'));

// ===== CATEGORY FILTER =====
const catCards = document.querySelectorAll('.cat-card');
const productCards = document.querySelectorAll('.product-card');
const noResults = document.getElementById('noResults');

let activeFilter = 'todos';

catCards.forEach(btn => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    catCards.forEach(b => b.classList.remove('active'));
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

  productCards.forEach(card => {
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

// ===== ANIMATED COUNTERS =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
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

function openModal(title, desc, icon, price) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent = desc;
  document.getElementById('modalIcon').textContent = icon;
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

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  toast.classList.add('show');
  contactForm.reset();
  setTimeout(() => toast.classList.remove('show'), 3500);
});
