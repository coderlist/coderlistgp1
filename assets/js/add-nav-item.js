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
    .then(function (response) {
        return response.json();
    }).then(function (data) {
        data.forEach(page => {
            console.log(page.page);
            /* If parent page has children */
            if (page.children !== null) {
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
    }).catch(function (error) {
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

/* Create hidden input field to hold ids */
const createMainNavItemHiddenInputIDField = function () {
    return '<input type="hidden" class="main-nav-item-id" value="null"/>';
};
const createSubNavItemHiddenInputIDField = function () {
    return '<input type="hidden" class="sub-nav-item-id" value="null"/>';
};
/* Creates Input Field */
const createInputFieldPageName = function (inputFieldName) {
    let input = "";
    switch (inputFieldName) {
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
    switch (pageName) {
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
const createButtonElement = function (className) {
    const button = `<button href="javascript:void(0)" class="btn btn-secondary btn-sm ${className}">Save</button>`;
    return `<td>${button}</td>`;
};

/* Display menu items */
const menuItemList = function () {
    /* Append all elements to the html variable */
    let html = '';
    html = createMainNavItemHiddenInputIDField() +
        createInputFieldPageName(inputFieldName) +
        createSelectionMenu() +
        createInputFieldPageName(inputFieldOrderNumber) +
        createButtonElement("save-menu-item");
    return html;
};
/* Submenu items have two extra elements */
const subMenuItemList = function () {
    let html = '';
    html = createSubNavItemHiddenInputIDField() +
        createInputFieldPageName(inputFieldName) +
        createSelectionMenu(parentMenuItemPage) +
        createSelectionMenu(childMenuItemPage) +
        createInputFieldPageName(inputFieldOrderNumber) +
        createButtonElement("save-sub-menu-item");
    return html;
};
/* Function to prepend the new item */
const addNewMenuItem = function (event) {
    if (event.target.classList.contains("sub-menu-item-button")) {
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

/* 
 *
 *   Add New Menu Item Buttons
 *
 */
addNewMenuItemButton.forEach(button => {
    button.addEventListener('click', (event) => {
        addNewMenuItem(event);
    });
});



/* Save New Items into DB */
function saveNewMenuItem(index) {
    console.log(index);
};

function saveNewSubMenuItem(index) {
    console.log(index);
};

/**
 * Get the tbody
 */
let menuTable = document.querySelector('.table-menu-items');
let subMenuTable = document.querySelector('.table-sub-menu-items');

/**
 * 
 * Gets the index of the respective row 
 * Where the button is located at
 * 
 */


function getMenuIndex(buttonTarget) {
    /* Get updated state of the nodes */
    menuTable = document.querySelector('.table-menu-items');
    console.log(menuTable);
    let buttonMenuIndex;
    let rowIndex = buttonMenuIndex;
    let found = false;
    for (let i = 0, rows = menuTable.rows; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0, cells = row.cells; j < cells.length; j++) {
            const cell = cells[j];
            if (buttonTarget.classList.contains('save-menu-item')) {
                console.log("Found it at index: ", i)
                buttonMenuIndex = i;
                found = !found;
                break;
            } else {
                return;
            }
        }
        if(found === true){
            break;
        }
    }
    found = !found;
    console.log(buttonMenuIndex);
}


function getSubMenuIndex(buttonTarget) {
    /* Get updated state of the nodes */
    subMenuTable = document.querySelector('.table-sub-menu-items');
    console.log(subMenuTable);
    let buttonSubMenuIndex = 0;
    let found = false;
    for (let i = 0, rows = subMenuTable.rows; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0, cells = row.cells; j < cells.length; j++) {
            const cell = cells[j];
            if (buttonTarget.classList.contains('save-sub-menu-item')) {
                console.log("Found it at index: ", i)
                buttonSubMenuIndex = i;
                found = !found;
                break;
            } else {
                return;
            }
        }
        if(found === true){
            break;
        }
    }
    found = false;
    console.log(buttonSubMenuIndex);
}

/*
 *
 * Event delegation to help with dynamically created items:
 * Not working yet, for some unknown reason
 *
 */

menuTable.addEventListener('click', event => {
    const buttonTarget = event.target;
    event.stopPropagation();
    getMenuIndex(buttonTarget);
});

subMenuTable.addEventListener('click', event => {
    const buttonTarget = event.target;
    event.stopPropagation();
    getSubMenuIndex(buttonTarget);
});

