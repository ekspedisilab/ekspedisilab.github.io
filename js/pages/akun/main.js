import { supabase } from "../../config/supabase.js";
import { loadSidebar } from "../../elements/sidebar.js";

await loadSidebar();

const tableBody = document.getElementById("roles-table");
const form = document.getElementById("role-form");
const roleInput = document.getElementById("role-name");

async function loadProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id, full_name,
      nik,
      phone,
      email,
      address,
      birth_date,
      join_date,
      roles:role_id (name)
    `)
    .order("full_name", { ascending: true });

  if (error) {
    console.error(error);
    alert("Gagal memuat data roles.");
    return;
  }

  tableBody.innerHTML = data.map((profil) => `
    <tr>
      <td class="p-3 border-b">${profil.full_name}</td>
      <td class="p-3 border-b">${profil.nik}</td>
      <td class="p-3 border-b">${profil.phone}</td>
      <td class="p-3 border-b">${profil.email}</td>
      <td class="p-3 border-b">${profil.address}</td>
      <td class="p-3 border-b">${profil.birth_date}</td>
      <td class="p-3 border-b">${profil.join_date}</td>
      <td class="p-3 border-b">${profil.roles?.name || "-"}</td>
      <td class="p-3 border-b space-x-2">
        <button onclick="deleteProfile('${profil.id}')" class="text-red-500 hover:underline"><span class="material-icons text-2xl">delete</span></button>
      </td>
    </tr>
  `).join("");
}

window.deleteProfile = async function (id) {
  if (!id) {
    console.error("Invalid profile id:", id);
    alert("Gagal menghapus user, ID tidak valid.");
    return;
  }

  const confirmDelete = confirm("Yakin ingin menghapus pegawai ini?");
  if (!confirmDelete) return;

  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) {
    alert("Gagal menghapus user.");
  } else {
    loadProfiles();
  }
};


loadProfiles();
