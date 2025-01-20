import { calendar, calendarDays, modalCancelBtn, modalCloseBtn, nextMonthBtn, previousMonthBtn } from "../../modules/selectores.js";
import { closeModal } from "../../modules/components/Modal.js";
import { dragEndHandler, dragLeaveHandler, dragOverHandler, dropAppointment, loadAppointmentsModal, renderCalendar, setMonth, startDrag } from "../../modules/components/Calendar.js";

document.addEventListener("DOMContentLoaded", () => renderCalendar())
previousMonthBtn.addEventListener("click", () => setMonth(-1))
nextMonthBtn.addEventListener("click", () => setMonth(1))

calendar.addEventListener("click", loadAppointmentsModal);
modalCloseBtn.addEventListener("click", closeModal);
modalCancelBtn.addEventListener("click", closeModal)

//* Drag & Drop
calendarDays.forEach(calendarDay => {
    calendarDay.addEventListener("dragover", dragOverHandler)
    calendarDay.addEventListener("dragleave", dragLeaveHandler)
    calendarDay.addEventListener("dragend", dragEndHandler)
    calendarDay.addEventListener("drop", dropAppointment)
})