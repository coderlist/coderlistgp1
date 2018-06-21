const closeWarningMessageButtons = document.querySelectorAll('.close-alert-message');
const deleteThisButtons = document.querySelectorAll('.delete-this');
const overlay = document.querySelector('.overlay');
const title = document.querySelector('.overlay-alert-message h4').textContent;
console.log(title);
/* Toggle Warning Message */
const toggleWarningMessage = function () {
    overlay.classList.toggle("show");
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
closeWarningMessageButtons.forEach(button => {
    button.addEventListener('click', function () {
        toggleWarningMessage();
    });
});
deleteThisButtons.forEach((button, index) => {
    button.addEventListener('click', function () {
        toggleWarningMessage();
        getDataFromInputFields(index);  
    }, index);
});