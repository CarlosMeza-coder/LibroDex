import {
  validarCorreo,
  validarPassword,
  validarNombre,
} from "./validaciones.js";
import {
  mostrarError,
  limpiarError,
  limpiarErroresFormulario,
} from "./mensajes.js";

const btnTabLogin = document.getElementById("btnTabLogin");
const btnTabRegistro = document.getElementById("btnTabRegistro");
const formLogin = document.getElementById("formLogin");
const formRegistro = document.getElementById("formRegistro");

btnTabRegistro.addEventListener("click", () => {
  formLogin.classList.add("oculto");
  formRegistro.classList.remove("oculto");
  limpiarErroresFormulario("formLogin");
});

btnTabLogin.addEventListener("click", () => {
  formRegistro.classList.add("oculto");
  formLogin.classList.remove("oculto");
  limpiarErroresFormulario("formRegistro");
});

formLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const datos = Object.fromEntries(new FormData(evento.target).entries());
  let hayErrores = false;

  const errorCorreo = validarCorreo(datos.correo);
  if (errorCorreo) {
    mostrarError("login-correo", errorCorreo);
    hayErrores = true;
  } else {
    limpiarError("login-correo");
  }

  const errorPassword = validarPassword(datos.password);
  if (errorPassword) {
    mostrarError("login-password", errorPassword);
    hayErrores = true;
  } else {
    limpiarError("login-password");
  }

  if (!hayErrores) {
    console.log("Login exitoso, enviando datos:", datos);
  }
});

formRegistro.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const datos = Object.fromEntries(new FormData(evento.target).entries());
  let hayErrores = false;

  const errorNombre = validarNombre(datos.nombre);
  if (errorNombre) {
    mostrarError("reg-nombre", errorNombre);
    hayErrores = true;
  } else {
    limpiarError("reg-nombre");
  }

  const errorCorreo = validarCorreo(datos.correo);
  if (errorCorreo) {
    mostrarError("reg-correo", errorCorreo);
    hayErrores = true;
  } else {
    limpiarError("reg-correo");
  }

  const errorPassword = validarPassword(datos.password);
  if (errorPassword) {
    mostrarError("reg-password", errorPassword);
    hayErrores = true;
  } else {
    limpiarError("reg-password");
  }

  if (!hayErrores) {
    console.log("Registro exitoso, enviando datos:", datos);
  }
});
