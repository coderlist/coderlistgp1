/* 
* Arrays to hold pages, parent pages and child pages names.
*/
const pageNames = ['no-link'];
const parentPageName = [];
const childPageName = [];
/* Options for fetch method */
const init = {
    method: 'GET',
    headers: {
        'Content-type': 'application/json'
    },
    mode: 'same-origin',
    credentials: 'include'
}
fetch('/users/page-navmenu-request', init)
        .then(function(response) {
           return response.json();
        }).then(function(data){
            data.forEach(page => {
                console.log(page.page);
                /* If parent page has children */
                if(page.children !== null){
                    /* Get page name */
                    parentPageName.push(page.page);
                    /* Get children pages */
                    page.children.forEach(child => {
                        childPageName.push(child.page);
                        console.log(child.page);
                    });
                    
                }
                /* Get Parent pages who don't have Children */
                pageNames.push(page.page);
            });
        }).catch(function(error){
            console.log("It wasn't possible to return any data from the server: ", error);
        });
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
/* 
* Important menu variables
* parentMenuItemPage defines what kind of options this menu should render -> Parent Pages
* childMenuItemPage defines what kind of options this menu should render -> Child of these Parent Pages
* inputFieldName && inputFieldOrderNumber define what kind of input should be render
* Input with for the Page Name or an input for an order number
*/
const parentMenuItemPage = "parentMenuItemPage";
const childMenuItemPage = "childMenuItemPage";
const inputFieldName = "inputFieldName";
const inputFieldOrderNumber = "inputFieldOrderNumber";
/* Creates Input Field */
const createInputFieldPageName = function (inputFieldName) {
    let input = "";
    switch(inputFieldName){
        case "inputFieldName":
            input = `<input type="text" class="form-control" name="page_name" placeholder="Page Name">`;
            break;
        case "inputFieldOrderNumber":
            input = `<input type="text" class="form-control page-order" name="page_order" placeholder="1">`;
            break;
    }
    return `<td>${input}</td>`;
};
/* Creates selection control menu */
const createSelectionMenu = function (pageName) {
    let options = '';
    let select = ``;
    switch(pageName){
        case "parentMenuItemPage":
            options = parentPageName.map((option, index) => {
                return `<option value="${index}">${option}</option>`
            });
            select = `<td><select name="parent_page" class="form-control custom-select">
            ${options}
            </select></td>`;
            break;
        case "childMenuItemPage":
            options = childPageName.map((option, index) => {
                return `<option value="${index}">${option}</option>`
            });
            select = `<td><select name="child_page" class="form-control custom-select">
            ${options}
            </select></td>`;
            break;
        default:
            options = pageNames.map((option, index) => {
                return `<option value="${index}">${option}</option>`
            });
            select = `<td><select name="menu_page" class="form-control custom-select">
            ${options}
            </select></td>`;
    }
    return select;
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
    html = createInputFieldPageName(inputFieldName) + 
        createSelectionMenu() + 
        createInputFieldPageName(inputFieldOrderNumber) + 
        createAnchorElement();
    return html;
};
/* Submenu items have two extra elements */
const subMenuItemList = function () {
    let html = '';
    html = createInputFieldPageName(inputFieldName) +
        createSelectionMenu(parentMenuItemPage) +
        createSelectionMenu(childMenuItemPage) +
        createInputFieldPageName(inputFieldOrderNumber) +
        createAnchorElement();
    return html;
};
/* Function to prepend the new item */
const addNewMenuItem = function (event) {
    if (event.target.classList.contains("sub-menu-item-button") ) {
        /* Append the result of createTableData */
        const html = `<tr>${subMenuItemList()}</tr>`;
        /* Insert item before the first child */
        tableSubMenuItem.insertAdjacentHTML('afterbegin', html);
    } else {
        /* Append the result of createTableData */
        const html = `<tr>${menuItemList()}</tr>`;
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