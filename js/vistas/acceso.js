// acceso.js: vista de Acceso (inicio de sesión y registro).
// Usa las funciones de api.js: iniciarSesion, registrar, obtenerPersonaje.
// Las reglas reales las validará el servidor; aquí solo se valida el formato.

const formAcceso = document.querySelector("#form-acceso");
const mensajeAcceso = document.querySelector("#acceso-mensaje");
const botonRegistrar = document.querySelector("#btn-registrar");

function validarAcceso(correo, clave) {
  const errores = [];
  const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formatoCorreo.test(correo)) {
    errores.push("Ingrese un correo válido.");
  }
  if (clave.length < 6) {
    errores.push("La contraseña debe tener al menos 6 caracteres.");
  }
  return errores;
}

function leerCamposAcceso() {
  return {
    correo: document.querySelector("#acceso-correo").value.trim(),
    clave: document.querySelector("#acceso-clave").value
  };
}

function mostrarMensajeAcceso(texto) {
  mensajeAcceso.textContent = texto;
}

// Inicio de sesión
formAcceso.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { correo, clave } = leerCamposAcceso();

  const errores = validarAcceso(correo, clave);
  if (errores.length > 0) {
    mostrarMensajeAcceso(errores.join(" "));
    return;
  }

  const resultado = await iniciarSesion(correo, clave);
  if (!resultado.ok) {
    mostrarMensajeAcceso(resultado.mensaje || "No se pudo iniciar sesión.");
    return;
  }

  mostrarMensajeAcceso("");
  // Si ya tiene personaje va a explorar; si no, a crearlo
  const personaje = await obtenerPersonaje();
  mostrarVista(personaje.ok && personaje.personaje ? "vista-exploracion" : "vista-personaje");
});

// Registro
botonRegistrar.addEventListener("click", async () => {
  const { correo, clave } = leerCamposAcceso();

  const errores = validarAcceso(correo, clave);
  if (errores.length > 0) {
    mostrarMensajeAcceso(errores.join(" "));
    return;
  }

  const resultado = await registrar(correo, clave);
  if (!resultado.ok) {
    mostrarMensajeAcceso(resultado.mensaje || "No se pudo completar el registro.");
    return;
  }

  mostrarMensajeAcceso("");
  mostrarVista("vista-personaje");
});