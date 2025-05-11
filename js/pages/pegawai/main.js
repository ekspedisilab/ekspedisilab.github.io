import { supabase } from "../../config/supabase.js";

// Use the endpoint you provided
const EDGE_FUNCTION_URL = "https://fsnmxswkdyuhbkdmskys.supabase.co/functions/v1/list-users";
const EDGE_FUNCTION_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbm14c3drZHl1aGJrZG1za3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNjc4MjQsImV4cCI6MjA2MTc0MzgyNH0.FIVaBmAHlmQ5SxPJp-8JgekLV6Bx1L4T9A1HcLe6uOs"; // Replace with your actual Bearer token

const userSelect = document.getElementById("user-id");
const emailInput = document.getElementById("email");
const fullNameInput = document.getElementById("full-name");
const nikInput = document.getElementById("nik");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const birthDateInput = document.getElementById("birth-date");
const photoUrlInput = document.getElementById("photo-url");
const roleSelect = document.getElementById("role-id");
const form = document.getElementById("profile-form"); // Added form definition

let authUsers = [];

async function loadRoles() {
  const { data, error } = await supabase.from("roles").select("*").order("id", { ascending: true });
  if (error) {
    alert("Gagal memuat data roles.");
    return;
  }
  roleSelect.innerHTML = data.map(role => `<option value="${role.id}">${role.name}</option>`).join("");
}

async function loadAuthUsers() {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "GET", // Changed to GET for fetching data
      headers: {
        Authorization: `Bearer ${EDGE_FUNCTION_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Unknown error");

    authUsers = result.users;

    userSelect.innerHTML = `<option value="">Pilih Akun</option>` + authUsers
      .map(user => `<option value="${user.id}">${user.email}</option>`)
      .join("");

    userSelect.addEventListener("change", () => {
      const selectedUser = authUsers.find(user => user.id === userSelect.value);
      emailInput.value = selectedUser ? selectedUser.email : "";
    });
  } catch (err) {
    console.error("Failed to load auth users:", err);
    alert("Gagal memuat daftar akun.");
  }
}


async function loadProfiles() {
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) {
    alert("Gagal memuat data profil.");
    return;
  }

  const tableBody = document.getElementById("profiles-table");
  tableBody.innerHTML = data.map((profile, index) => `
    <tr>
      <td class="p-3 border-b">${index + 1}</td>
      <td class="p-3 border-b">${profile.full_name}</td>
      <td class="p-3 border-b">${profile.email}</td>
      <td class="p-3 border-b">${profile.phone}</td>
      <td class="p-3 border-b">${profile.role_id}</td>
      <td class="p-3 border-b space-x-2">
        <button onclick="deleteProfile('${profile.id}')" class="text-red-500 hover:underline">Hapus</button>
      </td>
    </tr>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = userSelect.value;
  const email = emailInput.value;
  const fullName = fullNameInput.value.trim();
  const nik = nikInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();
  const birthDate = birthDateInput.value.trim();
  const roleId = roleSelect.value;
  const photoUrl = photoUrlInput.value.trim();

  if (!userId || !fullName || !phone || !email || !roleId) {
    alert("Lengkapi semua data yang wajib diisi.");
    return;
  }

  const { error } = await supabase.from("profiles").insert([{
    id: userId,
    full_name: fullName,
    nik,
    phone,
    email,
    address,
    birth_date: birthDate,
    join_date: new Date().toISOString().split('T')[0],
    role_id: roleId,
    photo_url: photoUrl,
  }]);

  if (error) {
    alert("Gagal menambahkan profil.");
    console.error(error);
  } else {
    form.reset();
    emailInput.value = "";
    loadProfiles();
  }
});

window.deleteProfile = async function (id) {
  if (!confirm("Yakin ingin menghapus profil ini?")) return;
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) {
    alert("Gagal menghapus profil.");
  } else {
    loadProfiles();
  }
};

// Initial load
loadRoles();
loadAuthUsers();
loadProfiles();
