export function validarCorreo(correo) {
  if (!correo || correo.trim() === "") {
    return "El correo es obligatorio.";
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(correo)) {
    return "Ingresa un correo electrónico válido.";
  }
  return "";
}

export function validarPassword(password) {
  if (!password || password.trim() === "") {
    return "La contraseña es obligatoria.";
  }
  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  return "";
}

export function validarNombre(nombre) {
  if (!nombre || nombre.trim() === "") {
    return "El nombre de usuario es obligatorio.";
  }
  return "";
}
