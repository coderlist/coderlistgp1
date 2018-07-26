const pageDescription = document.querySelector('.page-description');
const characterCounter = document.querySelector('.character-counter');
let maxLength;

const incrementCharacterCounter = function(){
    maxLength = pageDescription.value.length;
    characterCounter.textContent = `${maxLength}/120`;
};
const decrementCharacterCounter = function(){
    maxLength = maxLength - 1;
    characterCounter.textContent = `${maxLength}/120`;
};
pageDescription.addEventListener('keydown', event => {
    if(maxLength > 119){
        if(event.key === "Backspace"){
            console.log(event.key);
            decrementCharacterCounter();
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    incrementCharacterCounter();
});

