import { supabase } from "./supabase.js";


const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  window.location.href = "../login.html";
}

// Botones
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");
const btnLoad = document.getElementById("btnLoad");
const txtSearch = document.getElementById("txtSearch");
const txtEmpresa = document.getElementById("txtEmpresa");
const txtRepresentante = document.getElementById("txtRepresentante");
const txtCorreo = document.getElementById("txtCorreo");
const txtTelefono = document.getElementById("txtTelefono");
const txtDireccion = document.getElementById("txtDireccion");
const txtFechaInicio = document.getElementById("txtFechaInicio");
let clienteEditandoId = null;
// Tabla
const tbody = document.getElementById("tbodyClientes");


window.onload = () => {
  consultarClientes();
};



btnAdd.addEventListener("click", () => guardarCliente());
btnCancel.addEventListener("click", () => limpiarFormulario());
btnLoad.addEventListener("click", () => consultarClientes())



async function guardarCliente() {
  btnAdd.disabled = true;

  try {
    if (!txtEmpresa.value || !txtRepresentante.value || !txtCorreo.value) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Complete los campos obligatorios"
      });
      return;
    }

  
    if (clienteEditandoId) {
      const { error } = await supabase
        .from("clientes")
        .update({
          nombre_empresa: txtEmpresa.value,
          representante: txtRepresentante.value,
          correo: txtCorreo.value,
          telefono: txtTelefono.value
        })
        .eq("id", clienteEditandoId);

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Cliente actualizado",
        text: "La información se registró correctamente",
        timer: 1800,
        showConfirmButton: false
      });
    }
    
    else {
      const { error } = await supabase
        .from("clientes")
        .insert([{
          nombre_empresa: txtEmpresa.value,
          representante: txtRepresentante.value,
          correo: txtCorreo.value,
          telefono: txtTelefono.value
        }]);

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Cliente guardado",
        text: "La información se registró correctamente",
        timer: 1800,
        showConfirmButton: false
      });
    }

    limpiarFormulario();
    consultarClientes();

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo completar la operación",
      confirmButtonText: "Aceptar"
    });

  } finally {
    
    btnAdd.disabled = false;
  }
}



async function consultarClientes() {
  const search = txtSearch.value?.toLowerCase() || "";

  let query = supabase.from("clientes").select("*").order("nombre_empresa");

  if (search) {
    query = query.or(
      `nombre_empresa.ilike.%${search}%,representante.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    
Swal.fire({
      icon: "error",
      title: "Error al consultar cliente",
      text: "La información no se consultó",
      confirmButtonText: "Aceptar"
    });

    return;
  }

  renderClientes(data);
}

function renderClientes(clientes) {
  tbody.innerHTML = "";

  if (!clientes || clientes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center">
          No hay clientes registrados
        </td>
      </tr>
    `;
    return;
  }


  clientes.forEach(cliente => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${cliente.nombre_empresa}</td>
      <td>${cliente.representante}</td>
      <td>${cliente.correo}</td>
      <td>${cliente.telefono ?? ""}</td>
      <td>
       <button class="btn btnEditar" data-id="${cliente.id}">Editar</button>
        <button class="btn btnEliminar" data-id="${cliente.id}"> Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}


tbody.addEventListener("click", async (e) => {

  if (e.target.classList.contains("btnEditar")) {
    const id = e.target.dataset.id;

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      
Swal.fire({
      icon: "error",
      title: "Error al cargar cliente",
      text: "La información no se cargó",
      confirmButtonText: "Aceptar"
    });

      return;
    }

    // Cargar datos en el formulario
    txtEmpresa.value = data.nombre_empresa;
    txtRepresentante.value = data.representante;
    txtCorreo.value = data.correo;
    txtTelefono.value = data.telefono ?? "";

    clienteEditandoId = data.id;
    btnAdd.textContent = "Actualizar";
    return;
  }

  if (e.target.classList.contains("btnEliminar")) {
    const id = e.target.dataset.id;

    if (!confirm("¿Eliminar cliente?")) return;

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      
Swal.fire({
      icon: "error",
      title: "Error al eliminar cliente",
      text: "La información no se eliminó",
      confirmButtonText: "Aceptar"
    });

      return;
    }

    consultarClientes();
  }
});


function limpiarFormulario() {
  txtEmpresa.value = "";
  txtRepresentante.value = "";
  txtCorreo.value = "";
  txtTelefono.value = "";
  txtDireccion.value = "";
  txtFechaInicio.value = "";
  clienteEditandoId = null;
  btnAdd.textContent = "Guardar";
}
