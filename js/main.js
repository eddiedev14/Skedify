import { closeSidebarBtn, openSidebarBtn } from "./modules/selectores.js";
import { closeSidebar, openSidebar } from "./modules/components/sidebar.js";

openSidebarBtn.addEventListener("click", openSidebar);
closeSidebarBtn.addEventListener("click", closeSidebar);