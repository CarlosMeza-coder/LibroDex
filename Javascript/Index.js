import { cargarAutores } from "./cargarAutores.js";

const btnMenu = document.getElementById("btnMenu");
const nav = document.getElementById("nav");
const btnTema = document.getElementById("btnTema");
const buscador = document.getElementById("buscador");

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
