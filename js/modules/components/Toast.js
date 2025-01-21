class Toast {
    constructor() {
        this.notyf = null;
        if (typeof Notyf !== "undefined") {
            this.notyf = new Notyf({
                position: {
                    x: "right",
                    y: "top",
                },
            });
        }
    }

    success(message) {
        if (this.notyf) {
            this.notyf.success(message);
        }
    }
}

export default new Toast();