const closeWarningMessageButtons = document.querySelectorAll('.close-alert-message');
const deleteThisButtons = document.querySelectorAll('.delete-this');
const overlay = document.querySelector('.overlay');
/* Toggle Warning Message */
const toggleWarningMessage = function () {
    overlay.classList.toggle("show");
};
/* Attach Event Listeners to Buttons */
closeWarningMessageButtons.forEach(button => {
    button.addEventListener('click', function () {
        toggleWarningMessage();
    });
});
deleteThisButtons.forEach(button => {
    button.addEventListener('click', function () {
        toggleWarningMessage();
    });
});