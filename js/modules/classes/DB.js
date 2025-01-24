import { modalAppointmentStateInput } from "../selectores.js";
import { getFormData, goToControlPage, reloadPage, getDailyRange } from "../funciones.js";
import Toast from "../components/Toast.js";
import Alert from "../components/Alert.js";
import UI from "./UI.js";

let priceServicesMap;

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
                    //Updating only the day from the original ISO date
                    const originalDateISO = appointment.fecha;
                    const [datePart, timePart] = originalDateISO.split("T");
                    const [year, month] = datePart.split("-");
                    const newDayFormatted = newDay.padStart(2, "0");
                    const fecha = `${year}-${month}-${newDayFormatted}T${timePart}`;

                    const updatedAppointment = { ...appointment, fecha }
                    const transaction = this.#db.transaction("appointments", "readwrite");
                    const objectStoreElement = transaction.objectStore("appointments");
                    const request = objectStoreElement.put(updatedAppointment);

                    request.onsuccess = () => Toast.success("¡Cita Actualizada!")
                    request.onerror = () => Alert.showStatusAlert("error", "¡Ops...! Ha ocurrido un error actualizando el registro", reloadPage); 
                })
                .catch(error => Alert.showStatusAlert("error", "¡Error!", error.message, reloadPage))
        }

    async getMonthlyAppointments([firstDateStr, lastDateStr]) {
        if (!this.#db) await this.init();

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

    //* Dashboard
    async getDailyAppointmentsCount(states = []){
        if (!this.#db) await this.init();

        //Get the daily range
        const [startOfDay, endOfDay] = getDailyRange();

        const results = {};

        return new Promise((resolve, reject) => {
            const transaction = this.#db.transaction("appointments", "readonly");
            const objectStoreElement = transaction.objectStore("appointments");
            const dateIndex = objectStoreElement.index("fecha_idx")
            const cursorRequest = dateIndex.openCursor(IDBKeyRange.bound(startOfDay, endOfDay));

            cursorRequest.onsuccess = () => {
                const cursor = cursorRequest.result;

                if (cursor) {
                    const appointment = cursor.value;
                    const state = appointment.estado;

                    //Checks if the status is one of those passed as argument
                    if (states.includes(state)) {
                        if (!results[state]) {
                            results[state] = 0;
                        }
                        results[state]++;
                    }

                    cursor.continue();
                }else{
                    resolve(results); 
                }
            }

            cursorRequest.onerror = () => reject(new Error("¡Ops...! Ha ocurrido un error obteniendo el numero total de registro"));
        });
    }

    async getRecordsCount(objectStore){
        if (!this.#db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.#db.transaction(objectStore, "readonly");
            const objectStoreElement = transaction.objectStore(objectStore);
            const countRequest = objectStoreElement.count();

            countRequest.onsuccess = () => resolve(countRequest.result);
            countRequest.onerror = () => reject(new Error("¡Ops...! Ha ocurrido un error obteniendo el numero de registros"));
        })
    }

    async getIncomes([startDate, endDate]){
        if (!this.#db) await this.init();
        if (!priceServicesMap) await this.createPriceServicesMap() 

        return new Promise((resolve, reject) => {
            //Get appointments between date range
            const transaction = this.#db.transaction("appointments", "readonly");
            const objectStoreElement = transaction.objectStore("appointments");
            const dateIndex = objectStoreElement.index("fecha_idx")
            const cursorRequest = dateIndex.openCursor(IDBKeyRange.bound(startDate, endDate));

            let incomes = 0;

            cursorRequest.onsuccess = () => {
                const cursor = cursorRequest.result;

                if (cursor) {
                    //For each appointment, the value of the service is added if its status is "Completada"
                    const appointment = cursor.value;
                    
                    if (appointment.estado === "Completada") {
                        const service = appointment.servicio;
                        incomes += priceServicesMap[service];   
                    }

                    cursor.continue();
                }else{
                    resolve(incomes)
                }
            }

            cursorRequest.onerror = () => reject(new Error("¡Ops...! Ha ocurrido un error obteniendo los ingresos de la empresa"));
        });
    }

    async createPriceServicesMap(){
        const services = await this.getRecords("services");
        priceServicesMap = Object.fromEntries(services.map(service => ([service.id, parseFloat(service.precio)])));
    }
}

export default new DB();