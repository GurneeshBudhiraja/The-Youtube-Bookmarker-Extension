let currentTabId = null;
let currentTabUrl = null;
let currentVideoId = null;
console.log("background.js loaded");
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete")
    try {
      if (tab.url && tab.url.includes("youtube.com/watch?v=")) {
        currentTabId = tabId;
        currentTabUrl = tab.url;
        currentVideoId = tab.url.split("v=")[1];
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
