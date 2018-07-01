const closeAlertMessageButtons = document.querySelectorAll('.close-alert-message');
const deleteThisButtons = document.querySelectorAll('.delete-this');
const confirmDeleteButton = document.querySelector('.confirm-delete');
const overlay = document.querySelector('.overlay');
const title = document.querySelector('.overlay-alert-message h4').textContent;

function deleteThisUser(url, user_id){
    fetch(url, {
        method: 'post',
        credentials: 'include',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            user_id: parseInt(user_id)
        })
    }).then(response => console.log(response.body))
    .catch(error => console.log(`There was an error: ${error}`));
}
function deleteThisPage(url, page_id){
    fetch(url, {
        method: 'post',
        credentials: 'include',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            page_id: parseInt(page_id)
        })
        
    }).then(response => console.log(response.body))
    .catch(error => console.log(`There was an error: ${error}`));
}
function deleteThisPDF(url, pdf_id){
    fetch(url, {
        method: 'post',
        credentials: 'include',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            user_id: parseInt(pdf_id)
        })
    }).then(response => response)
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
    console.log(id);
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