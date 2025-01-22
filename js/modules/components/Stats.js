import { formatDateRange, reloadPage } from "../funciones.js";
import Alert from "./Alert.js";
import UI from "../classes/UI.js";
import DB from "../classes/DB.js";

export function loadStats() {
    const promises = [
        DB.getDailyAppointmentsCount(["Pendiente", "Completada"]),
        DB.getRecordsCount("clients"),
        DB.getRecordsCount("services"),
        DB.getIncomes(getWeekRange())
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

            getMonthlyRange()

            UI.showStats(stats)
        })
        .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
}

//TODO
function getMonthlyRange(){

}

function getWeekRange() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Get the week start and end day
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const endDate = new Date(today);
    endDate.setDate(startDate.getDate() + 6);

    return formatDateRange([startDate, endDate]);
}