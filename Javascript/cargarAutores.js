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
        No se pudo cargar el catálogo de autores desde la API. Verifica que Apache esté encendido.
      </p>
    `;
  }
}

export async function crearAutor(payload) {
  const respuesta = await fetch(API_AUTORES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || `Error HTTP ${respuesta.status}`);
  }

  return datos;
}
