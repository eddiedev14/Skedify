import { modalAppointmentSubmitBtn, modalCancelBtn, modalCloseBtn, table } from "../../modules/selectores.js";
import { getAppointments, setTableEventsListeners } from "../../modules/funciones.js";
import { closeModal } from "../../modules/components/Modal.js";
import DB from "../../modules/classes/DB.js";

//* Eventos
document.addEventListener("DOMContentLoaded", () => getAppointments());
table.addEventListener("click", (e) => setTableEventsListeners(e, "appointments"));

//Modal
modalAppointmentSubmitBtn.addEventListener("click", (e) => DB.updateState(e.target.dataset.id))
modalCloseBtn.addEventListener("click", closeModal);
modalCancelBtn.addEventListener("click", closeModal);