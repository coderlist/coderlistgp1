// Grid
const squareButtons = document.querySelectorAll(".square");
// toggleSquares
// Toggles all open squares
const toggleAllSquares = function () {
    const hide = "hide",
        display = "display",
        active = "active";
    // For each square
    // Toggle it
    squareButtons.forEach(function (square) {
        const squareTarget = square.querySelectorAll(".active > div");
        // Reset each active square
        squareTarget.forEach(function (content) {
            if (content.classList.contains(display)) {
                content.classList.remove(display);
                content.classList.add(hide);
                // Removes active class from each element
                square.classList.remove(active);
            } else {
                content.classList.add(display);
                content.classList.remove(hide);
            }
        });
    });
};
// Show current square
const showThisSquare = function (currentSquare) {
    const squareTarget = currentSquare.querySelectorAll(".active > div");
    const hide = "hide",
        display = "display";
    // For each square children element
    // Check if it is hidden, then show it
    // Otherwise, hide it
    squareTarget.forEach(function (content) {
        if (content.classList.contains(hide)) {
            content.classList.remove(hide);
            content.classList.add(display);
        } else {
            content.classList.remove(display);
            content.classList.add(hide);
        }
    });
};
// Hides current square
const hideThisSquare = function (currentTarget, currentTargetChildren) {
    const active = "active",
        display = "display",
        hide = "hide";
    const currentTargetTitle = currentTarget.querySelector(".square-title");
    // For each square children element
    // Check if it is hidden, then show it
    // Otherwise, hide it
    currentTargetChildren.forEach(function (content) {
        if (content.classList.contains(display)) {
            content.classList.remove(display);
            content.classList.add(hide);
        }
        currentTargetTitle.classList.remove(hide);
        currentTargetTitle.classList.add(display);
    });
    // Removes active class from the current square
    currentTarget.classList.remove(active);
};
// Event Listeners
// When any square is clicked
// Display hidden elements of this square
squareButtons.forEach(function (square) {
    square.addEventListener("click", function (event) {
        const currentTarget = event.currentTarget;
        const currentTargetChildren = currentTarget.querySelectorAll(".active > div");
        const active = "active",
            display = "display",
            hide = "hide";
        if (currentTarget.classList.contains(active)) {
            hideThisSquare(currentTarget, currentTargetChildren);
        } else {
            toggleAllSquares(); // resets open squares
            currentTarget.classList.add(active);
            showThisSquare(currentTarget);
        }
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