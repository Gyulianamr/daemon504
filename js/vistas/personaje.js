// personaje.js: vista de Creación de personaje.
// Lee los daemons iniciales de data/especies.json (los marcados con "inicial": true)
// y crea el personaje con crearPersonaje() de api.js.

const formPersonaje = document.querySelector("#form-personaje");
const contenedorIniciales = document.querySelector("#tarjetas-iniciales");
const mensajePersonaje = document.querySelector("#personaje-mensaje");

function mostrarMensajePersonaje(texto) {
  mensajePersonaje.textContent = texto;
}

// Crea una tarjeta seleccionable (radio + datos de la especie)
function crearTarjetaInicial(especie) {
  const etiqueta = document.createElement("label");
  etiqueta.className = "tarjeta";

  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "especieInicial";
  radio.value = especie.id;

  const titulo = document.createElement("strong");
  titulo.textContent = especie.nombre;

  const tipo = document.createElement("span");
  tipo.textContent = `Tipo: ${especie.tipo}`;

  const stats = document.createElement("span");
  stats.textContent = `HP ${especie.hp} · ATQ ${especie.ataque} · DEF ${especie.defensa}`;

  etiqueta.append(radio, titulo, tipo, stats);
  return etiqueta;
}

async function cargarIniciales() {
  try {
    const respuesta = await fetch("data/especies.json");
    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status}`);
    }
    const especies = await respuesta.json();
    const iniciales = especies.filter((e) => e.inicial === true);

    contenedorIniciales.replaceChildren(...iniciales.map(crearTarjetaInicial));

    if (iniciales.length === 0) {
      mostrarMensajePersonaje("No hay daemons iniciales disponibles.");
    }
  } catch (error) {
    console.error(error);
    mostrarMensajePersonaje("No se pudieron cargar los daemons iniciales.");
  }
}

function validarPersonaje(nombre, especieId) {
  const errores = [];
  if (nombre.length < 3) {
    errores.push("El nombre debe tener al menos 3 caracteres.");
  }
  if (!especieId) {
    errores.push("Elige un daemon inicial.");
  }
  return errores;
}

formPersonaje.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nombre = document.querySelector("#personaje-nombre").value.trim();
  const seleccionado = document.querySelector('input[name="especieInicial"]:checked');
  const especieId = seleccionado ? seleccionado.value : "";

  const errores = validarPersonaje(nombre, especieId);
  if (errores.length > 0) {
    mostrarMensajePersonaje(errores.join(" "));
    return;
  }

  const resultado = await crearPersonaje(nombre, especieId);
  if (!resultado.ok) {
    mostrarMensajePersonaje(resultado.mensaje || "No se pudo crear el personaje.");
    return;
  }

  mostrarMensajePersonaje("");
  mostrarVista("vista-exploracion");
});

cargarIniciales();