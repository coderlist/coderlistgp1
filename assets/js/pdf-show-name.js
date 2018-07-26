let imageButtonUpload = document.querySelector('.pdf-button-upload');
const imageName = document.querySelector('.pdf-file-name');
const getPDFName = function(event) {
    imageName.textContent = event.target.files[0].name;
};
imageButtonUpload.addEventListener('change', event => {
    getPDFName(event);
}, false);