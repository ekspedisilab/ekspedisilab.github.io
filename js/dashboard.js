import { supabaseUrl, supabase } from "./config/supabase.js";

const emailEl = document.getElementById('user-email');
const idEl = document.getElementById('user-id');
const nameEl = document.getElementById('user-name');
const roleEl = document.getElementById('user-role');

const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  window.location.href = 'index.html';
} else {
  const user = session.user;
  emailEl.textContent = `Logged in as: ${user.email}`;
  idEl.textContent = `User ID: ${user.id}`;

  // Fetch user profile including role name
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
    nameEl.textContent = 'Failed to load profile';
  } else {
    nameEl.textContent = `Name: ${profile.full_name}`;
    roleEl.textContent = `Role: ${profile.roles?.name || 'Unknown'}`;
  }
}

document.getElementById('logout-btn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});