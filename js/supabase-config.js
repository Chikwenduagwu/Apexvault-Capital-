// js/supabase-config.js
// ─────────────────────────────────────────
// ⚠️ Replace these with your actual Supabase values
// Supabase Dashboard → Settings → API
// ─────────────────────────────────────────

const SUPABASE_URL     = 'https://ijpxyywufufuakabwoqm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqcHh5eXd1ZnVmdWFrYWJ3b3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDQ0OTAsImV4cCI6MjA5MTIyMDQ5MH0.ils7XYlZudq3t7xuCN_d_z945AjeMrSfYKEyMT4D3w8';

const { createClient } = supabase;
window.sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Helpers ──────────────────────────────

window.getUser = async () => {
  const { data: { user } } = await window.sb.auth.getUser();
  return user;
};

window.getProfile = async (userId) => {
  const { data, error } = await window.sb
    .from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
};

window.requireAuth = async (redirectTo = 'login.html') => {
  const user = await window.getUser();
  if (!user) { window.location.href = redirectTo; return null; }
  return user;
};

window.requireAdmin = async () => {
  const user = await window.requireAuth('admin-login.html');
  if (!user) return null;
  const profile = await window.getProfile(user.id);
  if (profile.role !== 'admin') {
    window.location.href = 'admin-login.html';
    return null;
  }
  return { user, profile };
};

// Fetch a single platform setting by key
window.getSetting = async (key) => {
  const { data } = await window.sb
    .from('platform_settings').select('value').eq('key', key).single();
  return data?.value || '';
};

// Fetch all settings (returns object keyed by key)
window.getAllSettings = async () => {
  const { data } = await window.sb.from('platform_settings').select('*');
  if (!data) return {};
  return data.reduce((acc, row) => { acc[row.key] = row; return acc; }, {});
};

window.formatMoney = (amount = 0) =>
  '$' + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
