import { setTableEventsListeners, showRecords } from "../../modules/funciones.js";
import { table } from "../../modules/selectores.js";

//* Eventos
document.addEventListener("DOMContentLoaded", () => showRecords("services"));
table.addEventListener("click", (e) => setTableEventsListeners(e, "services"));