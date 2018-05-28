// Prevent form from being submitted if password1 and password2 don't match
// Passwords
// Reset Password Button
const resetPasswordButton = document.querySelector('.form-btn');
const checkIfPasswordsMatch = function (pw1, pw2, event) {
    if(pw1 === pw2){
        return true;
    }
    // Display Error Div
    const displayError = document.querySelector('.error-pw');
    // Add New Class
    displayError.className += "display";
    // Prevent the form of being submitted
    event.preventDefault();
    return false;
};

// Event Listener
resetPasswordButton.addEventListener('click', function (event) {
    // We just need to have the values when we try to submit the form
    const password1 = document.querySelector('#password').value;
    const password2 = document.querySelector('#password2').value;
    checkIfPasswordsMatch(password1, password2, event);
}, false);