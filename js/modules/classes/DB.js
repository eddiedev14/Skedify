import { getFormData, goToControlPage, reloadPage } from "../funciones.js";
import Alert from "../components/Alert.js";

class DB{
    #db;

    constructor(){
        this.openDB()
            .then(res => this.#db = res)
            .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
    }

    openDB(){
        if (!window.indexedDB) {
            Alert.showStatusAlert("error", "¡Error!", "Tu navegador no es compatible con Indexed DB.", reloadPage);
            return;
        }

        return new Promise((resolve, reject) => {
            let openRequest = indexedDB.open("Skedify");

            openRequest.onsuccess = () => resolve(openRequest.result);
            openRequest.onerror = () => reject(new Error("Ha ocurrido un error al abrir la conexión con Indexed DB"));
            
            openRequest.onupgradeneeded = () => {
                const db = openRequest.result;

                //* Object Stores
                const appointments = db.createObjectStore("appointments", { keyPath: "id" });
                const clients = db.createObjectStore("clients", { keyPath: "id" });
                const services = db.createObjectStore("services", { keyPath: "id" });
            }
        })
    }

    addRegister(objectStore){
        const formData = getFormData();

        const register = {
            id: Math.random().toString(36).substring(2) + Date.now(),
            ...formData
        }

        const transtaction = this.#db.transaction(objectStore, "readwrite");
        const objectStoreElement = transtaction.objectStore(objectStore);
        const request = objectStoreElement.add(register);

        request.onsuccess = () => Alert.showStatusAlert("success", "¡Felicitaciones!", "El servicio ha sido creado correctamente", goToControlPage)
        request.onerror = () => Alert.showStatusAlert("error", "¡Ops...! Ha ocurrido un error agregando el registro", reloadPage);
    }
}

export default new DB();