const saveThisButtons = document.querySelectorAll('.save-this');
function getThisTableItemData(index){
    const thisTableItemData = {
        pageId: document.querySelectorAll('.this_page_id')[index].value,
        isPublished: document.querySelectorAll('.is-published')[index].checked == true ? true : false,
        isHomePageGrid: document.querySelectorAll('.is-homepage-grid')[index].checked == true ? true : false,
        pageOrderNumber: document.querySelectorAll('.page-order')[index].value 
    };
    console.log(index);
    console.log(thisTableItemData);
    saveThisTableItemInDB(thisTableItemData);
}
function saveThisTableItemInDB(data){
    fetch('/users/save-order', {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(response => {
        console.log(response);
        return response;
    })
    .then(message => {
        if(message.status == 200){
            window.location.href = '/users/dashboard';
        }
        console.log(message);
    })
    .catch(error => console.log(`There was an error: ${error}`));
}

function confirmationMessagesAndStatus(message){
    const confirmationTitle = document.querySelector('.confirmation-overlay-title');
    const confirmationMessage= document.querySelector('.confirmation-overlay-message');
    console.log(confirmationTitle, confirmationMessage);
    if(message.status === "SUCCESS"){
        confirmationTitle.textContent = message.status;
        confirmationMessage.textContent = message.message;
        toggleConfirmationMessage(callMeBackWhenYouNeedMeToRedirect);
    } else if (message.status === "FAILURE"){
        confirmationTitle.textContent = message.status;
        confirmationMessage.textContent = message.message;
        toggleConfirmationMessage(callMeBackWhenYouNeedMeToRedirect);
    }
}

const confirmationOverlay = document.querySelector('.confirmation-overlay');
const closeConfirmationButton = document.querySelector('.close-confirmation-message');
let confirmationTimeOut;

function toggleConfirmationOverlay(callback){
    if(confirmationOverlay !== null){
        if(confirmationOverlay.classList.contains("hide")){
            toggleConfirmationMessage();
        }
    }
    if(callback){
        confirmationTimeOut = setTimeout(callback, 3000);
    }

}
function toggleConfirmationMessage(){
    // toggle flashOverlay
    // If it is displayed, hide it
    // Otherwise, display it
    confirmationOverlay.classList.toggle("hide");
    // If the time out is not undefined
    // It means it has a defined value
    // clearTimeOut, will clear the setTimeOut method from the call stack 
    toggleConfirmationOverlay(callMeBackWhenYouNeedMeToRedirect);
}

function closeConfirmationMessage(){
    confirmationOverlay.classList.toggle("hide");
    clearTimeout(confirmationTimeOut);
    callMeBackWhenYouNeedMeToRedirect();
}
function callMeBackWhenYouNeedMeToRedirect(){
    window.location.href = '/users/dashboard';
}

closeConfirmationButton.addEventListener('click', closeConfirmationMessage, false);

saveThisButtons.forEach((button, index) => {
    button.addEventListener('click', event => {
        getThisTableItemData(index);
        event.preventDefault();
    }, index);
});


const checkboxButtons = document.querySelectorAll('.toggle-order-number');

const toggleInputField = (index) => {
    const inputField = document.querySelectorAll('.toggle-order-number');
    let inputFieldOrderNumber = null;
    console.log(inputField.length)
    console.log(inputField.length === 1)
    console.log(inputField.length > 1)
    if(inputField[index].checked && inputField.length === 1){
        index = 0;
        inputFieldOrderNumber = document.querySelectorAll(".toggle-text")[index];
        inputFieldOrderNumber.setAttribute("style", "color");
        inputFieldOrderNumber.style.color = "rgba(0, 0, 0, 1)";
    } else if (inputField[index].checked && inputField.length > 1){
        inputFieldOrderNumber = document.querySelectorAll(".toggle-text")[index];
        inputFieldOrderNumber.setAttribute("style", "color");
        inputFieldOrderNumber.style.color = "rgba(0, 0, 0, 1)";
    }
};

checkboxButtons.forEach((button, index) => {
    button.addEventListener('change', () => {
    toggleInputField(index)
    }, false);
});


