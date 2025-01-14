import { configureActionForm, sendForm, validateInput } from "../../modules/funciones.js";
import { form } from "../../modules/selectores.js";

document.addEventListener("DOMContentLoaded", () => configureActionForm("clients"))

//* Selectores Específicos
const nameInput = document.querySelector("#nombre");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#telefono");

//* Eventos
form.addEventListener("submit", (e) => sendForm(e, "clients"))
nameInput.addEventListener("blur", validateInput)
emailInput.addEventListener("blur", validateInput)
phoneInput.addEventListener("blur", validateInput)