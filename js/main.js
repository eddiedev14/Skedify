import { closeSidebarBtn, openSidebarBtn } from "./modules/selectores.js";
import { closeSidebar, openSidebar } from "./modules/components/Sidebar.js";
import LocalStorage from "./modules/classes/LocalStorage.js";
import DB from "./modules/classes/DB.js";

document.addEventListener("DOMContentLoaded", () => LocalStorage.login())

openSidebarBtn.addEventListener("click", openSidebar);
closeSidebarBtn.addEventListener("click", closeSidebar);