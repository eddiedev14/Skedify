import { formatTitle } from "../funciones.js";
import UI from "../classes/UI.js";

export function createTableInstance(records) {
    if (records.length === 0) {
        UI.showRecordsNotFoundDiv()
        return;
    }

    const columns = Object.keys(records[0]).map(key => ({
        title: formatTitle(key),
        data: key,
        render: key === "estado" 
                ? function(data, _, row) {
                    return `<button class="table__status table__status--${data.toLowerCase()}" data-id="${row.id}">${data}</button>`;
                }
                : undefined
    }))

    //Pushing the "Actions" column
    columns.push({
        title: 'Acciones',
        data: null,
        render: function(row) {
            return `
                <button class="table__btn table__btn--edit" data-id="${row.id}"><i class="ri-edit-box-fill"></i></button>
                <button class="table__btn table__btn--delete" data-id="${row.id}"><i class="ri-delete-bin-fill"></i></button>
            `;
        }
    })

    //Creating the Datatable Instance
    const table = new DataTable('#table', {
        data: records,
        columns,
        pageLength: 10,
        lengthMenu: [5, 10, 20],
        responsive: true,
        language: {
            "url": "/js/lib/datatables-spanish.json"
        }
    });
}