import { calendar, modalCancelBtn, modalCloseBtn, nextMonthBtn, previousMonthBtn } from "../../modules/selectores.js";
import { getAppointments } from "../../modules/funciones.js";
import { closeModal } from "../../modules/components/Modal.js";
import { displayAppointmentsInCalendar, loadAppointmentsModal, renderCalendar, setMonth } from "../../modules/components/Calendar.js";

document.addEventListener("DOMContentLoaded", () => {
    renderCalendar();
    getAppointments(displayAppointmentsInCalendar)
})

previousMonthBtn.addEventListener("click", () => setMonth(-1))
nextMonthBtn.addEventListener("click", () => setMonth(1))

calendar.addEventListener("click", loadAppointmentsModal);
modalCloseBtn.addEventListener("click", closeModal);
modalCancelBtn.addEventListener("click", closeModal)