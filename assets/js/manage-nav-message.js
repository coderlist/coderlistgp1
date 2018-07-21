const manageNavOverlay = document.querySelector('.manage-nav-overlay');
const closeManageNavMessageButton = document.querySelector('.close-manage-nav-message');
let manageNavTimeOut;

function toggleManageNavOverlay (callback){
    if(manageNavOverlay !== null){
        if(manageNavOverlay.classList.contains("hide")){
            toggleManageNavMessage();
        }
    }
    if(callback !== closeManageNavMessage){
        setTimeout(callback, 1500);
    } else {
        manageNavTimeOut = setTimeout(callback, 3000);
    }

}
function toggleManageNavMessage(){
    // toggle flashOverlay
    // If it is displayed, hide it
    // Otherwise, display it
    manageNavOverlay.classList.toggle("hide");
    // If the time out is not undefined
    // It means it has a defined value
    // clearTimeOut, will clear the setTimeOut method from the call stack 
    toggleManageNavOverlay(closeManageNavMessage);
}

function closeManageNavMessage(){
    manageNavOverlay.classList.toggle("hide");
    clearTimeout(manageNavTimeOut);
}

// Add event listeners
closeManageNavMessageButton.addEventListener('click', function () {
    closeManageNavMessage();
});
