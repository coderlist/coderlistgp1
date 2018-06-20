const closeWarningMessageButtons = document.querySelectorAll('.close-alert-message');
const deleteThisButtons = document.querySelectorAll('.delete-this');
const overlay = document.querySelector('.overlay');
const title = document.querySelector('.overlay-alert-message h4').textContent;
console.log(title);
/* Toggle Warning Message */
const toggleWarningMessage = function () {
    overlay.classList.toggle("show");
};
const getName = function (index){
        const placeholder = document.querySelector('.strong');
        let name = '';
        if(title === "Delete User"){
            name = document.querySelectorAll('.name')[index].innerHTML;
        } else if ( title === "Delete Page"){
            name = document.querySelectorAll('.name')[index].innerHTML;
        }
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
        getName(index);  
    }, index);
});