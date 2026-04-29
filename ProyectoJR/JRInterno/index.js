import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Verificar sesión
  const { data: { session } } = await supabase.auth.getSession();

  // Si no hay sesión 
  if (!session) {
    window.location.href = "login.html";
    return; // detener ejecución
  }

  const btnLogout = document.getElementById("btnLogout");

  if (btnLogout) {
    btnLogout.addEventListener("click", async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      window.location.href = "login.html";
    });
  }
});