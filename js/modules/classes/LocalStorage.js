import { userDefault } from "../variables.js";
import { headerProfileAvatar, profileAvatar } from "../selectores.js";
import { closeModal } from "../components/Modal.js";
import Alert from "../components/Alert.js";
import UI from "./UI.js";
import { getFormData, reloadPage } from "../funciones.js";

class LocalStorage{
    setUser(user){
        localStorage.setItem("user", JSON.stringify(user));
    }
    
    getUser(){
        const user = localStorage.getItem("user");
        if (!user) window.location.reload();
        return JSON.parse(user);
    }
    

    login = () => {
        if (!localStorage.getItem("user")) {
            this.setUser(userDefault)
        }

        const user = this.getUser();
        UI.showHeaderUserInfo(user);
    }


    updateAvatar = () => {
        const selectedAvatar = document.querySelector(".modal__figure--selected img").dataset.src;
        const user = this.getUser();
        user.avatar = selectedAvatar;
        this.setUser(user);
        UI.updateProfileAvatar(profileAvatar, selectedAvatar);
        UI.updateProfileAvatar(headerProfileAvatar, selectedAvatar);
        Alert.showStatusAlert("success", "Foto de perfil actualizada", "Tu nueva foto se ha guardado exitosamente")
        closeModal();
    }

    updateProfile = () => {
        const user = this.getUser();
        const formData = getFormData();
        const newUser = Object.assign(user, formData);
        this.setUser(newUser)
        Alert.showStatusAlert("success", "Información de perfil actualizada", "Tu información de perfil se ha guardado exitosamente", reloadPage)
    }

    //Skip Confirmation Moving Appointments
    async confirmAppointmentMovement(){
        const skipConfirmation = localStorage.getItem("skipConfirmation") === "true";

        if (!skipConfirmation) {
            const result = await Alert.showConfirmationMovementAlert()
            const noAskAgain = document.getElementById("noAskAgain").checked;
            if (noAskAgain) {
                localStorage.setItem("skipConfirmation", "true");
            } 

            return result.isConfirmed;
        }

        return skipConfirmation;
    }

    resetMovementConfirmation(){
        localStorage.removeItem("skipConfirmation");
    }
}

export default new LocalStorage();