var ascending = true;
var videos = 0;
const queueContainer = document.getElementById("videoQueue");

// seeks out any clicks on the dropdown order button and video input submit button
document.addEventListener('DOMContentLoaded', function() {
    getVideoLinks(function(videos) {
        populateUI(videos);
    });

    document.getElementById("dropdown-order").addEventListener("click", flipOrder);
    document.getElementById("video-input-submit-button").addEventListener("click", function() {
        addVideoButton();
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
            var sortOption = event.target.textContent;
            sortVideos(sortOption);
            updateSortButton(sortOption);
        });
    }
});

function updateSortButton(sortOption) {
    var dropdownOrder = document.getElementById("dropdown-order");
    var sortText = document.getElementById("sort-by-button");

    if (sortOption === 'Chronological') {
        dropdownOrder.style.transform = "rotate(0deg)";
        dropdownOrder.title = "Descending";
        sortText.textContent = "Descending";
    } else if (sortOption === 'Reverse Chronological') {
        dropdownOrder.style.transform = "rotate(180deg)";
        dropdownOrder.title = "Ascending";
        sortText.textContent = "Ascending";
    }
}




function openVideoInTab(videoId){
    window.open("https://www.youtube.com/watch?v=" + videoId, "_blank");
}

function deleteVideo(entryId) {
    var entry = document.getElementById(entryId);
    if (entry) {
        var confirmDelete = confirm("Are you sure you want to delete this video?");
        if (confirmDelete) {
            entry.remove();

            // take the numeric part of the entryId
            var entryIndex = parseInt(entryId.replace("entry", ""));

            // correct key
            var storageKey = "entry" + entryIndex;

            chrome.storage.local.remove(storageKey, function() {
                console.log("Video details removed:", storageKey);
            });

            // updating the video count
            videos--;

            // re-index the video entries order numbers
            var videoEntries = document.querySelectorAll('.video-entry');
            videoEntries.forEach(function(entry, index) {
                entry.querySelector('.video-order-number').textContent = index + 1;
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
    

    var entry = document.createElement("div");

    queueContainer.appendChild(entry);

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

//Adds the video to the
function addVideo(data){
    videos++;
    var entry = document.createElement("div");
    entry.classList.add("video-entry");
    entry.id = "entry" + videos;
    entry.dataset.videoId = data.videoId; 
    queueContainer.appendChild(entry);

    entry.innerHTML = `
        <div class='video-left-side-container'>
            <button class='image-button delete-button' data-video-entry-id='entry${videos}'></button>
            <h1 class='video-order-number'>${videos}</h1>
        </div>
        <img class='video-thumbnail' src='${data.thumbnail}' id='video-image-${videos}'/>
        <div class='video-information-container'>
            <h1 class='video-title'>${data.title}</h1>
            <p class='video-description'>${data.channel}</p>
            <p class-'debug'>hey this is currently ${videos} into the list</p>
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
    var sortText = document.getElementById("sort-text");
    
    if (ascending) {
        dropdownOrder.style.transform = "rotate(0deg)";
        dropdownOrder.title = "Descending";
        sortText.textContent = "Descending";
    } else {
        dropdownOrder.style.transform = "rotate(180deg)";
        dropdownOrder.title = "Ascending";
        sortText.textContent = "Ascending";
    }

    ascending = !ascending;
}

function populateUI(videos) {
      if (videos.length > 0) {
        for (const video of videos) {
          const videoId = video.videoId;
          console.log("Video ID:", videoId);
          addVideo({ 
            videoId: video.videoId, 
            title: video.title, 
            channel: video.channel, 
            thumbnail: video.thumbnail});

          // You can perform additional actions with the videoId here
        }
      } else {
        console.log("No videos found in storage");
      }
    
  }


// when video input submit button is click, extracts video id from the video url entered, calls video id to backend
function addVideoButton() {
    var videoUrlInput = document.getElementById('video-input-box');
    var videoUrl = videoUrlInput.value.trim();

    if (isValidYouTubeURL(videoUrl)) {
        var videoId = extractVideoID(videoUrl);

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
var currentSortOption = '';
//var currentSortOrder = true; 


function sortVideos(sortOption) {
    var videoEntries = document.querySelectorAll('.video-entry');
    var videoArray = Array.from(videoEntries);

    // reset sorting order to default (ascending) when a new sorting option is selected
    ascending = true;

    videoArray.sort(function(a, b) {
        switch (sortOption) {
            case 'Channel Title':
                var channelTitleA = a.querySelector('.video-description').textContent.toLowerCase();
                var channelTitleB = b.querySelector('.video-description').textContent.toLowerCase();
                return channelTitleA.localeCompare(channelTitleB);
            case 'Video Title':
                var videoTitleA = a.querySelector('.video-title').textContent.toLowerCase();
                var videoTitleB = b.querySelector('.video-title').textContent.toLowerCase();
                return videoTitleA.localeCompare(videoTitleB);
            case 'Date':
                var timestampA = parseInt(a.dataset.timestamp);
                var timestampB = parseInt(b.dataset.timestamp);
                return timestampB - timestampA; // sort by descending timestamp (newest first)
            case 'Chronological':
                var timestampA = parseInt(a.dataset.timestamp);
                var timestampB = parseInt(b.dataset.timestamp);
                return timestampA - timestampB; // sort by ascending timestamp (oldest first)
            case 'Reverse Chronological':
                var timestampA = parseInt(a.dataset.timestamp);
                var timestampB = parseInt(b.dataset.timestamp);
                return timestampA - timestampB; // sort by ascending timestamp (oldest first)
            default:
                return 0;
        }
    });

    // ff the sorting option is Reverse Chronological, reverse the sorted array
    if (sortOption === 'Reverse Chronological') {
        videoArray.reverse();
    }

    var videoQueue = document.getElementById("videoQueue");
    if (!videoQueue) {
        console.error("Video queue container not found!");
        return;
    }

    // clear the existing video queue
    videoQueue.innerHTML = '';

    // append sorted videos to the video queue
    videoArray.forEach(function(entry) {
        videoQueue.appendChild(entry);
    });

    // update the current sort option
    currentSortOption = sortOption;
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


//The same as the function already implemented
//Saving the video data to Chrome's local storage
function saveVideoData(videoData) {
    // Debug to reset the storage while fiddling with 
    // chrome.storage.local.set({ videos: [] });

    chrome.storage.local.get({ videos: [] }, function(data) {
        var videos = data.videos;
        videos.push(videoData);

        chrome.storage.local.set({ videos: videos });
    });

  }


//The same as the function already implemented
function saveVideoData(videoLink) {
    // Debug to reset the storage while fiddling with 
    // chrome.storage.local.set({ videos: [] });

    chrome.storage.local.get({ videos: [] }, function(data) {
        var videos = data.videos;
        videos.push(videoLink);
        chrome.storage.local.set({ videos: videos });
    });

  }

// function getVideoLinks(callback) {
//     chrome.storage.local.get({ videos: [] }, function(data) {
//         var videos = data.videos;
//         console.log("retrieved videos: ", videos);
//         callback(videos);
//     });
// }

function getVideoLinks(callback) {
    chrome.storage.local.get({ videos: [] }, function (data) {
      const videos = data.videos || [];  // Use default empty array if "videos" key doesn't exist
  
      console.log("Retrieved videos:", videos);
  
      // Process videos to create structured objects (optional)
      if (videos.length > 0) { // Check for video entries and object structure
        const processedVideos = videos.map(entry => ({
        channel: entry.channel || "",  // Set default empty string for missing channels
        thumbnail: entry.thumbnail || "",  // Set default empty string for missing thumbnails
        title: entry.title || "",  // Set default empty string for missing titles
        videoId: entry.videoId,

        }));
        callback(processedVideos);
      } else {
        // Handle case where no videos are found or data format is unexpected
        console.log("No videos found in storage or unexpected data format.");
        callback([]);
      }
    });
  }


getVideoLinks(function(videos) {
    videos.forEach(function(video) {
    });
});

//Original Python API Implementation that doesn't seem to work at the moment
// this will send the ID of a youtube video to the backend(python apiCall) in order to get detail about video
// function videoID_toBackend(videoId) {
//     showNotification('Fetching video details...', 'info');

//     fetch('http://localhost:8000/get_video_details', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ videoId: videoId })
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {

//         if (data.items && data.items.length > 0) {
//             const videoDetails = data.items[0].snippet;
                    
//             //Save the video data to pass into the video adder and the save function
//             video_info = {
//                 videoId: videoId,
//                 title: videoDetails.title,
//                 channel: videoDetails.channelTitle,
//                 thumbnail: videoDetails.thumbnails.default.url
//             }
//             addVideo(video_info);
//             saveVideoData(video_info);

//         if (data) {
//             createVideoEntry({
//                 videoId: videoId,
//                 title: data.title,
//                 channel: data.channel,
//                 thumbnail: data.thumbnail
//             });

//             removeNotification('info');
//             showNotification('Video details fetched successfully!', 'success');
//         } else {
//             console.error('Video not found');
//             removeNotification('info');
//             showNotification('Video not found. Please check video ID.', 'error');
//         }
//     })
//     .catch(error => {
//         console.error('Error getting video details:', error);
//         removeNotification('info');
//         showNotification('Error fetching video details. Please try again later.', 'error');
//     });
// }

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
        
        //Save the video data to pass into the video adder and the save function
        video_info = {
            videoId: videoId,
            title: videoDetails.title,
            channel: videoDetails.channelTitle,
            thumbnail: videoDetails.thumbnails.default.url
            }
        addVideo(video_info);
        saveVideoData(video_info);
        } else {
            console.error('video not found')
        }
         })
            .catch(error => {
            console.error('Error getting video details', error);
    });
}


function removeNotification(type) {
    var notification = document.querySelector('.notification.' + type);
    if (notification) {
        notification.remove();
    }

}
