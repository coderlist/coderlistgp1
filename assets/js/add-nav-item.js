/* Navigation item:
   On click add a new item to the end of the list
   This item should have empty fields
*/
const addNewMenuItemButton = document.querySelector(".add-new-menu-item");
const addNewSubMenuItemButton = document.querySelector(".add-new-sub-menu-item");
const tableMenuItem = document.querySelector(".table-menu-item");
const tableSubMenuItem = document.querySelector(".table-sub-menu-item");

/* Add a new item to the menu */
const addNewMenuItem = function (event) {
    /* Menu Items */
    let html = '';
    let openTr = '<tr>';
    let openTd = '<td>';
    let closeTr = '</tr>';
    let closeTd = '</td>';
    let inputName = '<input type="text" class="form-control" name="page_name" placeholder="Page Name">';
    let inputOrder = '<input type="text" class="form-control page-order" name="page_order" placeholder="0">';
    let saveButton = '<a href="javascript:void(0)" class="btn btn-secondary btn-sm">Save</a>';
    if (event.target.classList.contains("add-new-sub-menu-item")) {
        /* This menu will have to be populated with a for loop */
        let parentPage = '<select name="parent_page" class="form-control custom-select">' +
        '<option value="1">Workshops</option>' +
        '<option value="2">about</option>' +
        '<option value="3">workshops</option>' +
        '</select>';
        /* This menu will have to be populated with a for loop */
        let childPage = '<select name="child_page" class="form-control custom-select">' +
        '<option value="1">Private Sessions</option>' +
        '<option value="2">about</option>' +
        '<option value="3">workshops</option>' +
        '</select>';
        html = openTr +=
        openTd += inputName += closeTd += 
        openTd += parentPage += closeTd +=
        openTd += childPage += closeTd +=
        openTd += inputOrder += closeTd += 
        openTd += saveButton += closeTd += 
        closeTr;
        tableSubMenuItem.innerHTML += html;
    } else {
        /* This menu will have to be populated with a for loop */
        let selectMenuPage = '<select name="menu_page" class="form-control custom-select">' +
            '<option value="1">no-link</option>' +
            '<option value="2">about</option>' +
            '<option value="3">workshops</option>' +
            '</select>';
        html = openTr +=
        openTd += inputName += closeTd += 
        openTd += selectMenuPage += closeTd += 
        openTd += inputOrder += closeTd += 
        openTd += saveButton += closeTd += 
        closeTr;
        tableMenuItem.innerHTML += html;
    }
    
};

/* Event Listeners */
addNewMenuItemButton.addEventListener('click', (event) => {
    addNewMenuItem(event);
});
addNewSubMenuItemButton.addEventListener('click', (event) => {
    addNewMenuItem(event);
});