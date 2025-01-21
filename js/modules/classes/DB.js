import { modalAppointmentStateInput } from "../selectores.js";
import { getFormData, goToControlPage, reloadPage, toCustomISOFormat } from "../funciones.js";
import Toast from "../components/Toast.js";
import Alert from "../components/Alert.js";
import UI from "./UI.js";

class DB{
    #db;

    //Function to initializate the database
    async init() {
        try {
            this.#db = await this.openDB();  // Wait until the database is ready
        } catch (error) {
            Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage);
        }
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

                //* Indexes
                appointments.createIndex("fecha_idx", "fecha")
            }
        })
    }

    async addRegister(objectStore){
        if (!this.#db) await this.init();
        const formData = getFormData();

        const register = {
            id: Math.random().toString(36).substring(2) + Date.now(),
            ...formData
        }

        const transaction = this.#db.transaction(objectStore, "readwrite");
        const objectStoreElement = transaction.objectStore(objectStore);
        const request = objectStoreElement.add(register);

        request.onsuccess = () => Alert.showStatusAlert("success", "¡Felicitaciones!", "El registro ha sido creado correctamente", goToControlPage)
        request.onerror = () => Alert.showStatusAlert("error", "¡Ops...! Ha ocurrido un error agregando el registro", reloadPage);
    }

    async getRecords(objectStore){
        if (!this.#db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.#db.transaction(objectStore, "readonly");
            const objectStoreElement = transaction.objectStore(objectStore);
            const request = objectStoreElement.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("¡Ops...! Ha ocurrido un error obteniendo los registro"));
        })
    }

    async getRecord(objectStore, id){
        if (!this.#db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.#db.transaction(objectStore, "readonly");
            const objectStoreElement = transaction.objectStore(objectStore);
            const request = objectStoreElement.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("¡Ops...! Ha ocurrido un error obteniendo el registro con esa ID"));
        })
    }

    async editRecord(objectStore, id){
        const formData = getFormData();
        
        const newRegister = {
            id,
            ...formData
        }

        const transaction = this.#db.transaction(objectStore, "readwrite");
        const objectStoreElement = transaction.objectStore(objectStore);
        const request = objectStoreElement.put(newRegister);

        request.onsuccess = () => Alert.showStatusAlert("success", "¡Felicitaciones!", "El registro ha sido actualizado correctamente", goToControlPage)
        request.onerror = () => Alert.showStatusAlert("error", "¡Ops...! Ha ocurrido un error actualizando el registro", reloadPage); 
    }

    async deleteRecord(objectStore, id, foreignKeyPropertie = null){
        const transaction = this.#db.transaction(objectStore, "readwrite");
        const objectStoreElement = transaction.objectStore(objectStore);
        const request = objectStoreElement.delete(id);

        request.onsuccess = async () => {
            if (foreignKeyPropertie) {
                await this.deleteForeignKeyRecords(foreignKeyPropertie, id)
            }

            UI.removeTableRow(id);
            Alert.showStatusAlert("success", "¡Felicitaciones!", "El registro ha sido eliminado correctamente", reloadPage);
        }
        request.onerror = () => Alert.showStatusAlert("error", "¡Ops...! Ha ocurrido un error actualizando el registro", reloadPage); 
    }

    async deleteForeignKeyRecords(foreignKeyPropertie, idForeignKey){
        const transaction = this.#db.transaction("appointments", "readwrite");
        const objectStoreElement = transaction.objectStore("appointments");
        const request = objectStoreElement.openCursor();

        request.onsuccess = () => {
            const cursor = request.result;

            if (cursor) {
                const record = cursor.value;
                if (record[foreignKeyPropertie] === idForeignKey) {
                    cursor.delete();
                }
                cursor.continue()
            }
        }

        request.onerror = () => Alert.showStatusAlert("error", "¡Ops...! Ha ocurrido un error eliminando los registros relacionados", reloadPage); 
    }

    updateState(id){
        const estado = modalAppointmentStateInput.value;

        this.getRecord("appointments", id)
            .then(info => {
                const updatedAppointment = {...info, estado};
                const transaction = this.#db.transaction("appointments", "readwrite");
                const objectStoreElement = transaction.objectStore("appointments");
                const request = objectStoreElement.put(updatedAppointment);

                request.onsuccess = () => Alert.showStatusAlert("success", "¡Felicitaciones!", "El estado de la cita ha sido actualizado correctamente", reloadPage)
                request.onerror = () => Alert.showStatusAlert("error", "¡Ops...! Ha ocurrido un error actualizando el estado de la cita", reloadPage); 
            })
            .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
    }

        updateAppointmentDate(id, newDay){
            this.getRecord("appointments", id)
                .then(appointment => {
                    const date = new Date(appointment.fecha);
                    //Setting the day without being affected by the time zone
                    date.setUTCDate(newDay);
                    const fecha = toCustomISOFormat(date);

                    const updatedAppointment = { ...appointment, fecha }
                    const transaction = this.#db.transaction("appointments", "readwrite");
                    const objectStoreElement = transaction.objectStore("appointments");
                    const request = objectStoreElement.put(updatedAppointment);

                    request.onsuccess = () => Toast.success("¡Cita Actualizada!")
                    request.onerror = () => Alert.showStatusAlert("error", "¡Ops...! Ha ocurrido un error actualizando el registro", reloadPage); 
                })
                .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
        }

    async getMonthlyAppointments(firstMonthDate, lastMonthDate) {
        if (!this.#db) await this.init();

        const firstDateStr = toCustomISOFormat(firstMonthDate);
        const lastDateStr = toCustomISOFormat(lastMonthDate);

        return new Promise((resolve, reject) => {
            const transaction = this.#db.transaction("appointments", "readonly");
            const objectStoreElement = transaction.objectStore("appointments");
            const dateIndex = objectStoreElement.index("fecha_idx")
            const request = dateIndex.getAll(IDBKeyRange.bound(firstDateStr, lastDateStr));

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("¡Ops...! Ha ocurrido un error obteniendo los registro"));
        })
    }

    async getRecordsByIds(objectStore, ids){
        const records = await this.getRecords(objectStore);
        return records
            .filter(record => ids.includes(record.id))
            .map(record => ([record.id, record.nombre])); // We return an array where each position is an array with the id and the name
    }
}

export default new DB();