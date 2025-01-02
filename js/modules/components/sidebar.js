import { sidebar } from "../selectores.js";

export function openSidebar() {
    sidebar.classList.add("open");
}

export function closeSidebar() {
    sidebar.classList.remove("open");
}