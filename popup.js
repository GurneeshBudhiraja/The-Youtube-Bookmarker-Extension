let tabId = null;
let bookmarks = [];
let youtubeVideoId = null;
document.addEventListener("DOMContentLoaded", async () => {
  chrome.tabs.query(
    { active: true, currentWindow: true, url: "*://www.youtube.com/watch?v=*" },
    async (tabs) => {
      const isYouTubeVideoOpen = tabs.length > 0;
      if (isYouTubeVideoOpen) {
        tabId = tabs[0].id;
        youtubeVideoId = tabs[0].url.split("v=")[1];
        bookmarks = await fetchBookmarks(youtubeVideoId);
        bookmarks = sortTimeStrings(bookmarks);
        showBookmarks(bookmarks);
      } else {
        document.querySelector(".cta-text").innerText =
          " No YouTube video found";
        document.querySelector(".bookmark-item").style.display = "none";
      }
    }
  );
});

const fetchBookmarks = (youtubeVideoId) => {
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

const showBookmarks = (bookmarks) => {
  if (bookmarks.length === 0) {
    document.querySelector(".cta-text").innerText = "No bookmarks added yet";
    return;
  }
  for (let i = 0, length = bookmarks.length; i < length; i++) {
    const popupContainer = document.querySelector(".popup-container");
    const bookmarkItem = document.createElement("div");
    bookmarkItem.classList.add("bookmark-item");

    const paraTag = document.createElement("p");
    paraTag.classList.add("bookmark-text");
    paraTag.innerText = "Bookmark at " + bookmarks[i];
    bookmarkItem.addEventListener("click", bookmarkItemClicked);

    const deleteButton = document.createElement("i");
    deleteButton.classList.add("delete-button", "fas", "fa-trash");
    deleteButton.title = "Delete bookmark";
    bookmarkItem.append(paraTag);
    bookmarkItem.append(deleteButton);
    popupContainer.append(bookmarkItem);
    deleteButton.addEventListener("click", deleteButtonClicked);
  }
};

const deleteButtonClicked = (e) => {
  e.stopPropagation();
  const BookmarkTime = e.target.previousSibling.innerText.split(" ")[2];
  bookmarks = bookmarks.filter((bookmark) => bookmark !== BookmarkTime);
  const message = {
    action: "deleteBookmark",
    bookmarks,
    youtubeVideoId,
  };
  chrome.tabs.sendMessage(tabId, message);
  e.target.parentElement.remove();
  return;
};

const bookmarkItemClicked = (e) => {
  let parentDiv = null;
  if (e.target.parentElement.classList.contains("bookmark-item")) {
    parentDiv = e.target.parentElement;
  } else {
    parentDiv = e.target;
  }

  const bookmarkTime = parentDiv.children[0].innerText.split(" ")[2];
  const [hours, minutes, seconds] = bookmarkTime.split(":");
  const bookmarkTimeSeconds =
    parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  chrome.tabs.sendMessage(tabId, {
    action: "changeCurrentTime",
    bookmarkTimeSeconds,
  });
};

const sortTimeStrings = (timeStrings) => {
  return timeStrings.sort((time1, time2) => {
    const [hours1, minutes1, seconds1] = time1.split(":").map(Number);
    const [hours2, minutes2, seconds2] = time2.split(":").map(Number);

    const timeInSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1;
    const timeInSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2;

    return timeInSeconds1 - timeInSeconds2;
  });
};
