import { calendar, calendarDays, infoCalendarBtn, modalCancelBtn, modalCloseBtn, nextMonthBtn, previousMonthBtn } from "../../modules/selectores.js";
import { dragEndHandler, dragLeaveHandler, dragOverHandler, dropAppointment, loadAppointmentsModal, renderCalendar, setMonth, startDrag } from "../../modules/components/Calendar.js";
import { closeModal } from "../../modules/components/Modal.js";
import Alert from "../../modules/components/Alert.js";

document.addEventListener("DOMContentLoaded", renderCalendar)
previousMonthBtn.addEventListener("click", () => setMonth(-1))
nextMonthBtn.addEventListener("click", () => setMonth(1))
infoCalendarBtn.addEventListener("click", Alert.showCalendarInfo)

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