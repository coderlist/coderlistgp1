const copyToClipBoardButtons = document.querySelectorAll('.copy-to-clipboard'); // working

function copyLinkToClipBoard(index){
    const data = document.querySelectorAll('.this-location')[index];
    data.select();
    document.execCommand("copy");
}

copyToClipBoardButtons.forEach((button, index) => {
    button.addEventListener('click', function(event){
        copyLinkToClipBoard(index);
        event.preventDefault();
    });
});