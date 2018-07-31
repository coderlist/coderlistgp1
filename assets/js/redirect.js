const cancelChanges = document.querySelector('.redirect-this-user');


const redirect = () => {
    window.location.href = '/users/dashboard';
};

cancelChanges.addEventListener('click', redirect, false );