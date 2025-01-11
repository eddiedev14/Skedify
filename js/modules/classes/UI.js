import { headerProfileAvatar, headerProfileRole, headerProfileUser, profileAvatar } from "../selectores.js";
import LocalStorage from "./LocalStorage.js";

class UI{
    showHeaderUserInfo({ name, role, avatar }){
        this.updateProfileAvatar(headerProfileAvatar, avatar)
        headerProfileUser.textContent = name;
        headerProfileRole.textContent = role;
    }

    showFormUserInfo = (e) =>{
        const { name, email, phone, role, avatar } = LocalStorage.getUser();

        this.updateProfileAvatar(profileAvatar, avatar);
        document.querySelector(`.modal__figure:has(img[data-src='${avatar}'])`).classList.add("modal__figure--selected")
        document.querySelector("input#nombre").value = name;
        document.querySelector("input#email").value = email;
        document.querySelector("input#telefono").value = phone;
        document.querySelector("input#rol").value = role;
    }

    updateProfileAvatar(element, avatar){
        element.src = `/assets/avatars/${avatar}.svg`;
    }
}

export default new UI();