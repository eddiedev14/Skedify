import { incomesRangeSelect } from "../modules/selectores.js";
import { handleIncomesRange, loadStats } from "../modules/components/Stats.js";

document.addEventListener("DOMContentLoaded", loadStats)
incomesRangeSelect.addEventListener("change", handleIncomesRange)