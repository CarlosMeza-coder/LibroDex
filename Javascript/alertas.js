import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

export function mostrarAvisoFavorito(nombreAutor, fueAgregado) {
  const esOscuro = document.body.classList.contains("oscuro");

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: fueAgregado ? "success" : "info",
    title: fueAgregado
      ? `${nombreAutor} añadido al archivo favorito`
      : `${nombreAutor} retirado de favoritos`,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
    background: esOscuro ? "#1f1c18" : "#fcfaf6",
    color: esOscuro ? "#f5efe6" : "#2c241b",
    iconColor: fueAgregado ? "#d4a359" : "#3a5a40",
    customClass: {
      popup: "librodex-toast",
    },
  });
}
