import { closeSidebarBtn, openSidebarBtn } from "./modules/selectores.js";
import { closeSidebar, openSidebar, toggleTabIndex } from "./modules/components/Sidebar.js";
import LocalStorage from "./modules/classes/LocalStorage.js";

document.addEventListener("DOMContentLoaded", () => {
    LocalStorage.login();
    toggleTabIndex();
})

openSidebarBtn.addEventListener("click", openSidebar);
closeSidebarBtn.addEventListener("click", closeSidebar);