document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submit-btn');

  submitBtn.addEventListener('click', () => {
    // Utilizamos el código que sugeriste, pero lo ampliamos para incluir
    // no solo 'input', sino también 'select' y 'textarea' dentro de tu formulario.
    const formValues = Array.from(document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea'))
      .reduce((acc, input) => ({ ...acc, [input.id]: input.value }), {});

    // Muestra los valores obtenidos en la consola
    console.log("Valores obtenidos del form:", formValues);
    
    // Mostramos una alerta en pantalla para confirmar que está funcionando y obtener visualmente los datos
    alert(JSON.stringify(formValues, null, 2));
  });
});
