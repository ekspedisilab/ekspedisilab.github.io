import { supabase } from "../../config/supabase.js";
import { loadSidebar } from "../../elements/sidebar.js";

await loadSidebar();

const form = document.getElementById('profileForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  message.textContent = 'Memproses data...';

  const formData = new FormData(form);
  const email = formData.get('email');

  try {
    const res = await fetch('https://fsnmxswkdyuhbkdmskys.supabase.co/functions/v1/get-user-id-by-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.status !== 200) {
      message.textContent = `Error: ${data.error || 'Failed to fetch user ID'}`;
      return;
    }

    const userId = data.id;

    const profile = {
      id: userId,
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      nik: formData.get('nik'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      birth_date: formData.get('birth_date') || null,
      join_date: formData.get('join_date') || null,
      role_id: formData.get('role_id') ? parseInt(formData.get('role_id')) : null,
      photo_url: formData.get('photo_url')
    };

    const { error: insertError } = await supabase.from('profiles').insert([profile]);

    if (insertError) {
      message.textContent = `Insert failed: ${insertError.message}`;
    } else {
      message.textContent = 'Data pegawai sudah ditambahkan!';
      form.reset();
    }
  } catch (error) {
    message.textContent = `Error: ${error.message}`;
  }
});