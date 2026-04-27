// js/toast.js
// ─────────────────────────────────────────
// Toast.show('Message', 'success' | 'error' | 'info' | 'warning')
// Cornsilk background, olive/pine accents
// ─────────────────────────────────────────

class Toast {
  static container = null;

  static _ensure() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.style.cssText = `
        position:fixed; top:20px; right:20px; z-index:9999;
        display:flex; flex-direction:column; gap:9px; pointer-events:none;
      `;
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  static show(message, type = 'info', duration = 4200) {
    const container = this._ensure();

    const icons = {
      success: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
      error:   `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      warning: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info:    `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
    };

    const accent = { success:'#606C38', error:'#8b1a1a', warning:'#7a5800', info:'#283618' };
    const col = accent[type] || accent.info;

    const toast = document.createElement('div');
    toast.style.cssText = `
      pointer-events:all;
      background:#FEFAE0;
      border:1.5px solid #D4C9A8;
      border-left:4px solid ${col};
      border-radius:12px;
      padding:13px 16px;
      display:flex; align-items:center; gap:11px;
      min-width:270px; max-width:360px;
      box-shadow:0 4px 24px rgba(40,54,24,0.12);
      opacity:0; transform:translateX(36px);
      transition:opacity 0.28s ease, transform 0.28s ease;
      font-family:'Montserrat',sans-serif;
    `;
    toast.innerHTML = `
      <span style="color:${col};flex-shrink:0;">${icons[type] || icons.info}</span>
      <span style="font-size:13px;font-weight:600;color:#1E1C0F;line-height:1.4;flex:1;">${message}</span>
      <button onclick="this.parentElement.remove()" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#7A7355;padding:0;line-height:1;flex-shrink:0;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }));
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(36px)';
      setTimeout(() => toast.remove(), 320);
    }, duration);
  }
}

window.Toast = Toast;
