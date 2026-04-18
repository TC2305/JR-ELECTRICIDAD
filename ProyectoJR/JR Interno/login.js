
import { supabase } from "./supabase.js";

const form = document.getElementById("formLogin");
const errorText = document.getElementById("loginError");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    errorText.textContent = "Usuario o contraseña incorrectos";
    return;
  }

  // Login exitoso
  window.location.href = "index.html";
});
