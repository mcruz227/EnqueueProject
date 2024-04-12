var ascending = false;
var videos = 0;


async function fetchVideoData() {
}

fetchVideoData();


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("dropdown-order").addEventListener("click", flipOrder);
    document.getElementById("shuffle-button").addEventListener("click", addVideo);
});

function flipOrder() {
    var dropdownOrder = document.getElementById("dropdown-order");
    
    if(ascending) {
        dropdownOrder.style.transform = "rotate(0deg)";
        dropdownOrder.title="Descending";
        ascending = false;
    } else {
        dropdownOrder.style.transform = "rotate(180deg)";
        dropdownOrder.title="Ascending";
        ascending = true;
    }
}

function addVideo() {
    videos++;
    document.getElementById("videoQueue").innerHTML+= "<div class='video-entry' id='entry" + videos + "'></div>";

    var video = document.getElementById("entry" + videos);
    video.innerHTML+="<div class='video-left-side-container' id='left-side-" + videos + "'></div>";

    var leftSideContainer = document.getElementById("left-side-" + videos);
    leftSideContainer.innerHTML+="<button class='image-button delete-button' id='video-" + videos + "-delete-button'></button>";

    var deleteButton = document.getElementById("video-" + videos + "-delete-button");
    deleteButton.innerHTML+="<img class='video-button-image' src='./img/Delete.svg' id='video-delete-button-image'>";

    leftSideContainer.innerHTML+="<h1 class='video-order-number' id='video-number-" + videos +"'>" + videos + "</h1>";

    video.innerHTML+="<img class='video-thumbnail' id='video-image-" + videos + "'>";
    video.innerHTML+="<div class='video-information-container' id='video-information-" + videos + "'></div>";

    var informationContainer = document.getElementById("video-information-" + videos);
    informationContainer.innerHTML+= "<h1 class='video-title' id='video-name-" + videos + "'>Video Title</h1>";
    informationContainer.innerHTML+= "<p class='video-description' id='channel-name-" + videos + "'>Channel</p>";

    video.innerHTML+= "<button class='image-button video-drag-button' id='video-" + videos + "-drag-button'></button>";

    var dragButton = document.getElementById("video-" + videos + "-drag-button");
    dragButton.innerHTML+= "<img class='video-button-image' src='./img/Drag.svg' id='video-drag-button-image'>";
}

