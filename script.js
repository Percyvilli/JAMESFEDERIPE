
const toggle = document.getElementById('theme-toggle');
const sun = document.getElementById('sun-icon');
const moon = document.getElementById('moon-icon');

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
    e.preventDefault();   // Prevents unwanted scrolling/click issues
    toggleTheme();
  });
}


const carousel = document.getElementById('toolsCarousel');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

if (prevBtn && carousel) {
  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -160, behavior: 'smooth' });
  });
  

  prevBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    carousel.scrollBy({ left: -160, behavior: 'smooth' });
  });
}

if (nextBtn && carousel) {
  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: 160, behavior: 'smooth' });
  });
  
  nextBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    carousel.scrollBy({ left: 160, behavior: 'smooth' });
  });
}


window.addEventListener('DOMContentLoaded', () => {
  loadTheme();
});
