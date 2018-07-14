const closeAlertMessageButtons = document.querySelectorAll('.close-alert-message');
const deleteThisButtons = document.querySelectorAll('.delete-this');
const confirmDeleteButton = document.querySelector('.confirm-delete');
const overlay = document.querySelector('.overlay');
const title = document.querySelector('.overlay-alert-message h4').textContent;

// All the delete messages are returning undefined due to not being able to reach the .delete routes
function deleteThisUser(url, user_id){  
    console.log("USER ID:", user_id);
    return fetch(`${url}/${user_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors'
    }).then(response => {
        console.log(response);
        return response.json();
    })
    .then(message => {
        console.log(message.status);
    })
    .catch(error => console.log(`There was an error: ${error}`));
}
function deleteThisPage(url, page_name){
    console.log("PAGE ID:", page_name);
    return fetch(`${url}/${page_name}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors'
    }).then(response => {
        console.log(response);
        return response;
    })
    .then(message => {
        console.log(message.status);
        if(message.status == 200 ){
            window.location.href = '/users/dashboard';
        }
    })
    .catch(error => console.log(`There was an error: ${error}`));
}
function deleteThisPDF(url, pdf_name){
    console.log("PDF NAME:", pdf_name);
    return fetch(`${url}/${pdf_name}`, {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors'
    }).then(response => {
        return response;
    })
    .then(message => {
        if(message.status == 200 ){
            window.location.href = '/users/manage-pdfs';
        }
    })
    .catch(error => console.log(`There was an error: ${error}`));
}
function deleteThisImage(url, id){
    console.log("Image NAME:", id);
    return fetch(`${url}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors'
    }).then(response => {
        return response;
    })
    .then(message => {
        if(message.status == 200 ){
            window.location.href = '/users/manage-images';
        }
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
    inputFieldId = id;
    inputFieldName = name;
};
/* Uses the above variables to delete an item */
const confirmDeleteMessage = function (event){
    event.preventDefault();
    switch(title){
        case "Delete User": deleteThisUser('/users/delete-user', inputFieldId);
            break;
        case "Delete Page": deleteThisPage('/users/delete-page', inputFieldName);
            break;
        case "Delete PDF": deleteThisPDF('/users/manage-pdfs', inputFieldName);
            break;
        case "Delete Image": deleteThisImage('/users/manage-images', inputFieldId);
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