//* Sidebar
export const sidebar = document.querySelector("#sidebar");
export const sidebarLinks = document.querySelectorAll("#sidebar a")
export const openSidebarBtn = document.querySelector(".header__menu");
export const closeSidebarBtn = document.querySelector(".sidebar__close");

//* Header
export const headerProfileAvatar = document.querySelector(".header__avatar")
export const headerProfileUser = document.querySelector(".profile__user");
export const headerProfileRole = document.querySelector(".profile__role");

//* Dashboard
export const preloader = document.querySelector("#preloader");
export const todayAppointmentStats = document.querySelector("#citas-hoy");
export const pendingAppointmentStats = document.querySelector("#citas-pendientes");
export const clientsStats = document.querySelector("#clientes-registrados");
export const servicesStats = document.querySelector("#servicios-registrados");
export const incomesStats = document.querySelector("#incomes");
export const incomesSpinner = document.querySelector("#spinner-incomes");
export const incomesRangeSelect = document.querySelector("#ingresos-select");

//* Form
export const form = document.querySelector(".form")
export const formHeading = document.querySelector(".container__heading");
export const inputs = document.querySelectorAll("input, select");
export const formSubmit = document.querySelector(".form__submit");
export const clientInput = document.querySelector("#cliente");
export const serviceInput = document.querySelector("#servicio");
export const appointmentStateContainer = document.querySelector(".form__group--hidden");

//* Tables
export const table = document.querySelector("#table");
export const loadingContainer = document.querySelector(".main__loading");
export const emptyContainer = document.querySelector(".main__empty");

//* Appointment Modal
export const modalAppointmentSubmitBtn = document.querySelector("#update-state")
export const modalAppointmentStateInput = document.querySelector(".form__input--modal");

//* Calendar
export const calendarHeading = document.querySelector("#calendar-date");
export const calendar = document.querySelector(".calendar__days");
export const calendarDays = document.querySelectorAll(".calendar__day");
export const firstDayGrid = document.querySelector(".calendar__day:first-child");
export const previousMonthBtn = document.querySelector(".calendar__button--previous");
export const nextMonthBtn = document.querySelector(".calendar__button--next");
export const infoCalendarBtn = document.querySelector(".calendar__button--info")
export const modalCalendarList = document.querySelector(".modal__list");
export const linkAppointmentsControlBtn = document.querySelector(".modal__button--control");

//* Profile Form
export const profileAvatar = document.querySelector("#avatar")

//* Avatar Modal
export const modalProfileBtn = document.querySelector("#change-avatar");
export const modal = document.querySelector(".modal");
export const modalHeading = document.querySelector(".modal__heading");
export const modalMain = document.querySelector(".modal__main");
export const modalCloseBtn = document.querySelector(".modal__close");
export const modalCancelBtn = document.querySelector(".modal__button--close");
export const modalProfileSubmitBtn = document.querySelector("#update-avatar");