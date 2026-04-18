
import { supabase } from "./supabase.js";


const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  window.location.href = "../login.html";
}

const tbody = document.getElementById("tbodyCotizaciones");
const btnBuscar = document.getElementById("btnBuscar");
const selectEstado = document.getElementById("selectEstado");


window.addEventListener("load", cargarCotizaciones);
btnBuscar.addEventListener("click", cargarCotizaciones);


async function cargarCotizaciones() {
  tbody.innerHTML = "";

  let query = supabase
    .from("cotizaciones")
    .select("*")
    .order("fecha_solicitud", { ascending: false });

  // filtro solo por estado
  if (selectEstado.value) {
    query = query.eq("estado", selectEstado.value);
  }

  const { data, error } = await query;

  if (error) {
    alert("Error cargando cotizaciones");
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">No hay cotizaciones</td>
      </tr>
    `;
    return;
  }

  data.forEach(c => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${c.nombre_cliente}</td>
      <td>${c.servicio ?? ""}</td>
      <td>${new Date(c.fecha_solicitud).toLocaleDateString()}</td>
      <td>${c.estado}</td>
      <td>
        <a href="Detalle Cotizacion.html?id=${c.id}" class="btn btn-primary">
          Ver cotización
        </a>
      </td>
    `;

    tbody.appendChild(tr);
  });
}
