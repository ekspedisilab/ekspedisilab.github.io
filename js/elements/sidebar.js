import { supabase } from "../config/supabase.js";

export async function loadSidebar() {
  const sidebarContainer = document.getElementById('sidebar-container');
  const response = await fetch('/components/sidebar.html');
  const html = await response.text();
  sidebarContainer.innerHTML = html;

  const toggleButton = document.getElementById('toggle-sidebar');
  const sidebar = document.getElementById('sidebar');
  toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
  });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  const user = session.user;

  try {
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
      console.error('Failed to load profile:', error);
      throw new Error('Failed to fetch user profile.');
    }

    const nameEl = document.getElementById('user-name');
    const roleEl = document.getElementById('user-role');

    nameEl.textContent = profile.full_name || 'Terjadi kesalahan';
    roleEl.textContent = profile.roles?.name || 'Peran tidak ditemukan';

  } catch (err) {
    console.error(err);
    const nameEl = document.getElementById('user-name');
    const roleEl = document.getElementById('user-role');

    nameEl.textContent = 'Terjadi kesalahan';
    roleEl.textContent = '';
  }

  document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  });
}
