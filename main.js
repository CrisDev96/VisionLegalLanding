function sendMail() {
  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const emailUser = document.getElementById("email-user").value.trim();
  const numberUser = document.getElementById("number-user").value.trim();
  const serviceRequired = document.getElementById("service-required").value;
  const message = document.getElementById("message").value.trim();

  // Función auxiliar para mostrar un error bajo un campo
  const showError = (id, msg) => {
    const errorEl = document.getElementById(`error-${id}`);
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.remove("hidden");
    }
  };

  // Ocultar todos los mensajes de error previos
  document.querySelectorAll("[id^='error-']").forEach(el => {
    el.classList.add("hidden");
    el.textContent = "";
  });

  // Expresiones regulares para validación
  // Permite letras (incluyendo acentos y la ñ) y espacios
  const nameRegex = /^[A-Za-zÁ-ÿñÑ\s]+$/;
  // Validación básica de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Validación de número de contacto (solo números)
  const phoneRegex = /^[0-9]+$/;

  let hasError = false;

  // Realizar validaciones
  if (!firstName || !nameRegex.test(firstName)) {
    showError("first-name", "Ingresa un nombre válido (solo letras).");
    hasError = true;
  }

  if (!lastName || !nameRegex.test(lastName)) {
    showError("last-name", "Ingresa un apellido válido (solo letras).");
    hasError = true;
  }

  if (!emailUser || !emailRegex.test(emailUser)) {
    showError("email-user", "Ingresa un correo electrónico válido.");
    hasError = true;
  }

  if (!numberUser || !phoneRegex.test(numberUser)) {
    showError("number-user", "Ingresa un número de contacto válido (solo números).");
    hasError = true;
  }

  if (serviceRequired === "Selecciona un servicio..." || serviceRequired === "") {
    showError("service-required", "Selecciona un servicio válido de la lista.");
    hasError = true;
  }

  // Validar reCAPTCHA Enterprise Checkbox
  let captchaResponse = "";
  if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) {
    captchaResponse = grecaptcha.enterprise.getResponse();
  } else {
    console.warn("reCAPTCHA Enterprise no está cargado.");
  }

  if (!captchaResponse) {
    showError("captcha", "Por favor, completa el reCAPTCHA.");
    hasError = true;
  }

  if (hasError) {
    return; // Detener el envío si hay errores
  }

  let params = {
    firstName: firstName,
    lastName: lastName,
    emailUser: emailUser,
    numberUser: numberUser,
    serviceRequired: serviceRequired,
    message: message,
    'g-recaptcha-response': captchaResponse
  };

  const submitBtn = document.getElementById("submit-btn");
  const successMsg = document.getElementById("form-success-message");
  const errorMsg = document.getElementById("form-error-message");

  // Ocultar mensajes de estado al iniciar un nuevo intento de envío
  if (successMsg) successMsg.classList.add("hidden");
  if (errorMsg) errorMsg.classList.add("hidden");

  // Cambiar estado del botón a "Enviando" temporalmente
  submitBtn.textContent = "Enviando...";
  submitBtn.disabled = true;
  submitBtn.classList.add("opacity-70", "cursor-not-allowed");

  // Enviar el formulario a EmailJS usando las variables cargadas desde el config.yaml
  emailjs.send(window.appConfig.emailJSService, window.appConfig.emailJSTemplate, params)
    .then((response) => {
      // Ocultar error por si acaso y mostrar el mensaje de éxito en la interfaz
      if (errorMsg) errorMsg.classList.add("hidden");
      if (successMsg) {
        successMsg.classList.remove("hidden");
        // Ocultar el mensaje automáticamente despues de 3 segundos
        setTimeout(() => {
          successMsg.classList.add("hidden");
        }, 3000);
      }
      
      // Limpiar los datos del formulario
      document.getElementById("contact-form").reset();
      if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) {
        grecaptcha.enterprise.reset();
      }
    })
    .catch((error) => {
      console.error("Error al enviar:", error);
      // Mostrar el mensaje de error en la interfaz
      if (errorMsg) errorMsg.classList.remove("hidden");
      if (successMsg) successMsg.classList.add("hidden");
      if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) {
        grecaptcha.enterprise.reset();
      }
    })
    .finally(() => {
      // Restaurar el botón independientemente del resultado
      submitBtn.textContent = "Enviar Mensaje";
      submitBtn.disabled = false;
      submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
    });
}
