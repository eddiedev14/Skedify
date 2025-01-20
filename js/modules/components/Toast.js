const notyf = new Notyf({
    position: {
        x: "right",
        y: "top"
    }
});

export function showSuccessToast(message) {
    notyf.success(message);
}