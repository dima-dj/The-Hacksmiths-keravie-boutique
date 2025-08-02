function getHeaderOffset() {
  const header = document.querySelector('.site-header');
  return (header?.offsetHeight || 0) + 8;
}

function smoothScrollTo(el) {
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
  window.scrollTo({ top: y, behavior: 'smooth' });
  setTimeout(() => {
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }, 450);
}


document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;

  const hash = a.getAttribute('href');
  const target = getTargetFromHash(hash);

  if (target) {
    e.preventDefault();
    smoothScrollTo(target);
  } else {

    if (hash && hash.startsWith('#')) {
      e.preventDefault();
      alert("Cette section n’existe pas encore sur la page.");
    }
  }
});


const brandLogo = document.querySelector('img.brand');
if (brandLogo) {
  brandLogo.style.cursor = 'pointer';
  brandLogo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


function toggleHeaderScrolled() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', toggleHeaderScrolled, { passive: true });
document.addEventListener('DOMContentLoaded', toggleHeaderScrolled);


(function setupReveal(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

 
  if (!document.getElementById('reveal-style')) {
    const st = document.createElement('style');
    st.id = 'reveal-style';
    st.textContent = `
      .reveal{opacity:0;transform:translateY(10px);transition:opacity .5s ease, transform .5s ease}
      .reveal.is-in{opacity:1;transform:none}
    `;
    document.head.appendChild(st);
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
})();


document.addEventListener('click', (e) => {
  const cta = e.target.closest('a.btn-primary, a.btn-outline');
  if (!cta) return;
  const href = cta.getAttribute('href') || '';
  if (href.startsWith('#') && !getTargetFromHash(href)) {
    e.preventDefault();
    alert("La section de contact n’est pas disponible pour le moment.");
  }
});