import { calendarDays, calendarHeading, firstDayGrid } from "../selectores.js";
import { formatTitle, reloadPage } from "../funciones.js";
import DB from "../classes/DB.js";
import Alert from "./Alert.js";

const currentDate = new Date();
let servicesMap;

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

export function showCalendarRecords() {
    DB.getRecords("appointments")
        .then(appointments => {
            getServicesByIds(appointments)
                .then(services => {
                    servicesMap = Object.fromEntries(services);
                    appointments.forEach(record => {
                        const date = new Date(record.fecha);
                        const day = date.getDate();
                        const calendarDayContainer = document.querySelector(`.calendar__day[data-day="${day}"]`);
                        updateCalendarDayContent(calendarDayContainer, record)
                    })
                })
        })
        .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
}

function getServicesByIds(appointments) {
    const serviceIds = [...new Set(appointments.map(app => app.servicio))];
    return DB.getRecordsByIds("services", serviceIds)
}

function updateCalendarDayContent(container, { id, estado, servicio }) {
    const dayInfoContainer = container.querySelector(".day__info");

    //Creating the appointments visual indicator button
    let visualIndicatorBtn = dayInfoContainer.querySelector(".day__notification");
    if (!visualIndicatorBtn) {
        visualIndicatorBtn = document.createElement("BUTTON");
        visualIndicatorBtn.classList.add("day__notification");
        visualIndicatorBtn.innerHTML = '<i class="ri-information-2-fill"></i>';
        dayInfoContainer.appendChild(visualIndicatorBtn)
    }

    let list = container.querySelector(".calendar__appointments");
    if (!list) {
        list = document.createElement("UL");
        list.classList.add("calendar__appointments");
        container.appendChild(list)
    }

    const listItem = document.createElement("LI");
    listItem.dataset.id = id;
    listItem.classList.add(`appointment__${estado.toLowerCase()}`)

    const listButton = document.createElement("BUTTON");

    const icon = document.createElement("I");
    switch (estado) {
        case "Completada":
            icon.classList.add("ri-checkbox-circle-fill");
            break;

        case "Confirmada":
            icon.classList.add("ri-checkbox-circle-fill");
            break;

        case "Pendiente":
            icon.classList.add("ri-hourglass-fill");
            break;

        case "Cancelada":
            icon.classList.add("ri-close-circle-fill");
            break;
    
        default:
            break;
    }

    const textSpan = document.createElement("SPAN");
    textSpan.textContent = servicesMap[servicio];
    textSpan.classList.add("appointment-text");
    
    listButton.appendChild(icon);
    listButton.appendChild(textSpan)

    listItem.appendChild(listButton)
    list.appendChild(listItem)
}