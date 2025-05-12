import { supabase } from "../../config/supabase.js";
import { loadSidebar } from "../../elements/sidebar.js";

await loadSidebar();

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
      console.log("Profile pengguna tidak ditemukan! Redirecting...");
      window.location.href = 'unregistered.html';
    } else {
      console.error('Gagal memuat profil:', error);
      greetingNameEl.textContent = 'Pengguna';
    }
  } else {
    greetingNameEl.textContent = profile.full_name;
  }
}

// Fetch total number of employees
const employeeCountEl = document.getElementById('employee-count');

const { data: employees, error: employeeError } = await supabase
  .from('profiles')
  .select('id');

if (employeeError) {
  console.error("Gagal menghitung jumlah karyawan:", employeeError);
  employeeCountEl.textContent = 'Error';
} else {
  employeeCountEl.textContent = employees.length;
}

document.getElementById('logout-btn')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});
