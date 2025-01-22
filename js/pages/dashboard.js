import { toggleTabIndex } from "../modules/components/Sidebar.js";
import { loadStats } from "../modules/components/Stats.js";

document.addEventListener("DOMContentLoaded", () => {
    toggleTabIndex();
    loadStats();
})