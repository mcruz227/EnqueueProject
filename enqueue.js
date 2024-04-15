var ascending = false;
var videos = 0;

// seeks out any clicks on the dropdown order button and video input submit button
document.addEventListener('DOMContentLoaded', function() {
    getVideoLinks(function(videos) {
        populateUI(videos);
    });
  
    document.getElementById("dropdown-order").addEventListener("click", flipOrder);
    document.getElementById("video-input-submit-button").addEventListener("click", function() {
        addVideoButton();
        repopulateVideoList(); 
    });

    document.getElementById("shuffle-button").addEventListener("click", shuffleVideos);
    document.getElementById("videoQueue").addEventListener("click", function(event) {
        if (event.target.classList.contains("video-entry")) {
            openVideoInTab(event.target.dataset.videoId);
        } else if (event.target.classList.contains("delete-button")) {
            deleteVideo(event.target.dataset.videoEntryId);
        }
    });
     var sortOptions = document.getElementsByClassName("dropdown-content-option");
     for (var i = 0; i < sortOptions.length; i++) {
        sortOptions[i].addEventListener("click", function(event) {
            sortVideos(event.target.textContent);
        });
    }
});



function openVideoInTab(videoId){
    window.open("https://www.youtube.com/watch?v=" + videoId, "_blank");
}

function deleteVideo(entryId){
    var entry = document.getElementById(entryId);
    if (entry) {
        var confirmDelete = confirm("Are you sure you want to delete this video?");
        if (confirmDelete) {
            entry.remove();

            chrome.storage.local.remove(entryId, function() {
                console.log("Video details removed:", entryId);
            });
        }
    } else {
        console.error("Element with ID " + entryId + " not found.");
    }
}


function createVideoEntry(entry, data) {
    
    var entryId = entry.id;
    entry.dataset.videoId = data.videoId; 
    

    var titleElement = entry.querySelector('.video-title');
    var channelElement = entry.querySelector('.video-description');
    var thumbnailElement = entry.querySelector('.video-thumbnail');

    titleElement.textContent = data.title;
    channelElement.textContent = data.channel;
    thumbnailElement.src = data.thumbnail;

    //this is supposed to store video details in the chrome storage
    var videoDetails = {
        videoId: data.videoId,
        title: data.title,
        channel: data.channel,
        thumbnail: data.thumbnail
    };
// calling this means defining the video details^^ with [entryID] in the chrome storage. 
    chrome.storage.local.set({ [entryId]: videoDetails }, function() {
        console.log("Video details saved:", videoDetails);
    });
}
//separate function to repopulate the video list with the ^ updated data
function repopulateVideoList(){
    var videoQueue = document.getElementById("videoQueue");

    chrome.storage.local.get(null, function(data) {
        Object.keys(data).forEach(function(key) {
            if (key.startsWith('entry')) {
                createVideoEntry(document.getElementById(key), data[key]);
            }
        });
    });
}
//calling the function^
document.addEventListener('DOMContentLoaded', repopulateVideoList);

// this splits the url after the = and takes that part as a VIDEO ID
function extractVideoID(videoURL) {
    const parts = videoURL.split('=');
    const videoID = parts[parts.length - 1];
    return videoID;
}

// toggles dropdown order button icon 
function flipOrder() {
    var dropdownOrder = document.getElementById("dropdown-order");
    var sortText = document.getElementById("sort-text");
    
    if(ascending) {
        dropdownOrder.style.transform = "rotate(0deg)";
        dropdownOrder.title="Descending";
        sortText.textContent = "Descending";
        ascending = false;
    } else {
        dropdownOrder.style.transform = "rotate(180deg)";
        dropdownOrder.title="Ascending";
        sortText.textContent = "Ascending";
        ascending = true;
    }
}

function populateUI(videos) {
    videos.forEach(function(videoLink) {
        createVideoEntry({ videoId: extractVideoID(videoLink), title: 'Video Title', channel: 'Channel Name', thumbnail: 'Thumbnail URL' });
    });
}

// when video input submit button is click, extracts video id from the video url entered, calls video id to backend
function addVideoButton() {
    var videoUrlInput = document.getElementById('video-input-box');
    var videoUrl = videoUrlInput.value.trim();

    if (isValidYouTubeURL(videoUrl)) {
        var videoId = extractVideoID(videoUrl);
        saveVideoLink(videoUrl);
        videoID_toBackend(videoId);
        videoUrlInput.value = ''; 
        showNotification('Video added successfully!', 'success');
    } else {
        showNotification('Invalid YouTube URL. Please enter a valid URL.', 'error');
    }
}

function isValidYouTubeURL(url) {
    var youtubePattern = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
    return youtubePattern.test(url);
}

function showNotification(message, type) {
    removeNotification('info');
    removeNotification('errr');

    var notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        console.error("Notification container not found! Creating a new one...");
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    var notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerText = message;
    notificationContainer.appendChild(notification);
    setTimeout(function() {
        notification.remove();
    }, 3000);
}





// initial call to the function
// videoID_toBackend("your_video_id_here");

function sortVideos(sortOption) {
    var videoEntries = document.querySelectorAll('.video-entry');
    var videoArray = Array.from(videoEntries);
    videoArray.sort(function(a, b) {
        var textAElement = a.querySelector('.video-' + sortOption.toLowerCase());
        var textA = textAElement ? textAElement.textContent.toUpperCase() : '';
        var textBElement = b.querySelector('.video-' + sortOption.toLowerCase());
        var textB = textBElement ? textBElement.textContent.toUpperCase() : '';
        if (textA < textB) return -1;
        if (textA > textB) return 1;
        return 0;
    });
    var videoQueue = document.getElementById("videoQueue");
    if (!videoQueue) {
        console.error("Video queue container not found!");
        return;
    }
    videoQueue.innerHTML = '';
    videoArray.forEach(function(entry) {
        videoQueue.appendChild(entry);
    });
}

//  to shuffle videos
function shuffleVideos() {

    showNotification('shuffling videos...', 'info');

    var videoEntries = document.querySelectorAll('.video-entry');
    var videoArray = Array.from(videoEntries);
    videoArray.sort(function() { return 0.5 - Math.random() });
    var videoQueue = document.getElementById("videoQueue");
    videoQueue.innerHTML = '';
    videoArray.forEach(function(entry) {
        videoQueue.appendChild(entry);
    });

    setTimeout(function(){
        var notification = document.querySelector('.notification.info');
        if (notification) {
            notification.remove();
    }
}, 2000);
}

// getting VIDEOS TO ACTUALLY STAY/SAVED IN THE EXTENSION for each user
function saveVideoLink(videoLink) {
    chrome.storage.local.get({ videos: [] }, function(data) {
        var videos = data.videos;
        videos.push(videoLink);
        chrome.storage.local.set({ videos: videos }, function() {
            getVideoLinks(function(videos){
                console.log("video links after saving: " , videos);
            });
        });
    });
}

function getVideoLinks(callback) {
    chrome.storage.local.get(null, function(data) {
        var videos = Object.values(data).filter(entry => entry.videoId);
        console.log("Retrieved videos:", videos);
        callback(videos.map(entry => ({
            videoId: entry.videoId,
            title: entry.title,
            channel: entry.channel,
            thumbnail: entry.thumbnail
        })));
    });
}

// getVideoLinks(function(videos) {
//     videos.forEach(function(video) {
//     });
// });
// this will send the ID of a youtube video to the backend(python apiCall) in order to get detail about video
function videoID_toBackend(videoId) {
    showNotification('Fetching video details...', 'info');

    fetch('http://localhost:8000/get_video_details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoId: videoId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            createVideoEntry({
                videoId: videoId,
                title: data.title,
                channel: data.channel,
                thumbnail: data.thumbnail
            });
            removeNotification('info');
            showNotification('Video details fetched successfully!', 'success');
        } else {
            console.error('Video not found');
            removeNotification('info');
            showNotification('Video not found. Please check video ID.', 'error');
        }
    })
    .catch(error => {
        console.error('Error getting video details:', error);
        removeNotification('info');
        showNotification('Error fetching video details. Please try again later.', 'error');
    });
}


function removeNotification(type) {
    var notification = document.querySelector('.notification.' + type);
    if (notification) {
        notification.remove();
    }

}

