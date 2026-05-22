function sendMail() {
  // Verificar que la configuración esté disponible
  if (!window.__CONFIG) {
    console.error('Configuración no disponible');
    const errorMsg = document.getElementById("form-error-message");
    if (errorMsg) {
      errorMsg.classList.remove("hidden");
      setTimeout(() => errorMsg.classList.add("hidden"), 3000);
    }
    return;
  }

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
  const nameRegex = /^[A-Za-zÁ-ÿñÑ\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]+$/;

  let hasError = false;

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

  // Validar reCAPTCHA
  let captchaResponse = "";
  if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) {
    captchaResponse = grecaptcha.enterprise.getResponse();
  }

  if (!captchaResponse) {
    showError("captcha", "Por favor, completa el reCAPTCHA.");
    hasError = true;
  }

  if (hasError) {
    return;
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

  if (successMsg) successMsg.classList.add("hidden");
  if (errorMsg) errorMsg.classList.add("hidden");

  submitBtn.textContent = "Enviando...";
  submitBtn.disabled = true;
  submitBtn.classList.add("opacity-70", "cursor-not-allowed");

  // Usar la configuración desde window.__CONFIG
  emailjs.send(window.__CONFIG.emailJSService, window.__CONFIG.emailJSTemplate, params)
    .then((response) => {
      if (errorMsg) errorMsg.classList.add("hidden");
      if (successMsg) {
        successMsg.classList.remove("hidden");
        setTimeout(() => {
          successMsg.classList.add("hidden");
        }, 3000);
      }
      
      document.getElementById("contact-form").reset();
      if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) {
        grecaptcha.enterprise.reset();
      }
    })
    .catch((error) => {
      console.error("Error al enviar:", error);
      if (errorMsg) errorMsg.classList.remove("hidden");
      if (successMsg) successMsg.classList.add("hidden");
      if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) {
        grecaptcha.enterprise.reset();
      }
    })
    .finally(() => {
      submitBtn.textContent = "Enviar Mensaje";
      submitBtn.disabled = false;
      submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
    });
}