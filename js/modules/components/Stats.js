import { incomesSpinner } from "../selectores.js";
import { formatDateRange, getDailyRange, reloadPage } from "../funciones.js";
import Alert from "./Alert.js";
import UI from "../classes/UI.js";
import DB from "../classes/DB.js";

const incomesDateRanges = {
    diarios: getDailyRange,
    semanales: getWeeklyRange,
    mensuales: getMonthlyRange
}

export function loadStats() {
    const promises = [
        DB.getDailyAppointmentsCount(["Pendiente", "Completada"]),
        DB.getRecordsCount("clients"),
        DB.getRecordsCount("services"),
        DB.getIncomes(getWeeklyRange())
    ]

    Promise.all(promises)
        .then(([appointments, clients, services, incomes]) => {            
            const todayAppointments = Object.values(appointments).reduce((total, count) => total + count, 0);
            const todayPendingAppointmnets = appointments["Pendiente"] || 0; 

            const stats = {
                today: todayAppointments,
                pending: todayPendingAppointmnets,
                clients,
                services,
                incomes
            }

            UI.showStats(stats)
        })
        .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
}

export function handleIncomesRange(e){
    incomesSpinner.classList.remove("spinner--hidden");

    const range = e.target.value;
    const rangeFunction = incomesDateRanges[range];
    if (!rangeFunction) return

    DB.getIncomes(rangeFunction())
        .then(incomes => {
            incomesSpinner.classList.add("spinner--hidden")
            UI.updateIncomes(incomes)
        })
}

//TODO
export function getMonthlyRange(){
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth();

    const firstMonthDate = new Date(year, month, 1);
    const lastMonthDate = new Date(year, month + 1, 0);

    return formatDateRange([firstMonthDate, lastMonthDate])
}

export function getWeeklyRange() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Get the week start and end day
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const endDate = new Date(today);
    endDate.setDate(startDate.getDate() + 6);

    return formatDateRange([startDate, endDate]);
}