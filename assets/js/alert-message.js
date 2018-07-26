const flashOverlay = document.querySelector('.flash-overlay');
const closeFlashMessagesButtons = document.querySelectorAll('.close-flash-message');
let flashTimeOut;

if(flashOverlay !== null){
    if(!flashOverlay.classList.contains("hide")){
        // setTimeOut to call the toggleFlashMessage function after three seconds -> Can be increased up to five seconds.
        flashTimeOut = setTimeout(toggleFlashMessage, 3000);
    }
}

function toggleFlashMessage() {
    // toggle flashOverlay
    // If it is displayed, hide it
    // Otherwise, display it
    flashOverlay.classList.toggle("hide");
    // If the time out is not undefined
    // It means it has a defined value
    // clearTimeOut, will clear the setTimeOut method from the call stack 
    if(flashTimeOut !== undefined){
        clearTimeout(flashTimeOut);
    }
}
// Add event listeners
closeFlashMessagesButtons.forEach(button => {
    button.addEventListener('click', function () {
        toggleFlashMessage();
    });
});