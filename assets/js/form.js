// Close error message if it is open
const buttonToCloseWarningMessage = document.querySelector(".close-msg") || document.querySelector(".close-msg-pw");
// Close warning message
const closeWarningMessage = function () {
    const warningMessage = document.querySelector(".error");
    const closeErrorMessage = "close-error-msg";
    warningMessage.className = closeErrorMessage;
};
// Close Warning Message Button Event Listener
buttonToCloseWarningMessage.addEventListener("click", closeWarningMessage, false);
// Input Fields
const inputFields = document.querySelectorAll(".input");
// Check Length of Input Fields
const checkInputFieldLength = function (event) {
    // Get the current target value length
    const currentInputFieldLength = event.currentTarget.value.length;
    // Get the next sibling of the input field, in this case is a <label>
    const currentInputFieldLabel = event.currentTarget.nextElementSibling;
    const fixLabeLPosition = "fix-label-position";
    console.log(currentInputFieldLength);
    // If the length is greater than 0
    // Attach an id attribute to this length; ids are more specific than classes attributes
    if (currentInputFieldLength > 0) {
        currentInputFieldLabel.id = fixLabeLPosition;
    } else {
    // Otherwise, remove id attribute
        currentInputFieldLabel.removeAttribute("id");
    }
};
// For Each Input Field addEventListener
inputFields.forEach(function (inputField) {
    inputField.addEventListener("input", function (event) {
        // Call check input field function
        checkInputFieldLength(event);
    }, false);
});