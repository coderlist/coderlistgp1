window.onload = function () {
    // Menu
    const menu = document.querySelector('.navbar-mobile ');
    const modal = document.querySelector('.navbar-nav-modal');
    const buttons = document.querySelectorAll('.navbar-toggler-icon');
    function toggle() {
        const show = "show";
        const collapse = "collapse";
        if(menu.classList.contains(collapse)){
            menu.classList.remove(collapse);
            menu.classList.add(show);
            modal.style.display = "flex";
        } else {
            menu.classList.remove(show);
            menu.classList.add(collapse);
            modal.style.display = "none";
        }
    }
    buttons.forEach(function (btn) {
        btn.addEventListener('click', toggle, false);
    });
};