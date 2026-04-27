// js/ui-effects.js

document.addEventListener('DOMContentLoaded', () => {

  // Staggered card entry
  const cards = document.querySelectorAll('.card, .stat-card, .plan-card, .admin-stat-card');
  if (cards.length && typeof gsap !== 'undefined') {
    gsap.fromTo(cards,
      { opacity:0, y:24 },
      { opacity:1, y:0, duration:0.45, stagger:0.07, ease:'power2.out', delay:0.1 }
    );
  }

  // Page fade
  const main = document.querySelector('main, .page-content, .admin-main');
  if (main && typeof gsap !== 'undefined') {
    gsap.fromTo(main, { opacity:0 }, { opacity:1, duration:0.35, ease:'power1.out' });
  }

  // Active nav
  const navLinks = document.querySelectorAll('.bottom-nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && window.location.pathname.endsWith(href)) link.classList.add('active');
  });

  // Counter animation
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dec    = el.dataset.decimals ? parseInt(el.dataset.decimals) : 2;
    if (typeof gsap !== 'undefined') {
      gsap.fromTo({ val:0 }, { val:target }, {
        duration:1.3, ease:'power2.out',
        onUpdate: function() {
          el.textContent = prefix + this.targets()[0].val.toFixed(dec) + suffix;
        }
      });
    } else {
      el.textContent = prefix + target.toFixed(dec) + suffix;
    }
  });
});

window.setLoading = (btn, isLoading, loadingText = 'Processing…') => {
  if (isLoading) {
    btn._orig = btn.textContent;
    btn.disabled = true; btn.textContent = loadingText; btn.style.opacity = '0.65';
  } else {
    btn.disabled = false; btn.textContent = btn._orig || 'Submit'; btn.style.opacity = '1';
  }
};

window.showSkeleton = (container, rows = 3) => {
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${Array(rows).fill(`
        <div style="height:68px;background:linear-gradient(90deg,#F0EBD4 25%,#E8E2C8 50%,#F0EBD4 75%);
          background-size:200% 100%;border-radius:10px;animation:shimmer 1.4s infinite;"></div>
      `).join('')}
    </div>
    <style>@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}</style>
  `;
};
