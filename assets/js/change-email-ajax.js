function confirmationMessagesAndStatus(message){
    const confirmationTitle = document.querySelector('.confirmation-overlay-title');
    const confirmationMessage= document.querySelector('.confirmation-overlay-message');
    if(message.status === "SUCCESS"){
        confirmationTitle.textContent = message.status;
        confirmationMessage.textContent = message.message;
        toggleChangeEmailMessage();
    } else if (message.status === "FAILURE" && message.message === "Invalid credentials"){
        confirmationTitle.textContent = message.status;
        confirmationMessage.textContent = message.message;
        toggleChangeEmailMessage();
    } else if(message.status === "FAILURE"){
        confirmationTitle.textContent = message.status;
        confirmationMessage.textContent = message.message;
        toggleChangeEmailMessage();
    }
}

const confirmationOverlay = document.querySelector('.confirmation-overlay');
const closeConfirmationButton = document.querySelector('.close-confirmation-message');
let confirmationTimeOut;

function toggleChangeEmailOverlay (callback){
    if(confirmationOverlay !== null){
        if(confirmationOverlay.classList.contains("hide")){
            toggleChangeEmailMessage();
        }
    }
    if(callback){
        confirmationTimeOut = setTimeout(callback, 3000);
    }

}
function toggleChangeEmailMessage(){
    // toggle flashOverlay
    // If it is displayed, hide it
    // Otherwise, display it
    confirmationOverlay.classList.toggle("hide");
    // If the time out is not undefined
    // It means it has a defined value
    // clearTimeOut, will clear the setTimeOut method from the call stack 
    toggleChangeEmailOverlay(closeChangeEmailMessage);
}

function closeChangeEmailMessage(){
    confirmationOverlay.classList.toggle("hide");
    clearTimeout(confirmationTimeOut);
}

const changeEmailButton = document.querySelector('.change-email-btn');

const postEmailChangeRequestData = function(){
    const data = {
        password: document.querySelector('.change-email-password').value,
        new_email: document.querySelector('.new-email').value,
        confirm_new_email: document.querySelector('.confirm-email').value
    };
    fetch(`/users/change-email-request`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(response => {
        return response.json();
    })
    .then(message => {
        confirmationMessagesAndStatus(message);
    })
    .catch(error => {
        console.log(`There was an error: ${error}`)
    });
};



// Add event listeners
closeConfirmationButton.addEventListener('click', function () {
    closeChangeEmailMessage();
});

changeEmailButton.addEventListener('click', (event) => {
    postEmailChangeRequestData();
    event.preventDefault();
});