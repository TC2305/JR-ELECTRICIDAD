import { supabase } from "./supabase.js";

function mostrarPopup(tipo, texto) {
  const popup = document.getElementById("popup");
  const popupContent = document.querySelector(".popup-content");
  const popupIcon = document.getElementById("popup-icon");
  const popupText = document.getElementById("popup-text");

 popupContent.className = "popup-content " + (tipo === "exito" ? "success" : "error");
  popupIcon.textContent = tipo === "exito" ? "✔️" : "❌";
  popupText.textContent = texto;

  popup.style.display = "block";

  // Cerrar al hacer clic en el botón
  document.getElementById("popup-close").onclick = () => {
    popup.style.display = "none";
  };

    setTimeout(() => {
    popup.style.display = "none";
  }, 3000)
}

document.getElementById("Form_Cotizacion").addEventListener("submit", async function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("telefono").value;
  const direccion = document.getElementById("direccion").value;
  const servicio = document.getElementById("servicio").value;
  const descripcion = document.getElementById("descripcion").value;
  const fecha = document.getElementById("fecha").value;

  const { data, error } = await supabase
    .from("cotizaciones")
    .insert([
      {
        nombre_cliente: nombre,
        correo: correo,
        telefono: telefono,
        direccion: direccion,
        servicio: servicio,
        descripcion: descripcion,
        fecha_deseada: fecha,
        estado: "pendiente",
        fecha_solicitud: new Date().toISOString().split("T")[0]
      }
    ]);

   if (error) {
    mostrarPopup("error", "Error al guardar la cotización: " + error.message);
    console.error(error);
  } else {
    mostrarPopup("exito", "Cotización enviada correctamente. ¡Gracias!");
    document.getElementById("Form_Cotizacion").reset();
  }
});
