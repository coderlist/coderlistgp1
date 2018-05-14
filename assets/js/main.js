window.onload = function () {
    // Grid
    const squareButtons = document.querySelectorAll(".square");
    // toggleSquares
    // toggles all the open squares when opening a new one
    const toggleSquares = function () {
        const hide = "hide",
            display = "display",
            active = "active";
        squareButtons.forEach(function (square) {
            const squareTarget = square.querySelectorAll(".active > div");
            // Reset active square
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
    // toggleSquare
    const showSquare = function (currentSquare) {
        const squareTarget = currentSquare.querySelectorAll(".active > div");
        const hide = "hide",
            display = "display";
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
    const hideSquare = function (currentTarget, currentTargetChildren) {
        const active = "active",
            display = "display",
            hide = "hide";
        const currentTargetTitle = currentTarget.querySelector(".square-title");
        currentTargetChildren.forEach(function (content) {
            if (content.classList.contains(display)) {
                content.classList.remove(display);
                content.classList.add(hide);
            }
            currentTargetTitle.classList.remove(hide);
            currentTargetTitle.classList.add(display);
        });
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
                hideSquare(currentTarget, currentTargetChildren);
            } else {
                toggleSquares(); // resets open squares
                currentTarget.classList.add(active);
                showSquare(currentTarget);
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