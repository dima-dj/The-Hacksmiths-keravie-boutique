
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const $  = (sel, root = document) => root.querySelector(sel);


(function ensurePriceVar(){
  const test = getComputedStyle(document.documentElement).getPropertyValue('--price');
  if (!test || !test.trim()) {
    document.documentElement.style.setProperty('--price', '#ff7b4a');
  }
})();


function headerOffset() {
  const h = document.querySelector('.site-header');
  return (h?.offsetHeight || 0) + 8;
}
function smoothScrollTo(el) {
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset();
  window.scrollTo({ top: y, behavior: 'smooth' });
  setTimeout(() => { el.setAttribute('tabindex','-1'); el.focus({ preventScroll: true }); }, 400);
}


const CART_KEY = 'keravie_cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : { items: {} };
  } catch { return { items: {} }; }
}
function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
}
function getCartCount(cart) {
  return Object.values(cart.items).reduce((a,b)=> a + (Number(b)||0), 0);
}
function setCartCountUI(n) {
  const el = $('#cartCount');
  if (el) el.textContent = String(n);
}


const cart = loadCart();
setCartCountUI(getCartCount(cart));

/* ----------  Add to cart ---------- */
function adjustQty(card, delta) {
  const valEl = card.querySelector('[data-bind="qty"]');
  const current = Math.max(1, Number(valEl?.textContent) || 1);
  const next = Math.max(1, current + delta);
  if (valEl) valEl.textContent = String(next);
}

function addToCart(card) {
  const id = card.dataset.id;
  if (!id) return;

  const qtyEl = card.querySelector('[data-bind="qty"]');
  const qty = Math.max(1, Number(qtyEl?.textContent) || 1);

  cart.items[id] = (Number(cart.items[id]) || 0) + qty;
  saveCart(cart);
  setCartCountUI(getCartCount(cart));

  // optional: reset displayed qty to 1 after adding
  if (qtyEl) qtyEl.textContent = '1';
}

document.addEventListener('click', (e) => {
  const card = e.target.closest('.shop-card');
  const act  = e.target.getAttribute('data-act');

  if (card && act) {
    e.preventDefault();
    if (act === 'plus')  adjustQty(card, +1);
    if (act === 'minus') adjustQty(card, -1);
    if (act === 'add')   addToCart(card);
    return;
  }

  const a = e.target.closest('a[href^="#"]');
  if (a) {
    const hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    const id = decodeURIComponent(hash.slice(1));
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      smoothScrollTo(target);
    } else {
      
      if (id === 'problem') {
        e.preventDefault();
        // Send a quick email with context
        const subject = encodeURIComponent('Signalement de problème — Kéravie Boutique');
        const body = encodeURIComponent(
          `Bonjour,\n\nJe souhaite signaler un problème sur la page Boutique.\n` +
          `Contexte (à préciser) : \n- Produit : \n- Action réalisée : \n- Message d’erreur : \n\nMerci.`
        );
        window.location.href = `mailto:contact@keravie.dz?subject=${subject}&body=${body}`;
      }
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


const logoutBtn = document.querySelector('.btn-logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    const ok = confirm('Voulez-vous vous déconnecter ? (le panier local sera vidé)');
    if (!ok) return;
    try { localStorage.removeItem(CART_KEY); } catch {}
    Object.keys(cart.items).forEach(k => delete cart.items[k]);
    setCartCountUI(0);
  });
}


(function validateCards(){
  $$('.shop-card').forEach(card => {
    if (!card.dataset.id) {
      const title = card.querySelector('.item-title')?.textContent?.trim() || 'item';
      const slug  = title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'');
      card.dataset.id = slug || `item-${Math.random().toString(36).slice(2,7)}`;
    }
  });
})();
