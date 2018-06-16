/*
 *   Variables for
 *   Main menu navigation table
 *   Main menu add new item button
 *   Sub menu navigation table
 *   Sub menu add new item button
 */
const tableMenuItem = document.querySelector(".table-menu-items");
const addNewMenuItemButton = document.querySelectorAll(".add-new-item-button");
const tableSubMenuItem = document.querySelector(".table-sub-menu-items");
/* I will need to fetch this data from the database
   For the options in the menu.
   Hardcoding an array of names to see how it works.
*/
const arrNames = ["no-link", "about", "workshops"];
/* Creates Input Field */
const createInputFieldPageName = function () {
    const input = `<input type="text" class="form-control" name="page_name" placeholder="Page Name">`;
    return `<td>${input}</td>`;
};
const createInputFieldOrderNumber = function () {
    const input = `<input type="text" class="form-control page-order" name="page_order" placeholder="1">`;
    return `<td>${input}</td>`;
};
/* Creates selection control menu */
const createSelectionMenu = function (pageName) {
    const options = arrNames.map((option, index) => {
        return `<option value="${index}">${option}</option>`
    });
    let select = ``;
    switch(pageName){
        case "parentPage":
            select = `<td><select name="parent_page" class="form-control custom-select">
            ${options}
            </select></td>`;
            break;
        case "childPage":
            select = `<td><select name="child_page" class="form-control custom-select">
            ${options}
            </select></td>`;
            break;
        default:
            select = `<td><select name="menu_page" class="form-control custom-select">
            ${options}
            </select></td>`;
    }
    return select;
   ;
};
/* Creates an Anchor Element */
const createAnchorElement = function () {
    const anchor = `<a href="javascript:void(0)" class="btn btn-secondary btn-sm">Save</a>`
    return `<td>${anchor}</td>`
};

/* Display menu items */
const menuItemList = function () {
    /* Append all elements to the html variable */
    let html = '';
    for (let i = 0; i < 4; i++) {
        let thisNode = '';
        switch (i) {
            case 0:
                thisNode = createInputFieldPageName();
                break;
            case 1:
                thisNode = createSelectionMenu();
                break;
            case 2:
                thisNode = createInputFieldOrderNumber();
                break;
            case 3:
                thisNode = createAnchorElement();
                break;
        }
        html += thisNode;
    }
    return html;
};
/* Submenu items have two extra elements */
const subMenuItemList = function () {
    const parentPage = "parentPage";
    const childPage = "childPage";
    let html = '';
    for (let i = 0; i < 5; i++) {
        let thisNode = '';
        switch (i) {
            case 0:
                thisNode = createInputFieldPageName();
                break;
            case 1:
                thisNode = createSelectionMenu(parentPage);
                break;
            case 2:
                thisNode = createSelectionMenu(childPage);
                break;
            case 3:
                thisNode = createInputFieldOrderNumber();
                break;
            case 4:
                thisNode = createAnchorElement();
                break;
        }
        html += thisNode;
    }
    return html;
};
/* Function to prepend the new item */
const addNewMenuItem = function (event) {
    if (event.target.classList.contains("sub-menu-item-button") ) {
        /* Append the result of createTableData */
        const html = `<tr>${subMenuItemList()}</tr>`
        /* Insert item before the first child */
        tableSubMenuItem.insertAdjacentHTML('afterbegin', html);
    } else {
        /* Append the result of createTableData */
        const html = `<tr>${menuItemList()}</tr>`
        /* Insert item before the first child */
        tableMenuItem.insertAdjacentHTML('afterbegin', html);
    }
};
/* Event Listeners */
addNewMenuItemButton.forEach( button => {
    button.addEventListener('click', (event) => {
        addNewMenuItem(event);
    });
});