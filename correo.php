<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $correo = $_POST["correo"];
    $telefono = $_POST["telefono"];
    $direccion = $_POST["direccion"];
    $servicio = $_POST["servicio"];
    $descripcion = $_POST["descripcion"];
    $fecha = $_POST["fecha"];

    // Mensaje de confirmación para el cliente
    $asunto = "Confirmación de Cotización - JR Electricidad";
    $mensaje = "Hola $nombre,\n\nHemos recibido su solicitud de cotización.\n".
               "Detalles:\n".
               "Teléfono: $telefono\n".
               "Dirección: $direccion\n".
               "Servicio: $servicio\n".
               "Descripción: $descripcion\n".
               "Fecha deseada: $fecha\n\n".
               "Nos pondremos en contacto con usted pronto.\n\nJR Electricidad S.R.L";

    $headers = "From: jrelectricidadsrl@gmail.com";

    // Envía el correo al cliente
    mail($correo, $asunto, $mensaje, $headers);

    echo "Cotización enviada y correo de confirmación enviado.";
}
?>

