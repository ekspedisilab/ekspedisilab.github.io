import { supabase } from "../../config/supabase.js";
import { loadSidebar } from "../../elements/sidebar.js";

await loadSidebar();

const tableBody = document.getElementById("roles-table");
const form = document.getElementById("role-form");
const roleInput = document.getElementById("role-name");

async function loadRoles() {
  const { data, error } = await supabase.from("roles").select("*").order("id", { ascending: true });

  if (error) {
    alert("Gagal memuat data roles.");
    return;
  }

  tableBody.innerHTML = data.map((role, index) => `
    <tr>
      <td class="p-3 border-b">${index + 1}</td>
      <td class="p-3 border-b">${role.name}</td>
      <td class="p-3 border-b space-x-2">
        <button onclick="deleteRole(${role.id})" class="text-red-500 hover:underline"><span class="material-icons text-2xl">delete</span></button>
      </td>
    </tr>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = roleInput.value.trim();
  if (!name) return;

  const { error } = await supabase.from("roles").insert([{ name }]);
  if (error) {
    alert("Gagal menambahkan role.");
  } else {
    roleInput.value = "";
    loadRoles();
  }
});

window.deleteRole = async function (id) {
  const confirmDelete = confirm("Yakin ingin menghapus role ini?");
  if (!confirmDelete) return;

  const { error } = await supabase.from("roles").delete().eq("id", id);
  if (error) {
    alert("Gagal menghapus role.");
  } else {
    loadRoles();
  }
};

loadRoles();
