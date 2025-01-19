import { calendar, modalCancelBtn, modalCloseBtn, nextMonthBtn, previousMonthBtn } from "../../modules/selectores.js";
import { closeModal } from "../../modules/components/Modal.js";
import { loadAppointmentsModal, renderCalendar, setMonth } from "../../modules/components/Calendar.js";

document.addEventListener("DOMContentLoaded", () => renderCalendar())
previousMonthBtn.addEventListener("click", () => setMonth(-1))
nextMonthBtn.addEventListener("click", () => setMonth(1))

calendar.addEventListener("click", loadAppointmentsModal);
modalCloseBtn.addEventListener("click", closeModal);
modalCancelBtn.addEventListener("click", closeModal)