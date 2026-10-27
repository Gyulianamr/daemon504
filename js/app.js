// app.js: arranque y navegación entre vistas.
// Las demás vistas llaman a mostrarVista("vista-xxx") para cambiar de pantalla.

const VISTAS = [
  "vista-acceso",
  "vista-personaje",
  "vista-exploracion",
  "vista-combate",
  "vista-equipo",
  "vista-inventario"
];

function mostrarVista(idVista) {
  if (!VISTAS.includes(idVista)) {
    console.error(`La vista "${idVista}" no existe.`);
    return;
  }
  VISTAS.forEach((id) => {
    document.getElementById(id).classList.toggle("oculta", id !== idVista);
  });
  console.log(`Vista actual: ${idVista}`);
}

// Botones de la barra de navegación
document.querySelectorAll("#barra-nav button").forEach((boton) => {
  boton.addEventListener("click", () => mostrarVista(boton.dataset.vista));
});

// Vista inicial
mostrarVista("vista-acceso");