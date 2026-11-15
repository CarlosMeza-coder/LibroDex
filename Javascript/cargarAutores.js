import { obtenerFavoritos, alternarFavorito } from "./favoritos.js";
import { mostrarAvisoFavorito } from "./alertas.js";

export async function cargarAutores() {
  const contenedor = document.getElementById("listaAutores");
  if (!contenedor) return;

  contenedor.innerHTML = `<p class="mensaje-estado">Cargando archivo canónico...</p>`;

  try {
    const respuesta = await fetch("data/autores.json");

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const autores = await respuesta.json();
    const favoritosGuardados = obtenerFavoritos();

    contenedor.innerHTML = "";

    autores.forEach((autor) => {
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

      contenedor.appendChild(li);
    });
  } catch (error) {
    console.error("Fallo al cargar el JSON de autores:", error);
    contenedor.innerHTML = `
      <p class="mensaje-error">
        No se pudo cargar el catálogo de autores en este momento. Intenta recargar la página.
      </p>
    `;
  }
}
