import { sendForm, validateInput } from "../../modules/funciones.js";
import { form } from "../../modules/selectores.js";
import DB from "../../modules/classes/DB.js";

//* Selectores Específicos
const nameInput = document.querySelector("#name");
const descriptionInput = document.querySelector("#description");
const priceInput = document.querySelector("#price");

//* Eventos
form.addEventListener("submit", (e) => sendForm(e, () => DB.addRegister("services")))
nameInput.addEventListener("blur", validateInput)
descriptionInput.addEventListener("blur", validateInput)
priceInput.addEventListener("blur", validateInput)