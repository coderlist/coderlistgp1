window.onload = function () {
    // Grid - Get all Grid Squares in the DOM
    const squareButtons = document.querySelectorAll(".square");
    // toggleSquares
    // Resets all the active squares
    // Before being able to show the current one
    const toggleAllSquares = function () {
        // Variables
        const hide = "hide",
            display = "display",
            active = "active";
        // Checks for any active Square
        // Resets this Square
        squareButtons.forEach(function (square) {
            const squareTarget = square.querySelectorAll(".active > div");
            // Reset each active square children elements
            squareTarget.forEach(function (content) {
                if (content.classList.contains(display)) {
                    content.classList.remove(display);
                    content.classList.add(hide);
                    square.classList.remove(active);
                } else {
                    content.classList.add(display);
                    content.classList.remove(hide);
                }
            });
        });
    };
    // Shows selected / current square
    const showThisSquare = function (currentSquare) {
        // Get Square direct child elements
        const squareTarget = currentSquare.querySelectorAll(".active > div");
        const hide = "hide",
            display = "display";
        // For each child element
        // Show the hidden ones
        // Hide the displayed ones
        squareTarget.forEach(function (content) {
            // If content is hidden then display it
            if (content.classList.contains(hide)) {
                content.classList.remove(hide);
                content.classList.add(display);
            } else {
            // Otherwise, the content is displayed, hide it
                content.classList.remove(display);
                content.classList.add(hide);
            }
        });
    };
    // Hides selected / current square
    const hideThisSquare = function (currentTarget, currentTargetChildren) {
        const active = "active",
            display = "display",
            hide = "hide";
        const currentTargetTitle = currentTarget.querySelector(".square-title");
        // For each child element
        // Hide the ones being shown
        // Show the hidden ones
        currentTargetChildren.forEach(function (content) {
        // If content is displayed, hide it
            if (content.classList.contains(display)) {
                content.classList.remove(display);
                content.classList.add(hide);
            }
            currentTargetTitle.classList.remove(hide);
            currentTargetTitle.classList.add(display);
        });
        // Removes active class from this Square
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
            // If a square is active
            // Hide the elements of this / current / selected square
            if (currentTarget.classList.contains(active)) {
                hideThisSquare(currentTarget, currentTargetChildren);
            } else {
            // Otherwise, toggleAllSquares children from display to hidden
                toggleAllSquares(); // Resets open squares
                currentTarget.classList.add(active); // Current square is active
                showThisSquare(currentTarget); // Display current square
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

};