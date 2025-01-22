export const userDefault = {
    name: "Usuario",
    email: "",
    phone: "",
    role: "Emprendedor",
    avatar: "man-1"
}

export const appointmentStatusIcon = {
  completada: "ri-checkbox-circle-fill",
  pendiente: "ri-hourglass-fill",
  cancelada: "ri-close-circle-fill"
}

export const validationFormConfig = {
    'required': {
      validate: (value) => value.trim() !== '',
      message: '¡El campo es obligatorio!'
    },
    'email': {
      validate: (value) => value === "" || emailRegex.test(value),
      message: '¡Formato de correo inválido!'
    },
    'phone': {
      validate: (value) => value === "" || phoneRegex.test(value),
      message: '¡Formato de telefono inválido!'
    }
};

const emailRegex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
const phoneRegex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;