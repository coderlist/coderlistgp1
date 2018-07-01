const closeAlertMessageButtons = document.querySelectorAll('.close-alert-message');
const deleteThisButtons = document.querySelectorAll('.delete-this');
const confirmDeleteButton = document.querySelector('.confirm-delete');
const overlay = document.querySelector('.overlay');
const title = document.querySelector('.overlay-alert-message h4').textContent;
function deleteThis(url, id){
    return fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: id
    }).then(response => console.log(response));
}

/* Toggle Warning Message */
const toggleAlertMessage = function () {
    overlay.classList.toggle("show");
};
const getDataFromInputFields = function (index){
        console.log(index);
        const placeholder = document.querySelector('.strong');
        let name = document.querySelectorAll('.this_name')[index].value;
        let id = document.querySelectorAll('.this_id')[index].value;
        placeholder.textContent = name;
};
const confirmDeleteMessage = function (){
    console.log(title);
    switch(title){
        case "Delete User": deleteThis('/delete-user',id);
            break;
        case "Delete Page": deleteThis('/delete-page',id);
            break;
        case "Delete PDF": deleteThis('/delete-pdf',id);
            break;
    }
    event.preventDefault();
}
/* Attach Event Listeners to Buttons */
confirmDeleteButton.addEventListener('click', function(event) {
    confirmDeleteMessage();
    
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