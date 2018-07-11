const drawerPDFOverlay = document.querySelector('.drawer-pdfs-overlay');
const closePDFDrawer = document.querySelector('.close-drawer-pdfs');
const openPDFDrawer = document.querySelector('.open-pdf-drawer');

function toggleDrawer(){
    drawerPDFOverlay.classList.toggle('show');
}

closePDFDrawer.addEventListener('click', function(event) {
    toggleDrawer();
    event.preventDefault();
});

openPDFDrawer.addEventListener('click', function(event) {
    toggleDrawer();
    event.preventDefault();
});

