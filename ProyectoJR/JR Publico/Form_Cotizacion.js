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

     setTimeout(() => popup.style.display = "none", 3000);
}


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("Form_Cotizacion");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

  
const datos = {
      nombre: form.nombre.value,
      correo: form.correo.value,
      telefono: form.telefono.value,
      direccion: form.direccion.value,
      servicio: form.servicio.value,
      descripcion: form.descripcion.value,
      fecha: form.fecha.value
    };


  //Guarda en Supabase
  const { error } = await supabase.from("cotizaciones").insert([{
    nombre_cliente: datos.nombre,
    correo: datos.correo,
    telefono: datos.telefono,
    direccion: datos.direccion,
    servicio: datos.servicio,
    descripcion: datos.descripcion,
    fecha_deseada: datos.fecha,
    estado: "pendiente",
    fecha_solicitud: new Date().toISOString().split("T")[0]
  }]);

  if (error) {
    mostrarPopup("error", "Error al guardar la cotización");
    return;
  }

  //funcion
  /*
const response = await fetch(
      "https://TU_PROYECTO.supabase.co/functions/v1/enviar-cotizacion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer TU_ANON_KEY`
        },
        body: JSON.stringify(datos)
      }
    );

    const result = await response.json();

   if (!result.success) {
      mostrarPopup("error", "Cotización guardada, pero error al enviar correo");
      return;
    }*/
   mostrarPopup("exito", "Cotización enviada correctamente. ¡Gracias!");
    form.reset();
  });
});
