chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ videos: [] });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'saveVideo') {
        saveVideo(message.video);
    } else if (message.action === 'getVideos') {
        getVideos(sendResponse);
        return true;
    }
});

function saveVideo(videoLink) {
    chrome.storage.local.get({ videos: [] }, function(data) {
        var videos = data.videos;
        videos.push(videoLink);
        chrome.storage.local.set({ videos: videos });
    });
}

function getVideos(callback) {
    chrome.storage.local.get({ videos: [] }, function(data) {
        var videos = data.videos;
        callback(videos);
    });
}

  
