// Dark mode
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
  if (!theme) theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(theme);
}

toggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
});

loadTheme();

const carousel = document.getElementById('toolsCarousel');
document.querySelector('.prev').addEventListener('click', () => carousel.scrollBy({left:-160, behavior:'smooth'}));
document.querySelector('.next').addEventListener('click', () => carousel.scrollBy({left:160, behavior:'smooth'}));
});
