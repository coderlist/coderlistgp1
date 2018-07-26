let imageButtonUpload = document.querySelector('.img-button-upload');
const imageName = document.querySelector('.image-file-name');
var loadImageFile = function(event) {
    var reader = new FileReader();
    reader.onload = function(){
        const imagePreview = document.querySelector('.img-top-preview');
        imagePreview.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    imageName.textContent = event.target.files[0].name;
  };

imageButtonUpload.addEventListener('change', event => {
    loadImageFile(event);
}, false);
