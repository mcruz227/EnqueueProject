// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "saveVideoLink") {
        saveVideoLink(message.videoLink);
    } else if (message.action === "getVideoLinks") {
        getVideoLinks(sendResponse);
        // Return true to indicate that sendResponse will be called asynchronously
        return true;
    }
});

function saveVideoLink(videoLink) {
    chrome.runtime.sendMessage({ action: "saveVideoLink", videoLink: videoLink });
}

function getVideoLinks(callback) {
    chrome.runtime.sendMessage({ action: "getVideoLinks" }, callback);
}

