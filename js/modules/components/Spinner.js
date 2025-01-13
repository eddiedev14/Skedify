import { loadingContainer } from "../selectores.js";

export function hideSpinnerSection() {
    loadingContainer.classList.add("hide");
}