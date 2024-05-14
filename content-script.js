console.log("content-script.js loaded");
(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "addBookmarkButton") {
      setTimeout(() => {
        addBookmarkButton();
      }, 2000);
    }
  });
})();

function addBookmarkButton() {
  console.log("Adding bookmark button");
  const rightControls =
    document.getElementsByClassName("ytp-right-controls")[0];
  if (rightControls.childNodes[0].id === "bookmarkButton") {
    return;
  }
  const bookmarkButton = document.createElement("img");
  bookmarkButton.id = "bookmarkButton";
  bookmarkButton.src = chrome.runtime.getURL("assets/bookmark.png");
  bookmarkButton.alt = "Bookmark";
  const bookmarkButtonStyle = {
    width: "30px",
    height: "30px",
    cursor: "pointer",
    border: "2px solid #78b0fc",
    margin: "0 18px 8px",
    "border-radius": "50%",
  };
  Object.assign(bookmarkButton.style, bookmarkButtonStyle);
  bookmarkButton.title = "Bookmark this video";
  rightControls.prepend(bookmarkButton);
  return;
}
