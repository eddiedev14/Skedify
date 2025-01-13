import { configureActionForm, sendForm, validateInput } from "../../modules/funciones.js";
import { form } from "../../modules/selectores.js";

document.addEventListener("DOMContentLoaded", () => configureActionForm("services"))

//* Selectores Específicos
const nameInput = document.querySelector("#name");
const descriptionInput = document.querySelector("#description");
const priceInput = document.querySelector("#price");

//* Eventos
form.addEventListener("submit", (e) => sendForm(e, "services"))
nameInput.addEventListener("blur", validateInput)
descriptionInput.addEventListener("blur", validateInput)
priceInput.addEventListener("blur", validateInput)