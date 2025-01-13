export function createTableInstance(records) {
    const table = new DataTable('#table', {
        data: records,
        columns: [
            { title: "ID", data: "id" },
            { title: "Nombre", data: "name" },
            { title: "Descripción", data: "description" },
            { title: "Precio", data: "price" },
            {
                title: 'Acciones',
                data: null,
                render: function(row) {
                    return `
                        <button class="table__btn table__btn--edit" data-id="${row.id}"><i class="ri-edit-box-fill"></i></button>
                        <button class="table__btn table__btn--delete" data-id="${row.id}"><i class="ri-delete-bin-fill"></i></button>
                    `;
                }
            }
        ],
        pageLength: 10,
        lengthMenu: [5, 10, 20],
        responsive: true,
        language: {
            "url": "/js/lib/datatables-spanish.json"
        }
    });
}