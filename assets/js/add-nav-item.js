/* 
 * Arrays to hold pages, parent pages and child pages names.
 */
const pageItems = ['no-link'];
const mainMenuItems = [];
const subMenuItems = [];
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
    }).then(function (items) {
        Object.keys(items).map(itemKey => {
            if(itemKey === "pageItems"){
                items[itemKey].map(pageItem => {
                    console.log(pageItem);
                    pageItems.push(pageItem);
                    subMenuItems.push(pageItem);
                });
            }
            if(itemKey === "mainMenuItems"){
                items[itemKey].map(mainMenuItem => {
                    console.log(mainMenuItem);
                    mainMenuItems.push(mainMenuItem);
                });
            }
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
    return '<input name="main_nav_item_id" type="hidden" class="main-nav-item-id" value="null"/>';
};
const createSubNavItemHiddenInputIDField = function () {
    return '<input name="sub_nav_item_id" type="hidden" class="sub-nav-item-id" value="null"/>';
};
/* Creates Input Field */
const createInputFieldPageName = function (inputFieldName) {
    let input = "";
    switch (inputFieldName) {
        case "menuInputFieldName":
            input = `<input type="text" class="form-control menu-page-name" name="menu_page_name" value="Page Name">`;
            break;
        case "menuInputFieldOrderNumber":
            input = `<input type="text" class="form-control page-order menu-page-order" name="menu_page_order" value="0">`;
            break;
        case "subMenuInputFieldName":
            input = `<input type="text" class="form-control sub-menu-page-name" name="sub_menu_page_name" value="Page Name">`;
            break;
        
        case "subMenuInputFieldOrderNumber":
            input = `<input type="text" class="form-control page-order sub-menu-page-order" name="sub_menu_page_order" value="0">`;
            break;
    }
    return `<td>${input}</td>`;
};
/* Creates selection control menu */
const createSelectionMenu = function (pageName) {
    let options = '';
    let select = ``;
    // console.log(parentNavItems); Working
    switch (pageName) {
        case "parentMenuItemPage":
            options = mainMenuItems.map((option) => {
                return `<option data-id="${option.item_id}" value="${option.title}">${option.title}</option>`;
            });
            select = `<td><select name="parent_page" class="form-control custom-select parent-item-select">
            ${options}
            </select></td>`;
            break;
        case "childMenuItemPage":
            options = subMenuItems.map((option) => {
                return `<option data-id="${option.page_id}" value="${option.link}">${option.link}</option>`
            });
            select = `<td><select name="child_page" class="form-control custom-select child-item-select">
            ${options}
            </select></td>`;
            break;
        default:
            options = pageItems.map((option) => {
                if(option === "no-link"){
                    return `<option data-id="" value="no-link">no-link</option>`;
                }
                return `<option data-id="${option.page_id}" value="${option.link}">${option.link}</option>`
            });
            select = `<td><select name="menu_page" class="form-control custom-select menu-items-select">
            ${options}
            </select></td>`;
    }
    return select;
};
/* Creates a Button Element */
const createButtonElement = function (className) {
    const button = `<button class="btn btn-secondary btn-sm ${className}">Save</button>`;
    return `<td>${button}</td>`;
};

/* Display menu items */
const menuItemList = function () {
    /* Append all elements to the html variable */
    let html = '';
    html = createMainNavItemHiddenInputIDField() +
        createInputFieldPageName("menuInputFieldName") +
        createSelectionMenu() +
        createInputFieldPageName("menuInputFieldOrderNumber") +
        createButtonElement("save-menu-item");
    return html;
};
/* Submenu items have two extra elements */
const subMenuItemList = function () {
    let html = '';
    html = createSubNavItemHiddenInputIDField() +
        createInputFieldPageName("subMenuInputFieldName") +
        createSelectionMenu("parentMenuItemPage") +
        createSelectionMenu("childMenuItemPage") +
        createInputFieldPageName("subMenuInputFieldOrderNumber") +
        createButtonElement("save-submenu-item");
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
        event.stopPropagation();
        event.preventDefault();
        addNewMenuItem(event);
    });
});



/**
 * Get the tbody
 */
let menuTable = document.querySelector('.table-menu-items');
let subMenuTable = document.querySelector('.table-sub-menu-items');
/**
 * Gets the Index of clicked element
 */
function getMenuIndex(buttonTarget) {
    /* If the target doesn't contain this class just return 
    *  This will prevent unnecessary side effects that
    *  Where event propagation doesn't work
    */
    if(!buttonTarget.classList.contains('save-menu-item')){
        return;
    }
    /* Get updated state of the nodes */
    let currentMenuTable = document.querySelector('.table-menu-items');
    if(!buttonTarget.classList.contains('save-menu-item')){
        return;
    }
    let buttonMenuIndex;
    let found = false;
    for (let i = 0, rows = currentMenuTable.rows; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0, cells = row.cells; j < cells.length; j++) {
            const cell = cells[j];
            if (buttonTarget === cell.children[0]) {
                if(buttonTarget.classList.contains('save-menu-item')){
                    found = !found;
                    break;
                }
            }
        }
        if(found === true){
            buttonMenuIndex = i;
            break;
        }
    }
    if(buttonMenuIndex === undefined || buttonMenuIndex === null){
        return;
    }
    found = !found;
    getMenuItemData(buttonMenuIndex);
}
/**
 * 
 * Gets the data of the elements
 * Necessary to be sent to the DB
 * 
 */
function getMenuItemData(index){
    const thisMenuItemData = {
        menuItemId: document.querySelectorAll('.main-nav-item-id')[index].value,
        menuInputField: document.querySelectorAll('.menu-page-name')[index].value,
        menuPageId: document.querySelectorAll('.menu-items-select')[index].options[document.querySelectorAll('.menu-items-select')[index].selectedIndex].getAttribute('data-id'),
        // menuItemSelectedOption: document.querySelectorAll('.menu-items-select')[index].value,
        menuItemOrderNumber: document.querySelectorAll('.menu-page-order')[index].value,
    };
    console.log("Item ID:", thisMenuItemData.menuItemId);
    console.log("Item Name:",thisMenuItemData.menuInputField);
    console.log("Item SelectedOptionID:",thisMenuItemData.menuPageId);
    // console.log("Item SelectedOption:",thisMenuItemData.menuItemSelectedOption);
    console.log("Item OrderNumber:",thisMenuItemData.menuItemOrderNumber);
   // postMenuItemData(thisTableItemData);
    postMenuItemData(thisMenuItemData);
}
/**
 * 
 * Posts data of this item to the DB
 * 
 */
function postMenuItemData(data){
    const manageNavMessage = document.querySelector('.manage-nav-message');
    return fetch(`/users/manage-nav`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(response => {
        return response;
    })
    .then(message => {
        if(message.status == 200 ){
        } else {
            manageNavMessage.textContent = message.status;
            toggleManageNavOverlay();
        }
        console.log(message);
    })
    .catch(error => {
        console.log(`There was an error: ${error}`)
    });
}
/**
 * Gets the getDeleteButtonRowIndex
 */
function getIndexOfRowWhereMenuDeleteButtonIsAt(buttonTarget) {
    /* If the target doesn't contain this class just return 
    *  This will prevent unnecessary side effects that
    *  Where event propagation doesn't work
    */
    if(!buttonTarget.classList.contains('delete-menu-item')){
        return;
    }
    /* Get updated state of the nodes */
    let currentMenuTable = document.querySelector('.table-menu-items');
    let buttonMenuIndex = 0;
    let found = false;
    for (let i = 0, rows = currentMenuTable.rows; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0, cells = row.cells; j < cells.length; j++) {
            const cell = cells[j];
            if (buttonTarget === cell.children[0]) {
                if(buttonTarget.classList.contains('delete-menu-item')){
                    found = !found;
                    break;
                }
            }
        }
        if(found === true){
            buttonMenuIndex = i;
            break;
        }
    }
    found = !found;
    if(buttonMenuIndex === undefined || buttonMenuIndex === null){
        return;
    }
    getDeleteMenuItemID(buttonMenuIndex);
}

/**
 * 
 * Gets the data of the elements
 * Necessary to be sent to the DB
 * 
 */
function getDeleteMenuItemID(index){
    const id = document.querySelectorAll('.delete-menu-item')[index].getAttribute('data-id');
    deleteMenuItemAtID(id);
}
/**
 * 
 * Deletes data of this item to the DB
 * 
 */
function deleteMenuItemAtID(itemId){
    return fetch(`users/manage-nav/${itemId}`, {
        method: "DELETE",
        mode: "cors",
        credentials: "include"
    }).then(response => {
        return response;
    })
    .then(message => {
        if(message.status == 200){
            window.location.href = '/users/manage-nav';
        }
        console.log(message);
    })
    .catch(error => console.log(`There was an error: ${error}`));
}

/**
 * Gets the Index of clicked element
 */
function getSubMenuIndex(buttonTarget) {
    /* If the target doesn't contain this class just return 
    *  This will prevent unnecessary side effects that
    *  Where event propagation doesn't work
    */
    if(!buttonTarget.classList.contains('save-submenu-item')){
        return;
    }
    /* Get updated state of the nodes */
    let currentSubMenuTable = document.querySelector('.table-sub-menu-items');
    let buttonSubMenuIndex = 0;
    let found = false;
    for (let i = 0, rows = currentSubMenuTable.rows; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0, cells = row.cells; j < cells.length; j++) {
            const cell = cells[j];
            if (buttonTarget === cell.children[0]) {
                if(buttonTarget.classList.contains('save-submenu-item')){
                    found = !found;
                    break;
                }
            }
        }
        if(found === true){
            buttonSubMenuIndex = i;
            break;
        }
    }
    found = !found;
    if(buttonSubMenuIndex === undefined || buttonSubMenuIndex === null){
        return;
    }
    getSubMenuItemData(buttonSubMenuIndex);
}

/**
 * 
 * Gets the data of the elements
 * Necessary to be sent to the DB
 * 
 */
function getSubMenuItemData(index){
    const thisMenuItemData = {
        menuItemId: document.querySelectorAll('.sub-nav-item-id')[index].value,
        menuInputField: document.querySelectorAll('.sub-menu-page-name')[index].value,
        menuParentItemSelectedOptionDataID: document.querySelectorAll('.parent-item-select')[index].options[document.querySelectorAll('.parent-item-select')[index].selectedIndex].getAttribute('data-id'),
        menuPageId: document.querySelectorAll('.child-item-select')[index].options[document.querySelectorAll('.child-item-select')[index].selectedIndex].getAttribute('data-id'),
        // menuParentItemSelectedOption: document.querySelectorAll('.parent-item-select')[index].value,
        // menuPageIdName: document.querySelectorAll('.child-item-select')[index].value,
        menuItemOrderNumber: document.querySelectorAll('.sub-menu-page-order')[index].value,
    };
    console.log("Item ID:", thisMenuItemData.menuItemId);
    console.log("Item Name:",thisMenuItemData.menuInputField);
    console.log("Item SelectedOptionDataIdParent:",thisMenuItemData.menuParentItemSelectedOptionDataID);
    console.log("Item SelectedOptionDataIdChild:",thisMenuItemData.menuPageId);
    // console.log("Item SelectedOptionParentTitle:",thisMenuItemData.menuParentItemSelectedOption);
    // console.log("Item SelectedOptionChildPage:",thisMenuItemData.menuChildItemSelectedOption);
    console.log("Item OrderNumber:",thisMenuItemData.menuItemOrderNumber);
   // postSubMenuItemData(thisTableItemData);
   postSubMenuItemData(thisMenuItemData);
}
/**
 * 
 * Posts data of this item to the DB
 * 
 */
function postSubMenuItemData(data){
    return fetch(`/users/manage-nav`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(response => {
      console.log('response :', response);
        return response;
    })
    .then(message => {
        console.log(message);
    })
    .catch(error => console.log(`There was an error: ${error}`));
}
/**
 * Gets the getDeleteButtonRowIndex
 */
function getIndexOfRowWhereSubMenuDeleteButtonIsAt(buttonTarget) {
    /* If the target doesn't contain this class just return 
    *  This will prevent unnecessary side effects that
    *  Where event propagation doesn't work
    */
    if(!buttonTarget.classList.contains('delete-submenu-item')){
        return;
    }
    /* Get updated state of the nodes */
    let currentSubMenuTable = document.querySelector('.table-sub-menu-items');
    let buttonSubMenuIndex = 0;
    let found = false;
    for (let i = 0, rows = currentSubMenuTable.rows; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0, cells = row.cells; j < cells.length; j++) {
            const cell = cells[j];
            if (buttonTarget === cell.children[0]) {
                if(buttonTarget.classList.contains('delete-submenu-item')){
                    found = !found;
                    break;
                }
            }
        }
        if(found === true){
            buttonSubMenuIndex = i;
            break;
        }
    }
    found = !found;
    if(buttonSubMenuIndex === undefined || buttonSubMenuIndex === null){
        return;
    }
    getDeleteSubMenuItemID(buttonSubMenuIndex);
}

/**
 * 
 * Gets the data of the elements
 * Necessary to be sent to the DB
 * 
 */
function getDeleteSubMenuItemID(index){
    const id = document.querySelectorAll('.delete-submenu-item')[index].getAttribute('data-id');
    console.log(id);
    deleteSubMenuItemID(id);
}
/**
 * 
 * Deletes data of this item to the DB
 * 
 */
function deleteSubMenuItemID(itemId){
    return fetch(`users/manage-nav/${itemId}`, {
        method: "DELETE",
        mode: "cors",
        credentials: "include"
    }).then(response => {
        return response;
    })
    .then(message => {
        if(message.status == 200){
            window.location.href = '/users/manage-nav';
        }
        console.log(message);
    })
    .catch(error => console.log(`There was an error: ${error}`));
}

/*
 *
 * Event delegation to help with dynamically created items
 * Working as intended
 */
menuTable.addEventListener('click', event => {
    const buttonTarget = event.target;
    event.stopPropagation();
    event.preventDefault();
    if(buttonTarget.classList.contains('save-menu-item')){
        getMenuIndex(buttonTarget);
    } else if(buttonTarget.classList.contains('delete-menu-item')){
        getIndexOfRowWhereMenuDeleteButtonIsAt(buttonTarget);
    }
});

subMenuTable.addEventListener('click', event => {
    const buttonTarget = event.target;
    event.stopPropagation();
    event.preventDefault();
    if(buttonTarget.classList.contains('save-submenu-item')){
        getSubMenuIndex(buttonTarget);
    } else if(buttonTarget.classList.contains('delete-submenu-item')){
        getIndexOfRowWhereSubMenuDeleteButtonIsAt(buttonTarget);
    }
});

