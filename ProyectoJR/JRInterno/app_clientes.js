import { supabase } from "./supabase.js";


const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  window.location.href = "../login.html";
}

//****************************************
// Referencias a elementos del DOM
//****************************************
// Botones
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");
const btnLoad = document.getElementById("btnLoad");

// Campo de búsqueda
const txtSearch = document.getElementById("txtSearch");

// Formulario

const txtEmpresa = document.getElementById("txtEmpresa");
const txtRepresentante = document.getElementById("txtRepresentante");
const txtCorreo = document.getElementById("txtCorreo");
const txtTelefono = document.getElementById("txtTelefono");
const txtDireccion = document.getElementById("txtDireccion");
const txtFechaInicio = document.getElementById("txtFechaInicio");


// Tabla
const tbody = document.getElementById("tbodyClientes");


window.onload = () => {
  consultarClientes();
};



btnAdd.addEventListener("click", () => guardarCliente());
btnCancel.addEventListener("click", () => limpiarFormulario());
btnLoad.addEventListener("click", () => consultarClientes())

async function guardarCliente() {
  if (!txtEmpresa.value || !txtRepresentante.value || !txtCorreo.value) {
    alert("Complete los campos obligatorios");
    return;
  }

  const { error } = await supabase
    .from("clientes")
    .insert([{
      empresa: txtEmpresa.value,
      representante: txtRepresentante.value,
      correo: txtCorreo.value,
      telefono: txtTelefono.value,
      direccion: txtDireccion.value,
      fecha_inicio: txtFechaInicio.value
    }]);

  if (error) {
    console.error(error);
    alert("Error al guardar cliente");
    return;
  }

  alert("Cliente guardado correctamente");
  limpiarFormulario();
  consultarClientes();
}

async function consultarClientes() {
  const search = txtSearch.value?.toLowerCase() || "";

  let query = supabase.from("clientes").select("*").order("empresa");

  if (search) {
    query = query.or(
      `empresa.ilike.%${search}%,representante.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    alert("Error al consultar clientes");
    return;
  }

  renderClientes(data);
}

function renderClientes(clientes) {
  tbody.innerHTML = "";

  clientes.forEach(cliente => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${cliente.empresa}</td>
      <td>${cliente.representante}</td>
      <td>${cliente.correo}</td>
      <td>${cliente.telefono ?? ""}</td>
      <td>
        <button class="btn btnEliminar" data-id="${cliente.id}">
          Eliminar
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

tbody.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("btnEliminar")) return;

  const id = e.target.dataset.id;

  if (!confirm("¿Eliminar cliente?")) return;

  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Error al eliminar cliente");
    return;
  }

  consultarClientes();
});

function limpiarFormulario() {
  txtEmpresa.value = "";
  txtRepresentante.value = "";
  txtCorreo.value = "";
  txtTelefono.value = "";
  txtDireccion.value = "";
  txtFechaInicio.value = "";
}
