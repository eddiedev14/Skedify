import LocalStorage from "../classes/LocalStorage.js";
import DB from "../classes/DB.js";

class Alert{
    showInputAlert(input, message){
        if (!input.classList.contains("error")){
            input.classList.add("error");
        }
        
        const previousSpan = input.nextElementSibling;
        if (previousSpan) previousSpan.remove();
        const span = document.createElement("SPAN");
        span.textContent = message;
        input.parentElement.appendChild(span);
    }

    clearInputAlert(input){
        if (input.classList.contains("error")) {
            input.classList.remove("error");
            input.nextElementSibling.remove();
        }
    }

    showStatusAlert(type, title, message, callback = null){
        Swal.fire(title, message, type).then(() => {
            if (callback) {
                callback();
            }
        });
    }

    showConfirmationAlert(objectStore, id, foreignKeyPropertie){
        Swal.fire({
            title: "¡Confirmación!",
            text: "¿Está seguro de eliminar el registro seleccionado?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: `Cancelar`
            }).then((result) => {
            if (result.isConfirmed) {
                DB.deleteRecord(objectStore, id, foreignKeyPropertie)
            }
        });
    }

    showConfirmationMovementAlert(){
        return Swal.fire({
            title: "¡Confirmación!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Moverla!",
            cancelButtonText: `Cancelar`,
            html: `
              <p>¿Está seguro de mover la cita al día seleccionado?</p>
              <div style="margin-top: 10px;">
                <input type="checkbox" id="noAskAgain">
                <label for="noAskAgain">No volver a Preguntar</label>
              </div>
            `,
          })
    }

    showCalendarInfo(){
        Swal.fire({
            title: "Información",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Preguntar Nuevamente",
            cancelButtonText: `Entendido`,
            html: `
              <p>Ten en cuenta lo siguiente antes de continuar:</p>
              <ul style="margin-top: 10px; list-style-position: inside; font-size: 16px; text-align: left;">
                <li>El movimiento de citas solo está disponible en desktops.</li>
                <li>Se puede mover una cita arrastrando el elemento deseado.</li>
                <li>No se podrá mover citas a otro mes, debe editarse desde el panel de control.</li>
                <li>Al arrastrar una cita solo se actualizará el día (sin incluir la hora)</li>
                <li>Haz clic en una cita o su día para más detalles.</li>
                <li>Presiona "Preguntar nuevamente" para reactivar la confirmación de movimiento.</li>
              </ul>
            `,
        }).then(result => {
            if (result.isConfirmed) {
                LocalStorage.resetMovementConfirmation();
            }
        })
    }
}

export default new Alert();