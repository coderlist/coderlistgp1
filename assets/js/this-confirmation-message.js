// Prevent form from being submitted if newPassword and confirmPassword don't match
// Passwords
// Buttons
const thisConfirmation = document.querySelector('.password-confirmation');
const thisAlertMessage = document.querySelector('.password-alert');
const closeThisAlertMessage = document.querySelector('.close-alert-message');
// Toggle Password Alert Message
const toggleThisAlertMessage = () => {
    thisAlertMessage.classList.toggle("show");
};
const checkIfTheseMatch = function (canThis, confirmThis, event) {
    if(canThis === confirmThis){
        return true;
    }
    toggleThisAlertMessage();
    // Prevent the form of being submitted
    event.preventDefault();
    return false;
};
// Attach Event Listeners to buttons
thisConfirmation.addEventListener('click', (event) => {
    // We just need to have the values when we try to submit the form
    const canThis = document.querySelector('#newPassword').value;
    const confirmThis = document.querySelector('#confirmPassword').value;
    checkIfTheseMatch(canThis, confirmThis, event);
}, false);

closeThisAlertMessage.addEventListener('click', () =>{
    toggleThisAlertMessage();
});