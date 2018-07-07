const closeAlertMessageButtons = document.querySelectorAll('.close-alert-message');
const deleteThisButtons = document.querySelectorAll('.delete-this');
const confirmDeleteButton = document.querySelector('.confirm-delete');
const overlay = document.querySelector('.overlay');
const title = document.querySelector('.overlay-alert-message h4').textContent;

// All the delete messages are returning undefined due to not being able to reach the .delete routes
function deleteThisUser(url, user_id){  
    console.log("USER ID:", user_id);
    fetch(`${url}/${user_id}`, {
        method: 'DELETE',
        mode: 'cors'
    }).then(response => {
        console.log(response.ok);
        return response;
    })
    .then(message => {
        console.log(message.status);
    })
    .catch(error => console.log(`There was an error: ${error}`));
}
function deleteThisPage(page_id){
    console.log("PAGE ID:", page_id);
    fetch(`${url}/${page_id}`, {
        method: 'DELETE',
        mode: 'cors'
    }).then(response => {
        console.log(response.ok);
        return response;
    })
    .then(message => {
        console.log(message.status);
    })
    .catch(error => console.log(`There was an error: ${error}`));
}
function deleteThisPDF(pdf_name){
    console.log("PDF NAME:", pdf_name);
    fetch(`${url}/${pdf_name}`, {
        method: 'DELETE',
        mode: 'cors'
    }).then(response => {
        console.log(response.ok);
        return response;
    })
    .then(message => {
        console.log(message.status);
    })
    .catch(error => console.log(`There was an error: ${error}`));
}

/* Toggle Warning Message */
const toggleAlertMessage = function () {
    overlay.classList.toggle("show");
};


/* Necessary Variables for scalability */
let inputFieldId = '';
let inputFieldName = '';
const populateNotificationMessageContentWithName = function (index){
        const placeholder = document.querySelector('.strong');
        const inputIdField = document.querySelector('.inputFieldId');
        const inputFieldName = document.querySelector('.inputFieldName');
        let name = document.querySelectorAll('.this_name')[index].value;
        let id = document.querySelectorAll('.this_id')[index].value;
        inputIdField.value = id;
        inputFieldName.value = name;
        placeholder.textContent = name;
        setVariablesDataFromHiddenInputFields(id, name);
};
/* This function sets above variables with data from hidden input fields */
const setVariablesDataFromHiddenInputFields = function(id, name){
    /* We just need either the id for pages and users or the name for the pdf files */
    inputFieldId = id,
    inputFieldName = name;
    console.log(inputFieldId, inputFieldName);
};
/* Uses the above variables to delete an item */
const confirmDeleteMessage = function (event){
    event.preventDefault();
    switch(title){
        case "Delete User": deleteThisUser('/users/delete-user', inputFieldId);
            break;
        case "Delete Page": deleteThisPage('/users/delete-page', inputFieldId);
            break;
        case "Delete PDF": deleteThisPDF('/users/manage-pdfs', inputFieldName);
            break;
    }
}
/* Attach Event Listeners to Buttons */
confirmDeleteButton.addEventListener('click', function(event) {
    confirmDeleteMessage(event);
});
closeAlertMessageButtons.forEach(button => {
    button.addEventListener('click', function () {
        toggleAlertMessage();
    });
});
deleteThisButtons.forEach((button, index) => {
    button.addEventListener('click', function () {
        toggleAlertMessage();
        populateNotificationMessageContentWithName(index);  
    }, index);
});