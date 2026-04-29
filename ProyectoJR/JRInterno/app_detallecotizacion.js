import { supabase } from "./supabase.js";

const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  window.location.href = "../login.html";
}


const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const contenedor = document.getElementById("app_detallecotizacion");
const btnEnviar = document.getElementById("btnEnviar");
const accionesCliente = document.getElementById("accionesCliente");
const btnAceptar = document.getElementById("btnAceptar");
const btnRechazar = document.getElementById("btnRechazar");

let cotizacionActual = null;

if (!id) {
  contenedor.innerHTML = "<p>Error: no se recibió el ID de la cotización.</p>";
  btnEnviar.style.display = "none";
  accionesCliente.style.display = "none";
  throw new Error("ID de cotización no encontrado");
}


async function cargarDetalle() {
  const { data, error } = await supabase
    .from("cotizaciones")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(error);
    contenedor.innerHTML = "<p>Error al cargar la cotización.</p>";
    return;
  }

  cotizacionActual = data;

  contenedor.innerHTML = `
    <p><strong>Cliente:</strong> ${data.nombre_cliente}</p>
    <p><strong>Correo:</strong> ${data.correo}</p>
    <p><strong>Teléfono:</strong> ${data.telefono}</p>
    <p><strong>Servicio:</strong> ${data.servicio}</p>
    <p><strong>Descripción:</strong> ${data.descripcion}</p>
    <p><strong>Fecha solicitada:</strong> ${new Date(data.fecha_solicitud).toLocaleDateString()}</p>
    <p><strong>Estado:</strong> ${data.estado}</p>
  `;

  // Mostrar acciones según estado
  if (data.estado === "pendiente") {
    btnEnviar.style.display = "inline-block";
    accionesCliente.style.display = "none";
  }

  if (data.estado === "enviada") {
    btnEnviar.style.display = "none";
    accionesCliente.style.display = "block";
  }

  if (data.estado === "aceptada" || data.estado === "rechazada_cliente") {
    btnEnviar.style.display = "none";
    accionesCliente.style.display = "none";
  }
}

btnEnviar.addEventListener("click", async () => {
  if (!confirm("¿Esta cotización fue enviada?")) return;

  const { error } = await supabase
    .from("cotizaciones")
    .update({ estado: "enviada" })
    .eq("id", id);

  if (error) {
    alert("Error al enviar cotización");
    return;
  }

  alert("Cotización actualizada como enviada ✅");
  cargarDetalle();
});


btnAceptar.addEventListener("click", async () => {
  if (!confirm("¿El cliente aceptó la cotización?")) return;

  // 1️⃣ actualizar estado
  const { error } = await supabase
    .from("cotizaciones")
    .update({ estado: "aceptada" })
    .eq("id", id);

  if (error) {
    alert("Error al marcar como aceptada");
    return;
  }

  // 2️⃣ crear trabajo
  await supabase.from("trabajos").insert({
    cotizacion_id: id,
    cliente: cotizacionActual.nombre_cliente,
    estado_pago: "pendiente_pago"
  });

  alert("La cotización fue aceptada y el trabajo fue creado ✅");
  window.location.href = "Control de Facturas.html";
});


btnRechazar.addEventListener("click", async () => {
  if (!confirm("¿El cliente rechazó la cotización?")) return;

  const { error } = await supabase
    .from("cotizaciones")
    .update({ estado: "rechazada_cliente" })
    .eq("id", id);

  if (error) {
    alert("Error al marcar como rechazada");
    return;
  }

  alert("Cotización marcada como rechazada ❌");
  window.location.href = "Control de Cotizaciones.html";
});

cargarDetalle();
``