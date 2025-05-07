import { supabaseUrl, supabase } from "../../config/supabase.js";

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    document.getElementById('error-message').textContent = error.message;
  } else {
    console.log('Logged in:', data);
    window.location.href = '../dashboard.html';
  }
});
