import { calendarDays, calendarHeading, firstDayGrid, modalCalendarList, modalHeading } from "../selectores.js";
import { formatAppointments, formatDateString, formatTitle, reloadPage } from "../funciones.js";
import { openModal } from "./Modal.js";
import UI from "../classes/UI.js";
import DB from "../classes/DB.js";
import Alert from "./Alert.js";

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

export function displayAppointmentsInCalendar(appointments){
    appointments.forEach(record => {
        const date = new Date(record.fecha);
        const day = date.getDate();
        const calendarDayContainer = document.querySelector(`.calendar__day[data-day="${day}"]`);
        UI.updateCalendarDayContent(calendarDayContainer, record)
    })
}

//* Appointment Modal

export function loadAppointmentsModal(e){
    const calendarDay = e.target.closest(".calendar__day--content");
    if (!calendarDay) return;

    const appointmentsIDs = [];
    const calendarAppointments = calendarDay.querySelectorAll(".calendar__appointments li")
    calendarAppointments.forEach(appointment => appointmentsIDs.push(appointment.dataset.id));
    const appointmentsPromises = appointmentsIDs.map(id => DB.getRecord("appointments", id));
    
    Promise.all(appointmentsPromises)
        .then(appointments => formatAppointments(appointments, displayAppointmentsInModal))
        .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
}

function displayAppointmentsInModal(appointments){
    const formattedDateString = formatDateString(appointments[0].fecha);
    
    modalHeading.textContent = `Citas - ${formattedDateString}`;
    UI.cleanHTML(modalCalendarList);
    appointments.forEach(appointment => UI.createCalendarModalItem(appointment))
    openModal();
}