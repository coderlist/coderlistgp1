const closeAlertMessageButtons = document.querySelectorAll('.close-alert-message');
const deleteThisButtons = document.querySelectorAll('.delete-this');
const confirmDeleteButton = document.querySelector('.confirm-delete');
const overlay = document.querySelector('.overlay');
const title = document.querySelector('.overlay-alert-message h4').textContent;

function deleteThisUser(url, user_id){
    console.log("User Id:", user_id);
    fetch(url, {
        method: 'POST',
        body: user_id,
        headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
        credentials: 'include',
        mode: 'same-origin'
    }).then(response => {
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.url);
        console.log(response.headers);
        response.text();
    })
    .catch(error => console.log(`There was an error: ${error}`));
}
function deleteThisPage(url, page_id){
    console.log("Page Id:", page_id);
    fetch(url, {
        method: 'POST',
        body: page_id,
        headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
        credentials: 'include',
        mode: 'same-origin'
    }).then(response => {
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.url);
        console.log(response.headers);
        response.text();
    })
    .catch(error => console.log(`There was an error: ${error}`));
}
function deleteThisPDF(url, pdf_id){
    console.log("PDF Id:", pdf_id);
    fetch(url, {
        method: 'POST',
        body: pdf_id,
        headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
        credentials: 'include',
        mode: 'same-origin'
    }).then(response => {
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.url);
        console.log(response.headers);
        response.text();
    })
    .catch(error => console.log(`There was an error: ${error}`));
}

/* Toggle Warning Message */
const toggleAlertMessage = function () {
    overlay.classList.toggle("show");
};
const getDataFromInputFields = function (index){
        const placeholder = document.querySelector('.strong');
        const inputIdField = document.querySelector('.inputFieldId');
        let name = document.querySelectorAll('.this_name')[index].value;
        let id = document.querySelectorAll('.this_id')[index].value;
        inputIdField.value = id;
        placeholder.textContent = name;
};
const confirmDeleteMessage = function (event){
    event.preventDefault();
    const inputIdField = document.querySelector('.inputFieldId');
    let id = inputIdField.value;
    switch(title){
        case "Delete User": deleteThisUser('/users/delete-user', id);
            break;
        case "Delete Page": deleteThisPage('/users/delete-page', id);
            break;
        case "Delete PDF": deleteThisPDF('/users/delete-pdf', id);
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
        getDataFromInputFields(index);  
    }, index);
});