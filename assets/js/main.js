const currentYear = document.querySelector('.current-year');
currentYear.textContent = new Date().getFullYear();
// Grid
// Get all the cards nodes in the DOM
const cards = document.querySelectorAll('.card-deck .card');
// Function to display the current card
if(cards){
    const toggleCurrentCard = (card) => {
        const cardOverlay = card.querySelector('.card-overlay');
        const cardTitle = card.querySelector('.card-title');
        console.log('')
        if(!card.classList.contains("active")){
            card.classList.toggle("active");
            cardTitle.classList.toggle("hide-card-title");
            cardOverlay.classList.toggle("display-card-overlay");
            
        } else {
            card.classList.toggle("active");
            cardOverlay.classList.toggle("display-card-overlay");
            cardTitle.classList.toggle("hide-card-title");
        }
    };
    // For each card, add an event listener 'click'
    cards.forEach((cardBtn) => {
        cardBtn.addEventListener('click', (event) => {
            const card = event.currentTarget;
            toggleCurrentCard(card); 
        }, false);
    });
}
// Navbar
const menu = document.querySelector('.nav-mobile');
const buttons = document.querySelectorAll('.navbar-toggler-icon');
// Toggles Navbar on Smartphones
const toggleNavBar = function () {
    const collapse = "collapse";
    // If the menu is collapsed, then display it
    // Otherwise, hide it
    if (menu.classList.contains(collapse)) {
        menu.classList.toggle(collapse);
    } else {
        menu.classList.toggle(collapse);
    }
}
// Event Listeners
buttons.forEach(function (btn) {
    btn.addEventListener('click', toggleNavBar, false);
});