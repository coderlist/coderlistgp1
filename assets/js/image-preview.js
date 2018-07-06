


let imageButtonUpload = document.querySelector('.img-button-upload');
var loadImageFile = function(event) {
    var reader = new FileReader();
    reader.onload = function(){
        const imagePreview = document.querySelector('.img-top-preview');
        imagePreview.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  };

imageButtonUpload.addEventListener('change', event => {
    loadImageFile(event);
}, false)
