const closeWarningMessageButtons = document.querySelectorAll('.close-alert-message');
const deleteThisButtons = document.querySelectorAll('.delete-this');

const overlay = document.querySelector('.overlay');
/* Toggle Warning Message */
const toggleWarningMessage = function () {
    overlay.classList.toggle("show");
};

/* Get data from elements at this index */
const getDataFromFields = function(index) {
    const name = document.querySelectorAll('.name')[index].innerHTML;
    console.log(name);
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
        getDataFromFields(index);
    }, index);
});