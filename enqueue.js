var ascending = false;
var videos = 0;

// seeks out any clicks on the dropdown order button and video input submit button
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("dropdown-order").addEventListener("click", flipOrder);
    document.getElementById("video-input-submit-button").addEventListener("click", addVideoButton);

    document.getElementById("videoQueue").addEventListener("click", function(event) {
        if (event.target.classList.contains("video-entry")) {
            openVideoInTab(event.target.dataset.videoId);
        } else if (event.target.classList.contains("delete-button")) {
            deleteVideo(event.target.dataset.videoEntryId);
        }
    });
});

function openVideoInTab(videoId){
    window.open("https://www.youtube.com/watch?v=" + videoId, "_blank");
}

function deleteVideo(entryId){
    var entry = document.getElementById(entryId);
    entry.remove();
}

function createVideoEntry(data) {
    videos++;
    var videoQueue = document.getElementById("videoQueue");
    var entry = document.createElement("div");
    entry.classList.add("video-entry");
    entry.id = "entry" + videos;
    entry.dataset.videoId = data.videoId; 
    videoQueue.appendChild(entry);

    entry.innerHTML = `
        <div class='video-left-side-container'>
            <button class='image-button delete-button' data-video-entry-id='entry${videos}'></button>
            <h1 class='video-order-number'>${videos}</h1>
        </div>
        <img class='video-thumbnail' src='${data.thumbnail}' id='video-image-${videos}'/>
        <div class='video-information-container'>
            <h1 class='video-title'>${data.title}</h1>
            <p class='video-description'>${data.channel}</p>
        </div>
        <button class='image-button video-drag-button'></button>
    `;
}
// this splits the url after the = and takes that part as a VIDEO ID
function extractVideoID(videoURL) {
    const parts = videoURL.split('=');
    const videoID = parts[parts.length - 1];
    return videoID;
}

// toggles dropdown order button icon 
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

// when video input submit button is click, extracts video id from the video url entered, calls video id to backend
function addVideoButton() {
    var videoUrl = document.getElementById('video-input-box').value;
    var videoId = extractVideoID(videoUrl);
         
    if (videoId) {
        videoID_toBackend(videoId);
    } else {
        console.error("Invalid YouTube video URL");
    }
}



// this will send the ID of a youtube video to the backend(python apiCall) in order to get detail about video
function videoID_toBackend(videoId) {
    fetch('https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=AIzaSyDnUbZpNA12WQCmpmottG2Q6GPND08nyBQ&part=snippet', {
    // we are getting the video id from the users input, then the server 'asks' from the youtube api for details
        method: 'GET'
    })
    // we get a response(ytube details) and the we send it back to our chrome extension
    .then(response => response.json())
    .then(data => {
        if (data.items && data.items.length > 0) {
            const videoDetails = data.items[0].snippet;
        createVideoEntry({
            videoId: videoId,
            title: videoDetails.title,
            channel: videoDetails.channelTitle,
            thumbnail: videoDetails.thumbnails.default.url
            });
        } else {
            console.error('video not found')
        }
         })
            .catch(error => {
            console.error('Error getting video details', error);
    });
}




// initial call to the function
videoID_toBackend("your_video_id_here");
