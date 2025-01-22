import { loadingContainer, preloader } from "../selectores.js";

export function hideSpinnerSection() {
    loadingContainer.classList.add("hide");
}

export function hidePreloader() {
    preloader.classList.add("preloader--hidden");
}