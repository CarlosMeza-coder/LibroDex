import { obtenerFavoritos, alternarFavorito } from "./favoritos.js";
import { mostrarAvisoFavorito } from "./alertas.js";

const API_AUTORES = "api/autores.php";

export function crearTarjetaAutor(
  autor,
  favoritosGuardados = obtenerFavoritos(),
) {
  const li = document.createElement("li");
  li.className = "autor-tarjeta";

  const esFavorito = favoritosGuardados.includes(autor.id);

  li.innerHTML = `
    <article>
      <div class="autor-tarjeta__foto" aria-hidden="true">${autor.iniciales}</div>
      <h3>${autor.nombre}</h3>
      <p class="autor-tarjeta__datos">${autor.datos}</p>
      <p class="autor-tarjeta__insignia">${autor.insignia}</p>
      
      <button type="button" class="btn-favorito" data-id="${autor.id}">
        ${esFavorito ? "En Favoritos" : "Agregar a Favoritos"}
      </button>

      <div style="margin-top: 8px; display: flex; gap: 6px; justify-content: center;">
        <button type="button" class="btn-editar">Editar</button>
        <button type="button" class="btn-eliminar">Eliminar</button>
      </div>

      <div class="autor-tarjeta__estanteria" aria-hidden="true">
        <span class="autor-tarjeta__lomo"></span>
        <span class="autor-tarjeta__lomo"></span>
        <span class="autor-tarjeta__lomo"></span>
      </div>
    </article>
  `;

  const btnFav = li.querySelector(".btn-favorito");
  btnFav.addEventListener("click", () => {
    const ahoraEsFavorito = alternarFavorito(autor.id);
    btnFav.textContent = ahoraEsFavorito
      ? "En Favoritos"
      : "Agregar a Favoritos";
    mostrarAvisoFavorito(autor.nombre, ahoraEsFavorito);
  });

  const btnEditar = li.querySelector(".btn-editar");
  btnEditar.addEventListener("click", async () => {
    const nuevoNombre = prompt("Nombre del autor:", autor.nombre);
    if (nuevoNombre === null) return;

    const nuevosDatos = prompt("País y época:", autor.datos);
    if (nuevosDatos === null) return;

    const nuevaInsignia = prompt("Insignia de obra:", autor.insignia);
    if (nuevaInsignia === null) return;

    try {
      const actualizado = await actualizarAutor(autor.id, {
        nombre: nuevoNombre.trim(),
        iniciales: autor.iniciales,
        datos: nuevosDatos.trim(),
        insignia: nuevaInsignia.trim(),
      });

      autor = actualizado;
      li.querySelector("h3").textContent = actualizado.nombre;
      li.querySelector(".autor-tarjeta__datos").textContent = actualizado.datos;
      li.querySelector(".autor-tarjeta__insignia").textContent =
        actualizado.insignia;
    } catch (error) {
      alert(error.message);
    }
  });

  const btnEliminar = li.querySelector(".btn-eliminar");
  btnEliminar.addEventListener("click", async () => {
    if (!confirm(`¿Eliminar a ${autor.nombre} de la base de datos?`)) return;

    try {
      await eliminarAutor(autor.id);
      li.remove();
    } catch (error) {
      alert(error.message);
    }
  });

  return li;
}

export async function cargarAutores() {
  const contenedor = document.getElementById("listaAutores");
  if (!contenedor) return;

  contenedor.innerHTML = `<p class="mensaje-estado">Cargando archivo canónico...</p>`;

  try {
    const respuesta = await fetch(API_AUTORES);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const autores = await respuesta.json();
    const favoritosGuardados = obtenerFavoritos();

    contenedor.innerHTML = "";

    autores.forEach((autor) => {
      contenedor.appendChild(crearTarjetaAutor(autor, favoritosGuardados));
    });
  } catch (error) {
    console.error("Fallo al cargar la API de autores:", error);
    contenedor.innerHTML = `
      <p class="mensaje-error">
        No se pudo cargar el catálogo de autores desde MySQL.
      </p>
    `;
  }
}

export async function crearAutor(payload) {
  const respuesta = await fetch(API_AUTORES, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const datos = await respuesta.json();
  if (!respuesta.ok)
    throw new Error(datos.error || `Error HTTP ${respuesta.status}`);
  return datos;
}

export async function actualizarAutor(id, payload) {
  const respuesta = await fetch(`${API_AUTORES}?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const datos = await respuesta.json();
  if (!respuesta.ok)
    throw new Error(datos.error || `Error HTTP ${respuesta.status}`);
  return datos;
}

export async function eliminarAutor(id) {
  const respuesta = await fetch(`${API_AUTORES}?id=${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json();
    throw new Error(datos.error || `Error HTTP ${respuesta.status}`);
  }
}
