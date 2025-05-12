import { supabase } from "../../config/supabase.js";
import { loadSidebar } from "../../elements/sidebar.js";

await loadSidebar();

const form = document.getElementById('profileForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  Swal.fire({
    title: 'Mohon tunggu',
    text: 'Memproses data...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

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
      return Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: data.error || 'Gagal mengambil User ID.'
      });
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
      return Swal.fire({
        icon: 'error',
        title: 'Insert Gagal',
        text: insertError.message
      });
    }

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Data pegawai sudah ditambahkan!'
    });

    form.reset();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Terjadi kesalahan',
      text: error.message
    });
  }
});
