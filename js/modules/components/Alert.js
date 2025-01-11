class Alert{
    showInputAlert(input, message){
        if (input.classList.contains("error")) return;
        input.classList.add("error");
        
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
}

export default new Alert();