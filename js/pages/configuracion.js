import { closeModal, openModal, selectAvatar } from "../modules/components/modal.js";
import { modalBtn, modalCancelBtn, modalCloseBtn, modalMain } from "../modules/selectores.js";

modalBtn.addEventListener("click", openModal);
modalMain.addEventListener("click", selectAvatar)
modalCloseBtn.addEventListener("click", closeModal);
modalCancelBtn.addEventListener("click", closeModal);