import { validationFormConfig } from "./variables.js";
import { form, formSubmit } from "./selectores.js";
import Alert from "./components/Alert.js";
import { createTableInstance } from "./components/Datatables.js";
import { hideSpinnerSection } from "./components/Spinner.js";
import DB from "./classes/DB.js";
import UI from "./classes/UI.js";

const URLParams = new URLSearchParams(window.location.search);

//* Form Functions
export function validateInput(e){
    //Input Information
    const input = e.target;
    const inputValidationType = input.dataset.validate;
    const inputValue = input.value;

    //Get the validation format/config in the object validationFormConfig based in the data-attribute validate
    const config = validationFormConfig[inputValidationType];
    const isValid = config.validate(inputValue)

    if (!isValid) {
        Alert.showInputAlert(input, config.message);
    }else{
        Alert.clearInputAlert(input);
    }
}

export function validateForm(){
    let isValid = true;
    const inputsToValidate = document.querySelectorAll("input[data-validate]");
    
    inputsToValidate.forEach(input => {
        const config = validationFormConfig[input.dataset.validate];
        if (!config.validate(input.value)) {
            isValid = false;
        }
    })

    return isValid;
}

export function sendForm(e, objectStore){
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
    const id = getURLId();

    //We implement logic validating if there is id or not.
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

//* Datatables Functions

//Function to show the records in the datatable
export function showRecords(objectStore) {
    DB.getRecords(objectStore)
        .then(records => {
            createTableInstance(records);
            hideSpinnerSection();
        })
        .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
}

//Function to set up the table event listeners
export function setTableEventsListeners(e, objectStore) {
    const button = e.target.closest("button");
    if (!button) return;
    const id = button.dataset.id;

    if (button.classList.contains("table__btn--edit")) {
        openEdition(id)
    }else if(button.classList.contains("table__btn--delete")){
        Alert.showConfirmationAlert(objectStore, id)
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