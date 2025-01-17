import { nextMonthBtn, previousMonthBtn } from "../../modules/selectores.js";
import { renderCalendar, setMonth, showCalendarRecords } from "../../modules/components/Calendar.js";

document.addEventListener("DOMContentLoaded", () => {
    renderCalendar();
    showCalendarRecords()
})
previousMonthBtn.addEventListener("click", () => setMonth(-1))
nextMonthBtn.addEventListener("click", () => setMonth(1))