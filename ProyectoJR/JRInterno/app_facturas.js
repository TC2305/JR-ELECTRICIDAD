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

window.addEventListener("load", cargarFacturas);
btnBuscar.addEventListener("click", cargarFacturas);

//  si una factura está vencida
function estaVencida(fecha, estado) {
  if (!fecha || estado === "pagada") return false;
  return new Date(fecha) < new Date().setHours(0,0,0,0);
}

//  días restantes
function diasRestantes(fecha) {
  if (!fecha) return "-";
  const diff = new Date(fecha) - new Date().setHours(0,0,0,0);
  return Math.max(0, Math.ceil(diff / 86400000));
}

//  facturas (desde trabajos)
async function cargarFacturas() {
  tbody.innerHTML = "";

  let query = supabase
    .from("trabajos")
    .select("*")
    .order("fecha_emision", { ascending: false });

  if (txtCliente.value.trim())
    query = query.ilike("cliente", `%${txtCliente.value}%`);

  if (selectEstado.value)
    query = query.eq("estado_pago", selectEstado.value);

  const { data, error } = await query;

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error al cargar las facturas",
      confirmButtonText: "Aceptar"
    });
    return;
  }

  if (!data.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">No hay facturas</td>
      </tr>`;
    return;
  }

  data.forEach(f => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${f.cliente}</td>
      <td>${f.id.slice(0,8)}</td>
      <td>${f.fecha_emision ? new Date(f.fecha_emision).toLocaleDateString() : "-"}</td>
      <td>${f.fecha_limite_pago ? new Date(f.fecha_limite_pago).toLocaleDateString() : "-"}</td>
      <td>₡${f.monto ?? "-"}</td>
      <td>${estaVencida(f.fecha_limite_pago,f.estado_pago) ? "VENCIDA" : f.estado_pago}</td>
      <td>${diasRestantes(f.fecha_limite_pago)}</td>
      <td>
        <button class="btn btnEditar" data-id="${f.id}">Editar</button>
        ${f.estado_pago !== "pagada"
          ? `<button class="btn btn-success btnPagar" data-id="${f.id}">Pagar</button>`
          : "✔️"}
      </td>`;
    tbody.appendChild(tr);
  });
}

//  factura como pagada / editar
tbody.addEventListener("click", async (e) => {

  if (e.target.classList.contains("btnPagar")) {
    const id = e.target.dataset.id;
    await supabase
      .from("trabajos")
      .update({ estado_pago:"pagada" })
      .eq("id", id);

    cargarFacturas();
  }

  if (e.target.classList.contains("btnEditar")) {
    const tr = e.target.closest("tr");
    const id = e.target.dataset.id;

    tr.innerHTML = `
      <td>${tr.children[0].textContent}</td>
      <td>${tr.children[1].textContent}</td>
      <td><input type="date" class="e-fecha-emision"></td>
      <td><input type="date" class="e-fecha-limite"></td>
      <td><input type="number" step="0.01" class="e-monto"></td>
      <td>pendiente</td>
      <td>-</td>
      <td>
        <button class="btn btn-primary btnGuardar" data-id="${id}">Guardar</button>
        <button class="btn btnCancel">Cancelar</button>
      </td>`;
  }

  if (e.target.classList.contains("btnGuardar")) {
    const tr = e.target.closest("tr");
    const id = e.target.dataset.id;

    const fecha_emision = tr.querySelector(".e-fecha-emision").value;
    const fecha_limite_pago = tr.querySelector(".e-fecha-limite").value;
    const monto = tr.querySelector(".e-monto").value;

    if (!fecha_emision || !fecha_limite_pago || !monto) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Complete todos los campos",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    await supabase
      .from("trabajos")
      .update({ fecha_emision, fecha_limite_pago, monto })
      .eq("id", id);

    Swal.fire({
      icon: "success",
      title: "Factura actualizada",
      timer: 1500,
      showConfirmButton: false
    });

    cargarFacturas();
  }

  if (e.target.classList.contains("btnCancel")) {
    cargarFacturas();
  }
});