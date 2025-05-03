import { supabase } from "./config/supabase.js";

const nameEl = document.getElementById('user-name');
const roleEl = document.getElementById('user-role');
const greetingNameEl = document.getElementById('greeting-name');

const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  window.location.href = 'index.html';
} else {
  const user = session.user;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      full_name,
      role_id,
      roles!fk_role (
        name
      )
    `)
    .eq('id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.log("Profile pengguna tidak ditemukan!");
      nameEl.textContent = 'Profile belum dibuat';
      roleEl.textContent = '';
      greetingNameEl.textContent = 'Pengguna';
    } else {
      console.error('Gagal memuat profil:', error);
      nameEl.textContent = 'Terjadi kesalahan';
      roleEl.textContent = '';
      greetingNameEl.textContent = 'Pengguna';
    }
  } else {
    nameEl.textContent = profile.full_name;
    roleEl.textContent = profile.roles?.name || 'Peran tidak ditemukan';
    greetingNameEl.textContent = profile.full_name;
  }
}

document.getElementById('logout-btn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});
