import { configureActionForm, sendForm, validateInput } from "../../modules/funciones.js";
import { form } from "../../modules/selectores.js";

document.addEventListener("DOMContentLoaded", () => configureActionForm("services"))

//* Selectores Específicos
const nameInput = document.querySelector("#nombre");
const descriptionInput = document.querySelector("#descripcion");
const priceInput = document.querySelector("#precio");

//* Eventos
form.addEventListener("submit", (e) => sendForm(e, "services"))
nameInput.addEventListener("blur", validateInput)
descriptionInput.addEventListener("blur", validateInput)
priceInput.addEventListener("blur", validateInput)