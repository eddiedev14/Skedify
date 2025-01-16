import { appointmentStateContainer, emptyContainer, formHeading, formSubmit, headerProfileAvatar, headerProfileRole, headerProfileUser, inputs, modalAppointmentSubmitBtn, profileAvatar } from "../selectores.js";
import { goToControlPage, reloadPage } from "../funciones.js";
import LocalStorage from "./LocalStorage.js";
import DB from "./DB.js";
import Alert from "../components/Alert.js";

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
        document.querySelector("input#name").value = name;
        document.querySelector("input#email").value = email;
        document.querySelector("input#phone").value = phone;
        document.querySelector("input#role").value = role;
    }

    updateProfileAvatar(element, avatar){
        element.src = `/assets/avatars/${avatar}.svg`;
    }

    showFormEditMode(objectStore, id){
        formHeading.textContent = "Editar Registro";
        formSubmit.innerHTML = 'Editar Registro <i class="ri-pencil-fill"></i>';
        formSubmit.dataset.action = "edit";
        DB.getRecord(objectStore, id)
            .then(info => this.showRecordInfo(info))
            .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, goToControlPage))
    }

    showRecordModal(id){
        DB.getRecord("appointments", id)
            .then(info => {
                this.showRecordInfo(info);
                modalAppointmentSubmitBtn.dataset.id = id;
            })
            .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, goToControlPage))
    }

    showRecordInfo(info){
        inputs.forEach(input => input.value = info[input.name])

        //Show the appointment state input if the user is in that editing section
        if (appointmentStateContainer) {
            appointmentStateContainer.classList.remove("form__group--hidden");
            appointmentStateContainer.querySelector("select").removeAttribute("readonly");
        }
    }

    createSelectOptions(records, select){
        const fragment = document.createDocumentFragment();

        records.forEach(record => {
            const { id, nombre } = record;
            const option = document.createElement("OPTION");
            option.value = id;
            option.textContent = nombre;
            fragment.appendChild(option);
        })

        select.appendChild(fragment)
    }

    showRecordsNotFoundDiv(){
        emptyContainer.classList.add("show")
    }

    removeTableRow(id){
        const tableRow = document.querySelector(`#table tr:has(.table__btn[data-id='${id}'])`);
        const tableExpanded = tableRow.nextElementSibling;
        if (tableExpanded && tableExpanded.getAttribute("data-dt-row") && tableExpanded.classList.contains("child")) {
            tableExpanded.remove();
        }
        tableRow.remove();
    }
}

export default new UI();