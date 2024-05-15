let currentTabId = null;
let currentTabUrl = null;
let currentVideoId = null;
let localStorageBookmarks = [];
console.log("background.js loaded");
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete")
    try {
      if (tab.url && tab.url.includes("youtube.com/watch?v=")) {
        currentTabId = tabId;
        currentTabUrl = tab.url;
        currentVideoId = tab.url.split("v=")[1];
        console.log(currentVideoId);
        (async () => {
          await chrome.tabs.sendMessage(currentTabId, {
            action: "addBookmarkButton",
          });
        })();
      } else {
        currentTabId = null;
        currentTabUrl = null;
        console.log("Not a youtube video page");
      }
    } catch (error) {
      console.log("Error in background.js: ", error);
    }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "addBookmark") {
    chrome.storage.local.get([currentVideoId], (result) => {
      if (result[currentVideoId] && result[currentVideoId].length > 0) {
        localStorageBookmarks = result[currentVideoId];
        console.log("Existing bookmarks: " + localStorageBookmarks);
      }
      localStorageBookmarks.push(request.time);
      chrome.storage.local.set(
        { [currentVideoId]: localStorageBookmarks },
        () => {
          console.log("Bookmark added and saved");
        }
      );
    });
  } else if (request.action === "fetchDetails") {
    sendResponse({ currentTabId, currentTabUrl, currentVideoId });
  }
});
