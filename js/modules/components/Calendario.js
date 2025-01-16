import { calendarDays, calendarHeading, firstDayGrid } from "../selectores.js";
import { formatTitle } from "../../modules/funciones.js";

const currentDate = new Date();

export function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const calendarTitle = currentDate.toLocaleDateString("co-CO", {
        month: "long",
        year: "numeric"
    })
    calendarHeading.textContent = formatTitle(calendarTitle);

    const firstWeekDay = new Date(year, month, 1).getDay();
    const lastMonthDay = new Date(year, month + 1, 0).getDate();
    
    //Move grid to the first weekday of the month
    firstDayGrid.style.gridColumnStart = firstWeekDay;

    //Hide extra days
    calendarDays.forEach(calendarDay => {
        const day = Number(calendarDay.dataset.day);
        calendarDay.classList.toggle("calendar__day--hidden", day > lastMonthDay)
    })
}

export function setMonth(step){
    const currentMonth = currentDate.getMonth();
    currentDate.setMonth(currentMonth + step);
    renderCalendar()
}