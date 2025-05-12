import { supabase } from "../../config/supabase.js";
import { loadSidebar } from "../../elements/sidebar.js";

await loadSidebar();

const tableBody = document.getElementById("roles-table");
const form = document.getElementById("role-form");
const roleInput = document.getElementById("role-name");

async function loadProfiles() {
  const { data, error } = await supabase.from("profiles").select("*").order("full_name", { ascending: true });

  if (error) {
    alert("Gagal memuat data roles.");
    return;
  }

  tableBody.innerHTML = data.map((profil, index) => `
    <tr>
      <td class="p-3 border-b">${profil.full_name}</td>
      <td class="p-3 border-b">${profil.nik}</td>
      <td class="p-3 border-b">${profil.phone}</td>
      <td class="p-3 border-b">${profil.email}</td>
      <td class="p-3 border-b">${profil.address}</td>
      <td class="p-3 border-b">${profil.birth_date}</td>
      <td class="p-3 border-b">${profil.join_date}</td>
      <td class="p-3 border-b">${profil.role_id}</td>
    </tr>
  `).join("");
}

// async function loadProfiles() {
//   const { data, error } = await supabase.from("profiles").select("*").order("id", { ascending: true });
// 
//   if (error) {
//     alert("Gagal memuat data roles.");
//     return;
//   }
// 
//   tableBody.innerHTML = data.map((profil, index) => `
//     <tr>
//       <td class="p-3 border-b">${index + 1}</td>
//       <td class="p-3 border-b">${profil.full_name}</td>
//       <td class="p-3 border-b space-x-2">
//         <button onclick="deleteRole(${profil.id})" class="text-red-500 hover:underline">Hapus</button>
//       </td>
//     </tr>
//   `).join("");
// }

// window.deleteProfile = async function (id) {
//   const confirmDelete = confirm("Yakin ingin menghapus role ini?");
//   if (!confirmDelete) return;// 
// 
//   const { error } = await supabase.from("roles").delete().eq("id", id);
//   if (error) {
//     alert("Gagal menghapus role.");
//   } else {
//     loadRoles();
//   }
// };

loadProfiles();
