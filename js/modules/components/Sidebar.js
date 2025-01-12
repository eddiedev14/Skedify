import { sidebar, sidebarLinks } from "../selectores.js";

export function openSidebar() {
    sidebar.classList.add("open");
    toggleTabIndex()
}

export function closeSidebar() {
    sidebar.classList.remove("open");
    toggleTabIndex()
}

export function toggleTabIndex() {
    if (window.innerWidth >= 744) {
      return;  
    }

    if (!sidebar.classList.contains("open")) {
        sidebarLinks.forEach(link => link.tabIndex = "-1")
    }else{
        sidebarLinks.forEach(link => link.tabIndex = "0")
    }
}
