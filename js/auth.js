// js/auth.js

document.addEventListener('DOMContentLoaded', () => {

  // ── LOGIN ─────────────────────────────
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Signing in…';

      const { data, error } = await window.sb.auth.signInWithPassword({
        email: loginForm.email.value.trim(),
        password: loginForm.password.value
      });
      if (error) {
        Toast.show(error.message, 'error');
        btn.disabled = false; btn.textContent = 'Sign In'; return;
      }
      const profile = await window.getProfile(data.user.id);
      if (profile.is_banned) {
        await window.sb.auth.signOut();
        Toast.show('Your account has been suspended.', 'error');
        btn.disabled = false; btn.textContent = 'Sign In'; return;
      }
      Toast.show('Welcome back!', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
    });
  }

  // ── REGISTER ──────────────────────────
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = registerForm.querySelector('button[type="submit"]');
      const fullName = registerForm.full_name.value.trim();
      const email    = registerForm.email.value.trim();
      const password = registerForm.password.value;
      const refCode  = registerForm.ref_code?.value.trim();

      if (password.length < 8) { Toast.show('Password must be at least 8 characters.', 'warning'); return; }

      btn.disabled = true; btn.textContent = 'Creating account…';

      const { data, error } = await window.sb.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } }
      });
      if (error) {
        Toast.show(error.message, 'error');
        btn.disabled = false; btn.textContent = 'Create Account'; return;
      }
      if (refCode && data.user) {
        const { data: referrer } = await window.sb
          .from('profiles').select('id').eq('referral_code', refCode).single();
        if (referrer) {
          await window.sb.from('profiles').update({ referred_by: referrer.id }).eq('id', data.user.id);
        }
      }
      Toast.show('Account created! Check your email to verify.', 'success');
      setTimeout(() => { window.location.href = 'login.html'; }, 1600);
    });
  }

  // ── LOGOUT ────────────────────────────
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await window.sb.auth.signOut();
      window.location.href = 'login.html';
    });
  }

  // ── ADMIN LOGIN ───────────────────────
  const adminLoginForm = document.getElementById('admin-login-form');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = adminLoginForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Authenticating…';

      const { data, error } = await window.sb.auth.signInWithPassword({
        email: adminLoginForm.email.value.trim(),
        password: adminLoginForm.password.value
      });
      if (error) {
        Toast.show('Invalid credentials.', 'error');
        btn.disabled = false; btn.textContent = 'Admin Sign In'; return;
      }
      const profile = await window.getProfile(data.user.id);
      if (profile.role !== 'admin') {
        await window.sb.auth.signOut();
        Toast.show('Access denied. Admin only.', 'error');
        btn.disabled = false; btn.textContent = 'Admin Sign In'; return;
      }
      Toast.show('Welcome, Admin.', 'success');
      setTimeout(() => { window.location.href = 'admin-dashboard.html'; }, 800);
    });
  }
});
