
import { supabase } from "./supabase.js";

//proteccion login
const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  window.location.href = "../login.html";
}

const tbody = document.getElementById("tbodyFacturas");
const btnBuscar = document.getElementById("btnBuscar");

const txtCliente = document.getElementById("txtCliente");
const selectEstado = document.getElementById("selectEstado");
const fechaDesde = document.getElementById("fechaDesde");
const fechaHasta = document.getElementById("fechaHasta");

window.addEventListener("load", () => {
  cargarFacturas();
});

btnBuscar.addEventListener("click", () => {
  cargarFacturas();
});

//  si una factura está vencida
function estaVencida(fechaLimite, estadoPago) {
  if (estadoPago === "pagada") return false;

  const hoy = new Date();
  const limite = new Date(fechaLimite);

  hoy.setHours(0, 0, 0, 0);
  limite.setHours(0, 0, 0, 0);

  return limite < hoy;
}

//  días restantes
function diasRestantes(fechaLimite) {
  const hoy = new Date();
  const limite = new Date(fechaLimite);

  hoy.setHours(0, 0, 0, 0);
  limite.setHours(0, 0, 0, 0);

  const diff = limite - hoy;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

//  facturas (desde trabajos)
async function cargarFacturas() {
  tbody.innerHTML = "";

  let query = supabase
    .from("trabajos")
    .select("*")
    .order("fecha_emision", { ascending: false });

  
  if (txtCliente.value.trim()) {
    query = query.ilike("cliente", `%${txtCliente.value.trim()}%`);
  }

  if (selectEstado.value) {
    query = query.eq("estado_pago", selectEstado.value);
  }

  if (fechaDesde.value) {
    query = query.gte("fecha_emision", fechaDesde.value);
  }

  if (fechaHasta.value) {
    query = query.lte("fecha_emision", fechaHasta.value);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    alert("Error cargando facturas");
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8">No hay resultados</td></tr>`;
    return;
  }

  data.forEach(f => {
    const vencida = estaVencida(f.fecha_limite_pago, f.estado_pago);
    const dias = diasRestantes(f.fecha_limite_pago);

    const tr = document.createElement("tr");

    if (vencida) {
      tr.classList.add("factura-vencida");
    }

    tr.innerHTML = `
      <td>${f.cliente}</td>
      <td>${f.id}</td>
      <td>${f.fecha_emision}</td>
      <td>${f.fecha_limite_pago}</td>
      <td>₡${Number(f.monto).toFixed(2)}</td>
      <td>
        ${vencida
          ? `<span class="badge-vencida">VENCIDA</span>`
          : f.estado_pago}
      </td>
      <td>${vencida ? "0" : dias}</td>
      <td>
        ${f.estado_pago !== "pagada"
          ? `<button class="btn btn-success btnPagar" data-id="${f.id}">Marcar pagada</button>`
          : "✔️"}
      </td>
    `;

    tbody.appendChild(tr);
  });
}

//  factura como pagada
tbody.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("btnPagar")) return;

  const id = e.target.dataset.id;

  if (!confirm("¿Marcar esta factura como pagada?")) return;

  const { error } = await supabase
    .from("trabajos")
    .update({ estado_pago: "pagada" })
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Error al actualizar factura");
    return;
  }

  cargarFacturas();
});
