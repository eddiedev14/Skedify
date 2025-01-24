import { validationFormConfig } from "./variables.js";
import { clientInput, form, formSubmit, inputs, serviceInput } from "./selectores.js";
import Alert from "./components/Alert.js";
import { openModal } from "./components/Modal.js";
import { createTableInstance } from "./components/Datatables.js";
import { hideSpinnerSection } from "./components/Spinner.js";
import LocalStorage from "./classes/LocalStorage.js";
import DB from "./classes/DB.js";
import UI from "./classes/UI.js";

const URLParams = new URLSearchParams(window.location.search);
const requiredValidation = validationFormConfig.required;

//* Form Functions
export function validateInput(e){
    //Input Information
    const input = e.target;
    const inputValidationType = input.dataset.validate;
    const inputRequired = input.dataset.required === "true";
    const inputValue = input.value;

    // Required Validation
    if (inputRequired && !requiredValidation.validate(inputValue)) {
        Alert.showInputAlert(input, requiredValidation.message);
        return;
    }

    //Get the validation format/config in the object validationFormConfig based in the data-attribute validate
    if (inputValidationType) {
        const config = validationFormConfig[inputValidationType];
        if (config && !config.validate(inputValue)) {
            Alert.showInputAlert(input, config.message);
            return;
        }
    }

    // Clean the alert
    Alert.clearInputAlert(input);
}

export function validateForm(){
    for (const input of inputs) {
        const value = input.value;
        const isRequired = input.dataset.required === "true";
        const validationType = input.dataset.validate;

        // Required validation
        if (isRequired && !requiredValidation.validate(value)) {
            return false;
        }

        // Type Validation
        if (validationType) {
            const config = validationFormConfig[validationType];
            if (config && !config.validate(value)) {
                return false;
            }
        }
    }

    return true;
}

export function sendForm(e, objectStore = null){
    e.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
        Alert.showStatusAlert("error", "¡Error!", "Por favor, corrige los errores antes de enviar el formulario.")
        return;
    }

    checkFormAction(objectStore)
}

function checkFormAction(objectStore) {
    const formAction = formSubmit.dataset.action;
    if (formAction === "update-profile") {
        LocalStorage.updateProfile();
        return;
    }

    const id = getURLId();

    if (formAction === "create" && !id) {
        DB.addRegister(objectStore)
    }else if(formAction === "edit" && id){
        DB.editRecord(objectStore, id)
    }else{
        Alert.showStatusAlert("error", "¡Error!", "La acción del formulario no es reconocida...", reloadPage)
    }
}

//Function to configure the form according to the action (add or edit)
export function configureActionForm(objectStore) {
    const id = getURLId();
    if (id) UI.showFormEditMode(objectStore, id);
}

export function getURLId() {
    if (!URLParams.size) return; // If there isn't url params return
    const id = URLParams.get("id");
    
    if (URLParams.size > 1 || !id) {
        goToControlPage();
        return;
    }

    return id;
}

//* Appointments Form
export function showSelectRecords(){
    const promises = [DB.getRecords("services"), DB.getRecords("clients")];
    Promise.all(promises)
        .then(([services, clients]) => {
            UI.createSelectOptions(services, serviceInput);
            UI.createSelectOptions(clients, clientInput);
        })
        .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
}

//* Datatables Functions

function displayRecordsInTable(records){
    createTableInstance(records);
    hideSpinnerSection();
}

//Function to show the records in the datatable
export function showRecords(objectStore) {
    DB.getRecords(objectStore)
        .then(records => displayRecordsInTable(records))
        .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
}

export function getAppointments(callback = displayRecordsInTable){ //If callback is not provided, the specified function will be used.
    DB.getRecords("appointments")
        .then(appointments => formatAppointments(appointments, callback)) 
}

//Function to show the records in the datatable
export function formatAppointments(appointments, callback) {
    const clientIds = [...new Set(appointments.map(app => app.cliente))];
    const serviceIds = [...new Set(appointments.map(app => app.servicio))];

    return Promise.all([
        DB.getRecordsByIds("clients", clientIds),
        DB.getRecordsByIds("services", serviceIds)
    ])
    .then(([clients, services]) => {
        //Create objects from the mapping of the promise responses, where the key is the id of the record and the value is the name
        const clientMap = Object.fromEntries(clients);
        const serviceMap = Object.fromEntries(services);

        const detailedAppointments =  appointments.map(app => ({
            id: app.id,
            cliente: clientMap[app.cliente],
            servicio: serviceMap[app.servicio],
            fecha: app.fecha.split("T").join(" "),
            estado: app.estado
        }))

        callback(detailedAppointments);
    })
    .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
}

//Function to set up the table event listeners
export function setTableEventsListeners(e, objectStore, foreignKeyPropertie = null) {
    const button = e.target.closest("button");
    if (!button) return;
    const id = button.dataset.id;

    if (button.classList.contains("table__btn--edit")) {
        openEdition(id)
    }else if(button.classList.contains("table__btn--delete")){
        Alert.showConfirmationAlert(objectStore, id, foreignKeyPropertie)
    }else if (button.classList.contains("table__status")) {
        openModal();
        UI.showRecordModal(id);
    }
}

//Function to go to edit page
function openEdition(id) {
    window.location.href = `agregar.html?id=${id}`;
}

export function getFormData() {
    return Object.fromEntries(new FormData(form))
}

export function reloadPage() {
    window.location.reload();
}

export function goToControlPage() {
    window.location.href = "./control.html";
}

export function formatTitle(title){
    return title.charAt(0).toUpperCase() + title.slice(1).replace(/_/g, ' ');
}

//* Calendar Functions

export function formatDateString(date){
    const dateString = new Date(date).toLocaleDateString("co-CO", {
        month: 'long',
        day: 'numeric',
    })

    const dateStringSplitted = dateString.split(" ")
    dateStringSplitted[2] = dateStringSplitted[2].charAt(0).toUpperCase() + dateStringSplitted[2].slice(1);
    const formattedString = dateStringSplitted.join(" ")
    return formattedString;
}

export function formatTime(date) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const timePeriod = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${timePeriod}`;
}

export function toCustomISOFormat(date) {
    return date.toISOString().slice(0, 16);
}

//Function to get the daily range with the hour
export function getDailyRange(){
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const startOfDay = todayStr + "T00:00";
    const endOfDay = todayStr + "T23:59";

    return [startOfDay, endOfDay]
}

//Function to format a date range with the hour
export function formatDateRange(range) {
    const ISODates = range.map(date => date.toISOString().split("T")[0])
    
    const startDate = ISODates[0] + "T00:00";
    const endDate = ISODates[1] + "T23:59";

    return [startDate, endDate];
}