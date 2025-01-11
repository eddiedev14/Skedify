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