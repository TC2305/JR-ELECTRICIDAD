
import { supabase } from "./supabase.js";

const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  // No hay login → vuelve al login
  window.location.href = "login.html";
}
