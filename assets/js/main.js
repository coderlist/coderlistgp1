// Grid
// Get all the cards nodes in the DOM
const cards = document.querySelectorAll('.card-deck .card');
// Function to display the current card
const toggleCurrentCard = (card) => {
    const cardBody = card.querySelector('.card-body');
    const cardOverlay = card.querySelector('.card-overlay');
    const cardTitle = card.querySelector('.card-title');
    if(!card.classList.contains("active")){
        card.classList.toggle("active");
        cardTitle.velocity({display: "none"}, {duration: 0, queue: false});
        cardOverlay.velocity({display: "block"}, {duration: 500, queue: false});
        cardBody.velocity({ bottom: 85, display: "flex"}, {duration: 500, queue: false});
    } else {
        card.classList.toggle("active");
        cardBody.velocity({ bottom: -85, display: "none"}, {duration: 500, queue: false});
        cardOverlay.velocity({display: "none"}, {duration: 510, queue: false});
        cardTitle.velocity({display: "block"}, {delay: 510, queue: false});  
    }
};
// For each card, add an event listener 'click'
cards.forEach((cardBtn) => {
    cardBtn.addEventListener('click', (event) => {
        const card = event.currentTarget;
        toggleCurrentCard(card); 
    }, false);
});
// Navbar
const menu = document.querySelector('.navbar-mobile');
const modal = document.querySelector('.navbar-nav-modal');
const buttons = document.querySelectorAll('.navbar-toggler-icon');
// Toggles Navbar on Smartphones
const toggleNavBar = function () {
    const show = "show";
    const collapse = "collapse";
    // If the menu is collapsed, then display it
    // Otherwise, hide it
    if (menu.classList.contains(collapse)) {
        menu.classList.remove(collapse);
        menu.classList.add(show);
        modal.style.display = "flex";
    } else {
        menu.classList.remove(show);
        menu.classList.add(collapse);
        modal.style.display = "none";
    }
}
// Event Listeners
buttons.forEach(function (btn) {
    btn.addEventListener('click', toggleNavBar, false);
});