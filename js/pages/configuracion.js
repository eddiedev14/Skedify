import { form, modalBtn, modalCancelBtn, modalCloseBtn, modalMain, modalSubmitBtn } from "../modules/selectores.js";
import { sendForm, validateForm, validateInput } from "../modules/funciones.js";
import { closeModal, openModal, selectAvatar } from "../modules/components/Modal.js";
import LocalStorage from "../modules/classes/LocalStorage.js";
import UI from "../modules/classes/UI.js";

//* Selectores Específicos
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");

//* Eventos

document.addEventListener("DOMContentLoaded", UI.showFormUserInfo)

//Modal
modalBtn.addEventListener("click", openModal);
modalMain.addEventListener("click", selectAvatar)
modalCloseBtn.addEventListener("click", closeModal);
modalCancelBtn.addEventListener("click", closeModal);
modalSubmitBtn.addEventListener("click", LocalStorage.updateAvatar)

//Form
form.addEventListener("submit", (e) => sendForm(e, LocalStorage.updateProfile))
nameInput.addEventListener("blur", validateInput)
emailInput.addEventListener("blur", validateInput)
phoneInput.addEventListener("blur", validateInput)