// Modal functionality
const modal = document.getElementById('posterModal');
const modalImg = document.getElementById('posterImage');
const closeBtn = document.getElementsByClassName('close-modal')[0];

function openPoster(posterSrc) {
    modal.style.display = "block";
    modalImg.src = posterSrc;
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}