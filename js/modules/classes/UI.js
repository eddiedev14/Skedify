import { appointmentStateContainer, emptyContainer, formHeading, formSubmit, headerProfileAvatar, headerProfileRole, headerProfileUser, inputs, modalAppointmentSubmitBtn, modalCalendarList, profileAvatar } from "../selectores.js";
import { formatTime, goToControlPage } from "../funciones.js";
import LocalStorage from "./LocalStorage.js";
import DB from "./DB.js";
import Alert from "../components/Alert.js";

class UI{
    //* Profile
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

    //* APP

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

    //* Calendar

    updateCalendarDayContent(container, { id, estado, servicio }){
        container.classList.add("calendar__day--content");
        const dayInfoContainer = container.querySelector(".day__info");

        //Creating the appointments visual indicator button
        let visualIndicatorBtn = dayInfoContainer.querySelector(".day__notification");
        if (!visualIndicatorBtn) {
            visualIndicatorBtn = document.createElement("BUTTON");
            visualIndicatorBtn.classList.add("day__notification");
            visualIndicatorBtn.innerHTML = '<i class="ri-information-2-fill"></i>';
            dayInfoContainer.appendChild(visualIndicatorBtn)
        }

        let list = container.querySelector(".calendar__appointments");
        if (!list) {
            list = document.createElement("UL");
            list.classList.add("calendar__appointments");
            container.appendChild(list)
        }

        const listItem = document.createElement("LI");
        listItem.dataset.id = id;
        listItem.classList.add(`appointment__${estado.toLowerCase()}`)

        const listButton = document.createElement("BUTTON");
        const icon = this.createAppointmentStatusIcon(estado)

        const textSpan = document.createElement("SPAN");
        textSpan.textContent = servicio;
        textSpan.classList.add("appointment-text");
        
        listButton.appendChild(icon);
        listButton.appendChild(textSpan)

        listItem.appendChild(listButton)
        list.appendChild(listItem)
    }

    createAppointmentStatusIcon(estado){
        const icon = document.createElement("I");
        switch (estado) {
            case "Completada":
                icon.classList.add("ri-checkbox-circle-fill");
                break;

            case "Confirmada":
                icon.classList.add("ri-checkbox-circle-fill");
                break;

            case "Pendiente":
                icon.classList.add("ri-hourglass-fill");
                break;

            case "Cancelada":
                icon.classList.add("ri-close-circle-fill");
                break;
        
            default:
                break;
        }

        return icon;
    }

    createCalendarModalItem({ servicio, cliente, estado, fecha }){
        const listItem = document.createElement("LI");
        listItem.classList.add("modal__item");

        //* Item Description
        const itemDescription = document.createElement("DIV");
        itemDescription.classList.add("item__description");

        const itemIcon = document.createElement("DIV");
        itemIcon.classList.add(`item__icon`, `item__icon--${estado.toLowerCase()}`)
        const icon = this.createAppointmentStatusIcon(estado);

        itemIcon.appendChild(icon);

        const itemContent = document.createElement("DIV");
        itemContent.classList.add("item__content");

        const serviceHeading = document.createElement("H6");
        serviceHeading.classList.add("item__service")
        serviceHeading.textContent = servicio;

        const clientSpan = document.createElement("SPAN");
        clientSpan.classList.add("item__client");
        clientSpan.textContent = cliente;

        itemContent.appendChild(serviceHeading);
        itemContent.appendChild(clientSpan);

        itemDescription.appendChild(itemIcon);
        itemDescription.appendChild(itemContent)

        //* Item Date
        const itemDate = document.createElement("DIV");
        itemDate.classList.add("item__date");

        //Obtaining the time (HH:MM)
        const time = formatTime(new Date(fecha))
        const hourSpan = document.createElement("SPAN");
        hourSpan.classList.add("item__hour")
        hourSpan.innerHTML = `<i class="ri-timer-fill"></i> ${time}`;

        itemDate.appendChild(hourSpan);

        //* Adding to the DOM
        listItem.appendChild(itemDescription);
        listItem.appendChild(itemDate);

        modalCalendarList.appendChild(listItem);
    }

    cleanCalendarDay(calendarDay){
        calendarDay.classList.remove("calendar__day--content")
        calendarDay.querySelector(".day__info button.day__notification").remove();
        calendarDay.querySelector("ul.calendar__appointments").remove();
    }

    cleanHTML(container){
        while (container.firstElementChild) {
            container.removeChild(container.firstElementChild);
        }
    }
}

export default new UI();