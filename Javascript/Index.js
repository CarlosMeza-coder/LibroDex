import {
  cargarAutores,
  crearAutor,
  crearTarjetaAutor,
} from "./cargarAutores.js";

const btnMenu = document.getElementById("btnMenu");
const nav = document.getElementById("nav");
const btnTema = document.getElementById("btnTema");
const buscador = document.getElementById("buscador");
const formNuevoAutor = document.getElementById("formNuevoAutor");
const mensajeFormAutor = document.getElementById("mensajeFormAutor");
const listaAutores = document.getElementById("listaAutores");

cargarAutores();

btnMenu.addEventListener("click", () => {
  nav.classList.toggle("abierto");
});

btnTema.addEventListener("click", () => {
  document.body.classList.toggle("oscuro");
});

buscador.addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase();

  document.querySelectorAll(".autor-tarjeta").forEach((t) => {
    const coincide = t.textContent.toLowerCase().includes(texto);
    t.hidden = !coincide;
  });
});

if (formNuevoAutor) {
  formNuevoAutor.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensajeFormAutor.textContent = "Guardando autor en el archivo...";
    mensajeFormAutor.style.color = "";

    const formData = new FormData(formNuevoAutor);
    const payload = {
      nombre: formData.get("nombre").trim(),
      iniciales: formData.get("iniciales").trim(),
      datos: formData.get("datos").trim(),
      insignia: formData.get("insignia").trim(),
    };

    try {
      const nuevoAutor = await crearAutor(payload);

      if (listaAutores) {
        listaAutores.appendChild(crearTarjetaAutor(nuevoAutor));
      }

      formNuevoAutor.reset();
      mensajeFormAutor.textContent = `Autor "${nuevoAutor.nombre}" archivado con ID #${nuevoAutor.id}.`;
      mensajeFormAutor.style.color = "#4caf50";
    } catch (error) {
      mensajeFormAutor.textContent = error.message;
      mensajeFormAutor.style.color = "#ff6b6b";
    }
  });
}
