import { validationFormConfig } from "./variables.js";
import { form } from "./selectores.js";
import Alert from "./components/Alert.js";
import { createTableInstance } from "./components/Datatables.js";
import { hideSpinnerSection } from "./components/Spinner.js";
import DB from "./classes/DB.js";

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

export function sendForm(e, functionToExecute){
    e.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
        Alert.showStatusAlert("error", "¡Error!", "Por favor, corrige los errores antes de enviar el formulario.")
        return;
    }

    functionToExecute();
}

//Function to show the records in the datatable
export function showRecords(objectStore) {
    DB.getRecords(objectStore)
        .then(records => {
            createTableInstance(records);
            hideSpinnerSection();
        })
        .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
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