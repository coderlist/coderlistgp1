const inputFieldListenForChanges = document.querySelectorAll('.this-field');
let anyChanges = false;

window.onbeforeunload = function(){
    if(anyChanges){
        return 'You may have unsaved changes, are you sure you want to leave the page?';
    }
};

inputFieldListenForChanges.forEach((input) => {
    input.addEventListener('change', () => {
        anyChanges = true;
    });
});
