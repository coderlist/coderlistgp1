const inputFieldListenForChanges = document.querySelectorAll('.this-field');
const resetBrowserActionButtons = document.querySelectorAll('.reset-browser-action');
let anyChanges = false;

window.onbeforeunload = function(){
    if(anyChanges){
        return 'You may have unsaved changes, are you sure you want to leave the page?';
    }
};

const unloadBrowserAction = () => {
    window.onbeforeunload = null;
} 

resetBrowserActionButtons.forEach((button) => {
    button.addEventListener('click', () => {
        unloadBrowserAction();
    });
});

inputFieldListenForChanges.forEach((input) => {
    input.addEventListener('change', () => {
        anyChanges = true;
    });
});
