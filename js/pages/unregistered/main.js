import { supabaseUrl, supabase } from "../../config/supabase.js";

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

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`*`)
    .single();

  if (profile) {
    window.location.href = 'dashboard.html';
  }
}

document.getElementById('logout-btn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});
