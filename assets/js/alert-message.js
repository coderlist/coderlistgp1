const closeAlertMessageButtons = document.querySelectorAll('.close-alert-message');
const deleteThisButtons = document.querySelectorAll('.delete-this');
const overlay = document.querySelector('.overlay');
const flashOverlay = document.querySelector('.flash-overlay');
const title = document.querySelector('.overlay-alert-message h4').textContent;
console.log(title);
/* Toggle Warning Message */
const toggleAlertMessage = function () {
    if(flashOverlay !== null) {
        if(!flashOverlay.classList.contains("hide")){
            flashOverlay.classList.toggle("hide");
            return;
        }
    }
    overlay.classList.toggle("show");
    return;
};
const getDataFromInputFields = function (index){
        const placeholder = document.querySelector('.strong');
        let name = document.querySelectorAll('.this_name')[index].value;
        let id = document.querySelectorAll('.this_id')[index].value;
        console.log(name);
        console.log(id);
        placeholder.textContent = name;
};
/* Attach Event Listeners to Buttons */
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