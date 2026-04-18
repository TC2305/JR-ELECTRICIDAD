import { supabase } from "./supabase.js";


const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  window.location.href = "../login.html";
}

//****************************************
// Referencias a elementos del DOM
//****************************************
// Botones
const btnClear = document.getElementById("btnClear");
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");
const btnLoad = document.getElementById("btnLoad");

// Campo de búsqueda
const txtSearch = document.getElementById("txtSearch");

// Formulario
const txtId = document.getElementById("txtIdCliente");
const txtEmpresa = document.getElementById("txtEmpresa");
const txtRepresentante = document.getElementById("txtRepresentante");
const txtCorreo = document.getElementById("txtCorreo");
const txtTelefono = document.getElementById("txtTelefono");
const txtDireccion = document.getElementById("txtDireccion");
const txtFechaInicio = document.getElementById("txtFechaInicio");
const txtObservaciones = document.getElementById("txtObservaciones");

// Tabla
const tbody = document.getElementById("tbodyClientes");
const tituloForm = document.getElementById("tituloForm");

//****************************************
// Cargar clientes al iniciar
//****************************************
window.onload = () => {
  consultarClientes();
};

//****************************************
// Eventos
//****************************************
btnLoad.addEventListener("click", async () => consultarClientes());

btnAdd.addEventListener("click", async () => guardarCliente());

btnClear.addEventListener("click", async () => {
  txtSearch.value = "";
  await consultarClientes();
});

btnCancel.addEventListener("click", async () => limpiarFormulario());

// Eliminar cliente
tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEliminar")) return;

