const CLAVE_STORAGE = "librodex_favoritos";

export function obtenerFavoritos() {
  const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
  return datosGuardados ? JSON.parse(datosGuardados) : [];
}

export function alternarFavorito(idAutor) {
  let favoritos = obtenerFavoritos();

  if (favoritos.includes(idAutor)) {
    favoritos = favoritos.filter((id) => id !== idAutor);
  } else {
    favoritos.push(idAutor);
  }
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(favoritos));

  return favoritos.includes(idAutor);
}
