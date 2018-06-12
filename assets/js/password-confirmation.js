// Prevent form from being submitted if newPassword and confirmPassword don't match
// Passwords
// Buttons
const passwordConfirmation = document.querySelector('.password-confirmation');
const passwordAlertMessage = document.querySelector('.password-alert');
const closePasswordAlertMessage = document.querySelector('.close-alert-message');
// Toggle Password Alert Message
const togglePasswordAlertMessage = () => {
    passwordAlertMessage.classList.toggle("show");
};
const checkIfPasswordsMatch = function (pw1, pw2, event) {
    if(pw1 === pw2){
        return true;
    }
    togglePasswordAlertMessage();
    // Prevent the form of being submitted
    event.preventDefault();
    return false;
};
// Attach Event Listeners to buttons
passwordConfirmation.addEventListener('click', (event) => {
    // We just need to have the values when we try to submit the form
    const newPassword = document.querySelector('#newPassword').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;
    checkIfPasswordsMatch(newPassword, confirmPassword, event);
}, false);

closePasswordAlertMessage.addEventListener('click', () =>{
    togglePasswordAlertMessage();
});