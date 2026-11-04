export function mostrarError(idInput, mensaje) {
  const spanError = document.getElementById(`error-${idInput}`);

  if (spanError) {
    spanError.textContent = mensaje;
  }
}

export function limpiarError(idInput) {
  const spanError = document.getElementById(`error-${idInput}`);

  if (spanError) {
    spanError.textContent = "";
  }
}

export function limpiarErroresFormulario(idFormulario) {
  const formulario = document.getElementById(idFormulario);

  if (formulario) {
    const spansError = formulario.querySelectorAll(".error-msg");

    spansError.forEach((span) => {
      span.textContent = "";
    });
  }
}
