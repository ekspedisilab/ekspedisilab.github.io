import { supabase } from "../config/supabase.js";

const toggleButton = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
const nameEl = document.getElementById('user-name');
const roleEl = document.getElementById('user-role');

const { data: { session } } = await supabase.auth.getSession();
const user = session?.user;

toggleButton.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});

if (user) {
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
      console.log("Profile pengguna tidak ditemukan! Redirecting...");
      window.location.href = 'unregistered.html';
    } else {
      console.error('Gagal memuat profil:', error);
      nameEl.textContent = 'Terjadi kesalahan';
      roleEl.textContent = '';
    }
  } else {
    nameEl.textContent = profile.full_name;
    roleEl.textContent = profile.roles?.name || 'Peran tidak ditemukan';
  }
} else {
  console.error('No user is authenticated.');
}

document.getElementById('logout-btn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});
