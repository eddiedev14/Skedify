import { setTableEventsListeners, showAppointmentsRecords } from "../../modules/funciones.js";
import { table } from "../../modules/selectores.js";

//* Eventos
document.addEventListener("DOMContentLoaded", () => showAppointmentsRecords("appointments"));
table.addEventListener("click", (e) => setTableEventsListeners(e, "appointments"));