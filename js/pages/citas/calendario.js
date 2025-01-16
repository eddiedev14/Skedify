import { nextMonthBtn, previousMonthBtn } from "../../modules/selectores.js";
import { renderCalendar, setMonth } from "../../modules/components/Calendario.js";

document.addEventListener("DOMContentLoaded", renderCalendar)
previousMonthBtn.addEventListener("click", () => setMonth(-1))
nextMonthBtn.addEventListener("click", () => setMonth(1))