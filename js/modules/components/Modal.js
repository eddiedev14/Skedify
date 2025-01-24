import { modal } from "../selectores.js";

export function openModal() {
    modal.show();
}

export function selectAvatar(e) {
    const avatarElement = e.target.closest(".modal__figure");
    if (!avatarElement) return;

    const modalPreviousSelect = document.querySelector(".modal__figure--selected");
    
    if (modalPreviousSelect) {
        modalPreviousSelect.classList.remove("modal__figure--selected");
    }

    avatarElement.classList.add("modal__figure--selected");
}

export function closeModal() {
    modal.classList.add("closing");
    setTimeout(() => {
        modal.close();
        modal.classList.remove("closing");
    }, 300);
}
