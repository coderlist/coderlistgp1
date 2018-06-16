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
 *   Array of Objects to hold their attributes
 *   type
 *   class
 *   name
 *   placeholder
 *   value
 *   href
 */
/* Input Page Name Object */
const inputNameObj = {
    type: ["type", "text"],
    className: ["class", "form-control"],
    name: ["name", "page_name"],
    placeholder: ["placeholder", "Page Name"]
};
/* Input Page Order Object */
const inputOrderObj = {
    type: ["type", "text"],
    className: ["class", "form-control page-order"],
    name: ["name", "page_order"],
    placeholder: ["placeholder", "1"]
};
/* Select Page Menu */
const selectionMenu = {
    name: ["name", "menu_page"],
    className: ["class", "form-control custom-select"]
};
/* Save Page Object */
const anchorLink = {
    url: ["href", "javascript:void(0)"],
    className: ["class", "btn btn-secondary btn-sm"]
};
const parentSelectionMenu = {
    name: ["name", "parent_page"],
    className: ["class", "form-control custom-select"]
};
const childSelectionMenu = {
    name: ["name", "child_page"],
    className: ["class", "form-control custom-select"]
};
/* I will need to fetch this data from the database
   For the options in the menu.
   Hardcoding an array of names to see how it works.
*/
const arrNames = ["no-link", "about", "workshops"];
/* Creates Input Field */
const createInputField = function (obj) {
    const input = document.createElement("INPUT");
    const element = addAttributesToThisObject(obj, input);
    return element;
};
/* Creates selection control menu */
const createSelectionMenu = function (obj) {
    const select = document.createElement("SELECT");
    const element = addAttributesToThisObject(obj, select);
    element.appendChild(createOptionField());
    return element;
};
/*Creates option fields -> Based on what pages are available*/
const createOptionField = function (obj, element) {
    /* Document Fragment to append all the child nodes */
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 3; i++) {
        const option = document.createElement("OPTION");
        const name = arrNames[i];
        const text = document.createTextNode(name);
        option.appendChild(text);
        fragment.appendChild(option);
    }
    return fragment;
};
/* Creates an Anchor Element */
const createAnchorElement = function (obj) {
    const anchor = document.createElement("A");
    const text = document.createTextNode("Save");
    anchor.appendChild(text);
    const element = addAttributesToThisObject(obj, anchor);
    return element;
};
/*Adds attributes to the current object*/
const addAttributesToThisObject = function (obj, element) {
    for (let prop in obj) {
        element.setAttribute(obj[prop][0], obj[prop][1]);
    }
    return element;
};
/* Display menu items */
const menuItemList = function () {
    /* Document Fragment to append all the child nodes */
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 4; i++) {
        const td = document.createElement("TD");
        let thisNode = "";
        switch (i) {
            case 0:
                thisNode = createInputField(inputNameObj);
                break;
            case 1:
                thisNode = createSelectionMenu(selectionMenu);
                break;
            case 2:
                thisNode = createInputField(inputOrderObj);
                break;
            case 3:
                thisNode = createAnchorElement(anchorLink);
                break;
        }
        td.appendChild(thisNode);
        fragment.appendChild(td);
    }
    return fragment;
};
/* Submenu items have two extra elements */
const subMenuItemList = function () {
    /* Document Fragment to append all the child nodes */
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 5; i++) {
        const td = document.createElement("TD");
        let thisNode = "";
        switch (i) {
            case 0:
                thisNode = createInputField(inputNameObj);
                break;
            case 1:
                thisNode = createSelectionMenu(parentSelectionMenu);
                break;
            case 2:
                thisNode = createSelectionMenu(childSelectionMenu);
                break;
            case 3:
                thisNode = createInputField(inputOrderObj);
                break;
            case 4:
                thisNode = createAnchorElement(anchorLink);
                break;
        }
        td.appendChild(thisNode);
        fragment.appendChild(td);
    }
    return fragment;
};
/* Function to prepend the new item */
const addNewMenuItem = function (event) {
    /* Create a new table row DOM NODE */
    const tableRow = document.createElement("TR");
    if (event.target.classList.contains("sub-menu-item-button") ) {
        tableRow.appendChild(subMenuItemList());
        const firstChild = tableSubMenuItem.firstChild;
        tableSubMenuItem.insertBefore(tableRow, firstChild);
    } else {
        /* Append the result of createTableData */
        tableRow.appendChild(menuItemList());
        /* Get the first child node of parent element */
        const firstChild = tableMenuItem.firstChild;
        /* Insert item before the first child */
        tableMenuItem.insertBefore(tableRow, firstChild);
    }
};
/* Event Listeners */
addNewMenuItemButton.forEach( button => {
    button.addEventListener('click', (event) => {
        addNewMenuItem(event);
    });
});