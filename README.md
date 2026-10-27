# DAEMON 504: Guardianes del Umbral

Aventura web de exploración, captura y combate por turnos.
**ISC-305 Programación Web · III PAC 2026 · Ing. Claudio Paz**

## Historia

Humanos y daemons convivían en paz gracias a unos santuarios antiguos. Los sellos se debilitaron y los caminos se volvieron peligrosos. El jugador, un aprendiz guardián, recibe su primer daemon y viaja para restaurar los santuarios.

## Equipo

| Integrante | Rol principal |


## Estado del proyecto

| Avance | Contenido | Estado |
|---|---|---|
| 1 | Concepto y diseño | Entregado |
| 2 | Prototipo Front-End (datos simulados) | En desarrollo |
| 3 | Back-End y persistencia | Pendiente |
| 4 | Integración Front-End / API propia | Pendiente |
| 5 | Seguridad y cierre | Pendiente |

## Cómo ejecutar el proyecto

1. Clonar el repositorio: `git clone https://github.com/USUARIO/daemon504.git`
2. Abrir la carpeta en **VS Code**.
3. Instalar la extensión **Live Server**.
4. Clic derecho sobre `index.html` → *Open with Live Server*.

> No abrir `index.html` con doble clic: `fetch` no puede leer los archivos JSON sin un servidor local.

## Estructura de carpetas

```
daemon504/
├── index.html
├── css/
│   ├── styles.css          estilos generales
│   └── responsive.css      media queries
├── js/
│   ├── app.js              arranque y navegación entre vistas
│   ├── estado.js           estado del jugador (localStorage)
│   ├── api.js              capa de acceso: hoy simulada, luego fetch real
│   └── vistas/
│       ├── acceso.js
│       ├── personaje.js
│       ├── exploracion.js
│       ├── combate.js
│       ├── equipo.js
│       └── inventario.js
├── data/
│   ├── zonas.json
│   ├── especies.json
│   └── objetos.json
└── README.md
```

## Estrategia de ramas

```
main        protegida; solo versiones estables (una por avance)
 └── dev    integración; aquí se une y prueba todo
      ├── feature/acceso
      ├── feature/combate
      └── fix/validacion-correo
```

### Reglas

- Nadie hace commit directo en `main` ni en `dev`.
- Cada tarea tiene su propia rama, creada desde `dev`, y se borra después de unirla.
- Todo Pull Request va hacia `dev` y necesita la revisión de otra persona.
- Antes de pedir revisión, probar el proyecto con Live Server.
- Al cerrar un avance: Pull Request de `dev` a `main` y una etiqueta (por ejemplo `v0.2-avance2`).

### Prefijos de ramas

| Prefijo | Uso | Ejemplo |
|---|---|---|
| `feature/` | Funcionalidad nueva | `feature/vista-combate` |
| `fix/` | Corrección de un error | `fix/validacion-correo` |
| `docs/` | Documentación | `docs/readme` |

### Flujo diario

```
git checkout dev
git pull origin dev
git checkout -b feature/vista-combate

# trabajar, y cada cierto tiempo:
git add .
git commit -m "Agrega barras de salud en la vista de combate"
git push origin feature/vista-combate
```

Luego abrir un Pull Request en GitHub de `feature/vista-combate` hacia `dev`.

Si `dev` cambió mientras trabajabas:

```
git checkout dev
git pull origin dev
git checkout feature/vista-combate
git merge dev
```

### Mensajes de commit

Cortos, en presente y específicos.

- Bien: `Agrega validación del formulario de acceso`
- Mal: `cambios`, `arreglos`, `listo`

## Contratos entre integrantes

Estos acuerdos evitan que el trabajo no encaje al unirlo. **Cualquier cambio se avisa al grupo y se actualiza aquí.**

### IDs de las vistas (HTML)

| Vista | id de la sección |
|---|---|
| Acceso | `vista-acceso` |
| Creación de personaje | `vista-personaje` |
| Exploración | `vista-exploracion` |
| Combate | `vista-combate` |
| Equipo | `vista-equipo` |
| Inventario | `vista-inventario` |

La navegación muestra una vista y oculta las demás (clase `oculta`).

### Formato de `data/zonas.json`

```json
[
  {
    "id": "pradera",
    "nombre": "Pradera Misteriosa",
    "tipo": "explorable",
    "descripcion": "Una brisa recorre la pradera...",
    "conexiones": ["valle", "bosque"],
    "requisito": null,
    "eventos": { "nada": 50, "encuentro": 40, "objeto": 10 },
    "apariciones": [
      { "especie": "brotin", "prob": 40 },
      { "especie": "pelusan", "prob": 35 },
      { "especie": "chispin", "prob": 20 },
      { "especie": "auralis", "prob": 5 }
    ]
  },
  {
    "id": "bosque",
    "nombre": "Bosque del Guerrero",
    "tipo": "explorable",
    "conexiones": ["pradera", "lago"],
    "requisito": { "tipo": "combates_ganados", "valor": 3 }
  }
]
```

- `tipo`: `localidad` o `explorable`.
- `requisito`: `null` si está abierta, o un objeto como `{ "tipo": "guardian", "valor": "guardian_bosque" }`.
- Las probabilidades de cada lista suman 100.

### Formato de `data/especies.json`

```json
[
  {
    "id": "brotin",
    "nombre": "Brotín",
    "tipo": "Planta",
    "hp": 40,
    "ataque": 12,
    "defensa": 8,
    "tasa_captura": 0.6,
    "movimientos": [
      { "nombre": "Embestida", "poder": 1.0 },
      { "nombre": "Latigazo", "poder": 1.4 }
    ]
  }
]
```

### Formato de `data/objetos.json`

```json
[
  { "id": "orbe", "nombre": "Orbe de captura", "descripcion": "Sirve para intentar capturar un daemon.", "efecto": "captura" },
  { "id": "pocion", "nombre": "Poción", "descripcion": "Recupera 20 HP.", "efecto": "curar", "valor": 20 }
]
```

### Funciones de `js/api.js`

Hoy devuelven resultados simulados; en el Avance 4 se reemplaza su contenido por `fetch` al servidor. **Las vistas solo llaman a estas funciones** y nunca calculan reglas por su cuenta. Todas son `async` y devuelven un objeto con `ok` (true o false) y `mensaje` cuando hay error.

| Función | Recibe | Devuelve |
|---|---|---|
| `iniciarSesion(correo, clave)` | texto, texto | `{ ok, usuario }` |
| `registrar(correo, clave)` | texto, texto | `{ ok, usuario }` |
| `crearPersonaje(nombre, especieInicialId)` | texto, id | `{ ok, personaje }` |
| `obtenerPersonaje()` | nada | `{ ok, personaje }` |
| `obtenerZona()` | nada | `{ ok, zona, destinos }` |
| `mover(zonaId)` | id | `{ ok, zona }` |
| `explorar()` | nada | `{ ok, evento, encuentro?, objeto? }` |
| `atacar(encuentroId, movimiento)` | id, texto | `{ ok, log, encuentro }` |
| `capturar(encuentroId)` | id | `{ ok, capturado, log }` |
| `escapar(encuentroId)` | id | `{ ok, escapo, log }` |
| `obtenerEquipo()` | nada | `{ ok, equipo, reserva }` |
| `moverDaemon(id, destino)` | id, `equipo` o `reserva` | `{ ok }` |
| `obtenerInventario()` | nada | `{ ok, objetos }` |
| `usarObjeto(objetoId, daemonId)` | id, id | `{ ok, log }` |
| `curar()` | nada | `{ ok }` |
| `obtenerHistorial()` | nada | `{ ok, eventos }` |

## Reglas de negocio (resumen)

- Equipo activo máximo de 6 daemons; el excedente va a la reserva.
- Solo se puede viajar a zonas conectadas y desbloqueadas.
- Solo se pueden usar objetos que existan en el inventario.
- Solo se captura un daemon de un encuentro activo.
- Exploración: 50 % nada, 40 % encuentro, 10 % objeto (definido en `zonas.json`).
- Daño: `max(1, ataque × poder − defensa / 2)` × factor aleatorio entre 0.85 y 1.
- Captura: `prob = tasa_captura × (1.5 − HP_actual / HP_máximo)`, limitada entre 5 % y 95 %.
- Escape: 60 %. Derrota: regresa a la última localidad con el equipo curado y sin perder bytes.
- Inicio del jugador: 5 Orbes, 3 Pociones y 100 bytes.

> Las probabilidades y números viven en los JSON o en constantes, no dispersos en el código de las vistas.

## Criterios del Avance 2

- [ ] Registro, personaje y daemon inicial.
- [ ] Moverse entre zonas; una zona bloqueada se rechaza.
- [ ] Explorar produce sin evento, encuentro u objeto.
- [ ] Combatir, capturar y escapar.
- [ ] Equipo máximo de 6 e inventario que descuenta objetos.
- [ ] Interfaz responsive en celular y computadora.
- [ ] Progreso conservado al recargar la página.
- [ ] Commits de todos los integrantes en el repositorio.
