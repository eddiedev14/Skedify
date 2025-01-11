import { validationFormConfig } from "./variables.js";
import { form } from "./selectores.js";
import Alert from "./components/Alert.js";

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

export function getFormData() {
    return Object.fromEntries(new FormData(form))
}

export function reloadPage() {
    window.location.reload();
}

export function goToControlPage() {
    window.location.href = "./control.html";
}