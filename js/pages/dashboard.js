import { incomesRangeSelect } from "../modules/selectores.js";
import { toggleTabIndex } from "../modules/components/Sidebar.js";
import { handleIncomesRange, loadStats } from "../modules/components/Stats.js";

document.addEventListener("DOMContentLoaded", () => {
    toggleTabIndex();
    loadStats();
})

incomesRangeSelect.addEventListener("change", handleIncomesRange)