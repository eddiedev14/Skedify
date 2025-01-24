import { calendarDays, calendarHeading, firstDayGrid, linkAppointmentsControlBtn, modalCalendarList, modalHeading } from "../selectores.js";
import { formatAppointments, formatDateRange, formatDateString, formatTitle, reloadPage } from "../funciones.js";
import { openModal } from "./Modal.js";
import LocalStorage from "../classes/LocalStorage.js";
import UI from "../classes/UI.js";
import DB from "../classes/DB.js";
import Alert from "./Alert.js";

const currentDate = new Date();

export function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const firstMonthDate = new Date(year, month, 1);
    const lastMonthDate = new Date(year, month + 1, 0);

    const calendarTitle = currentDate.toLocaleDateString("co-CO", {
        month: "long",
        year: "numeric"
    })
    calendarHeading.textContent = formatTitle(calendarTitle);

    const firstWeekDay = firstMonthDate.getDay();
    const lastMonthDay = lastMonthDate.getDate();
    
    //Move grid to the first weekday of the month
    firstDayGrid.style.gridColumnStart = firstWeekDay === 0 ? 7 : firstWeekDay;

    //Hide/show the last three days
    for (let i = 30; i >= 28; i--) {
        const calendarDay = calendarDays[i];
        const day = Number(calendarDay.dataset.day);
        calendarDay.classList.toggle("calendar__day--hidden", day > lastMonthDay)
    }

    //Get monthly appointments
    DB.getMonthlyAppointments(formatDateRange([firstMonthDate, lastMonthDate]))
        .then(appointments => formatAppointments(appointments, displayAppointmentsInCalendar))
}

export function setMonth(step){
    const currentMonth = currentDate.getMonth();
    currentDate.setMonth(currentMonth + step);
    renderCalendar()
}

function displayAppointmentsInCalendar(appointments){
    const calendarDaysWithAppointments = document.querySelectorAll(".calendar__day--content");
    calendarDaysWithAppointments.forEach(calendarDay => UI.cleanCalendarDay(calendarDay))

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
    const date = appointments[0].fecha;
    const formattedDateString = formatDateString(date);
    
    modalHeading.textContent = `Citas - ${formattedDateString}`;
    UI.cleanHTML(modalCalendarList);
    appointments.forEach(appointment => UI.createCalendarModalItem(appointment))
    linkAppointmentsControlBtn.href = `control.html?search=${date.slice(0,10)}`;

    openModal();
}

//* Drag & Drop
export function startDrag(e) {
    const appointmentID = e.target.dataset.id;
    e.dataTransfer.setData("id", appointmentID);
    e.dataTransfer.dropEffect = "move"
    e.target.classList.add("dragging") 
}

export function dragOverHandler(e) {
    e.preventDefault();
    const target = e.target;
    const calendarDay = target.closest(".calendar__day");
    
    if (calendarDay && !calendarDay.classList.contains("drag__over")) {
        calendarDay.classList.add("drag__over");
    }
}

export function dragLeaveHandler(e) {
    e.target.classList.remove("drag__over");
}

export function dragEndHandler(e) {
    e.target.classList.remove("dragging")

    //Remove all days with the drag__over class (Prevent UI failures)
    const dragOverDays = document.querySelectorAll(".calendar__day.drag__over")
    dragOverDays.forEach(day => day.classList.remove("drag__over"))
}

export async function dropAppointment(e) {
    e.preventDefault();

    //Get the appointment id before the await to avoid errors with the dataTransfer
    const appointmentID = e.dataTransfer.getData("id");

    //Confirm Movement Action
    const confirmation = await LocalStorage.confirmAppointmentMovement();
    if (!confirmation) return

    const target = e.target;
    let calendarDayContainer = target;

    //Get the calendar day container and not a child
    if (!target.classList.contains("calendar__day")) {
        calendarDayContainer = target.closest(".calendar__day");
    }

    if (!calendarDayContainer.classList.contains("calendar__day--content")) {
        calendarDayContainer.classList.add("calendar__day--content");
    }

    //Get the dragged appointment
    const draggedAppointment = document.querySelector(`.calendar__appointments li[data-id='${appointmentID}']`);
    const previousCalendarDayContainer = draggedAppointment.closest(".calendar__day--content");

    // In case the element is not found, it returns
    if (!draggedAppointment) {
        Alert.showStatusAlert("error", "¡Error!", "La cita con el ID proporcionado no fue encontrada", reloadPage)
        return;
    }

    // Create the calendar day list and append the appointment
    const list = UI.createCalendarDayList(calendarDayContainer);
    list.appendChild(draggedAppointment);

    //Reset the previous calendar day
    UI.resetPreviousCalendarDay(previousCalendarDayContainer);

    //Update the selected appointment
    const selectedDay = calendarDayContainer.dataset.day;
    DB.updateAppointmentDate(appointmentID, selectedDay)
}