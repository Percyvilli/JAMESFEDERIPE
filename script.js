
const toggle = document.getElementById('theme-toggle');
const sun   = document.getElementById('sun-icon');
const moon  = document.getElementById('moon-icon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  if (theme === 'dark') {
    sun.classList.add('hidden');
    moon.classList.remove('hidden');
  } else {
    moon.classList.add('hidden');
    sun.classList.remove('hidden');
  }
}

function loadTheme() {
  let theme = localStorage.getItem('theme');
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  setTheme(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
}

if (toggle) {
  toggle.addEventListener('click', toggleTheme);
  toggle.addEventListener('touchend', (e) => {
    e.preventDefault();
    toggleTheme();
  });
}

const carousel = document.getElementById('toolsCarousel');
const prevBtn  = document.querySelector('.prev');
const nextBtn  = document.querySelector('.next');

if (prevBtn && carousel) {
  const scrollPrev = () => carousel.scrollBy({ left: -160, behavior: 'smooth' });
  prevBtn.addEventListener('click', scrollPrev);
  prevBtn.addEventListener('touchend', (e) => { e.preventDefault(); scrollPrev(); });
}

if (nextBtn && carousel) {
  const scrollNext = () => carousel.scrollBy({ left: 160, behavior: 'smooth' });
  nextBtn.addEventListener('click', scrollNext);
  nextBtn.addEventListener('touchend', (e) => { e.preventDefault(); scrollNext(); });
}

window.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  console.log('✅ Theme toggle & carousel initialized');
});
