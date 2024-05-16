console.log("content-script.js loaded");
let currentVideoTime = null;

(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "addBookmarkButton") {
      setTimeout(() => {
        const bookmarkButton = addBookmarkButton();
        bookmarkButton.addEventListener("click", () => {
          currentVideoTime =
            document.getElementsByClassName("video-stream")[0].currentTime;
          const formattedTime = formatCurrentVideoTime(currentVideoTime);
          console.log("Current video time: ", formattedTime);
          addLocalStorage(formattedTime);
        });
      }, 2000);
    } else if (message.action === "changeCurrentTime") {
      document.getElementsByClassName("video-stream")[0].currentTime =
        message.bookmarkTimeSeconds;
      document
        .getElementsByClassName("video-stream")[0]
        .play()
        .then(() => console.log("Playing video"));
    } else if (message.action === "deleteBookmark") {
      const { youtubeVideoId } = message;
      const { bookmarks: newBookmarks } = message;
      chrome.storage.sync.set({ [youtubeVideoId]: newBookmarks }).then(() => {
        console.log("Bookmark deleted");
        return;
      });
    }
  });
})();

const formatCurrentVideoTime = (time) => {
  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const addBookmarkButton = () => {
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

  Object.assign(bookmarkButton.style, {
    width: "30px",
    height: "30px",
    cursor: "pointer",
    border: "2px solid #78b0fc",
    margin: "0 18px 8px",
    "border-radius": "50%",
  });
  bookmarkButton.title = "Bookmark this video";
  rightControls.prepend(bookmarkButton);
  return bookmarkButton;
};

const addLocalStorage = async (formattedTime) => {
  let localStorageBookmarks = [];
  const currentVideoId = window.location.search.split("v=")[1];
  localStorageBookmarks = await fetchLocalStorage(currentVideoId);
  if (!localStorageBookmarks.includes(formattedTime)) {
    localStorageBookmarks.push(formattedTime);
    chrome.storage.sync.set(
      {
        [currentVideoId]: localStorageBookmarks,
      },
      () => {
        console.log("Bookmark added and saved");
      }
    );
  }
  return;
};

const fetchLocalStorage = (youtubeVideoId) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([youtubeVideoId]).then((result) => {
      if (result[youtubeVideoId] && result[youtubeVideoId].length > 0) {
        const bookmarks = result[youtubeVideoId];
        resolve(bookmarks);
      } else {
        resolve([]);
      }
    });
  });
};
