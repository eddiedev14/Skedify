import { headerProfileAvatar, profileAvatar } from "../selectores.js";
import { userDefault } from "../variables.js";
import { closeModal } from "../components/Modal.js";
import UI from "./UI.js";
import Alert from "../components/Alert.js";

class LocalStorage{
    login(){
        if (!localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify(userDefault))
        }

        const user = JSON.parse(localStorage.getItem("user"));
        UI.showHeaderUserInfo(user);
    }

    getUser(){
        const user = localStorage.getItem("user");
        if (!user) window.location.reload();
        return JSON.parse(user);
    }

    updateAvatar(){
        const selectedAvatar = document.querySelector(".modal__figure--selected img").dataset.src;
        const user = JSON.parse(localStorage.getItem("user"));
        user.avatar = selectedAvatar;
        localStorage.setItem("user", JSON.stringify(user));
        UI.updateProfileAvatar(profileAvatar, selectedAvatar);
        UI.updateProfileAvatar(headerProfileAvatar, selectedAvatar);
        Alert.showStatusAlert("success", "Foto de perfil actualizada", "Tu nueva foto se ha guardado exitosamente")
        closeModal();
    }
}

export default new LocalStorage();