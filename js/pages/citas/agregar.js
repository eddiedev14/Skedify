import { configureActionForm, sendForm, showSelectRecords, validateInput } from "../../modules/funciones.js";
import { clientInput, form, serviceInput } from "../../modules/selectores.js";

document.addEventListener("DOMContentLoaded", () => {
    showSelectRecords();
    configureActionForm("appointments");
})

//* Selectores Específicos
const fechaInput = document.querySelector("#fecha");

//* Eventos
form.addEventListener("submit", (e) => sendForm(e, "appointments"))
clientInput.addEventListener("blur", validateInput)
serviceInput.addEventListener("blur", validateInput)
fechaInput.addEventListener("blur", validateInput)