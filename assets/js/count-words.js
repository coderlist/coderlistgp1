const pageDescription = document.querySelector('.page-description');
const characterCounter = document.querySelector('.character-counter');
let maxLength;

const incrementCharacterCounter = function(){
    const counter = pageDescription.value.length;
    characterCounter.textContent = `${counter}/120`;
    maxLength = counter;
};
const decrementCharacterCounter = function(){
    maxLength--;
    characterCounter.textContent = `${maxLength}/120`;
};
pageDescription.addEventListener('keydown', event => {
    if(maxLength > 119){
        if(event.key === "Backspace"){
            characterDecrementCounter();
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    incrementCharacterCounter();
});

