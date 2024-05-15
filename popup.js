let bookmarks = [];
document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query(
    { active: true, currentWindow: true, url: "*://www.youtube.com/watch?v=*" },
    (tabs) => {
      const isYouTubeVideoOpen = tabs.length > 0;
      if (isYouTubeVideoOpen) {
        const youtubeVideoId = tabs[0].url.split("v=")[1];
        showBookmarks(youtubeVideoId);
      } else {
        document.querySelector(".cta-text").innerText =
          " No YouTube video found";
        document.querySelector(".bookmark-item").style.display = "none";
      }
    }
  );
});

const showBookmarks = (videoId) => {
  const bookmarkItem = document.querySelector(".bookmark-item");

  const paraTag = document.createElement("p");
  paraTag.classList.add("bookmark-text");
  paraTag.innerText = "Bookmark at 00:00:00";

  const deleteButton = document.createElement("i");
  deleteButton.classList.add("delete-button", "fas", "fa-trash");
  deleteButton.title = "Delete bookmark";
  deleteButton.addEventListener("click", () => {
    alert("Delete button clicked");
  });
  bookmarkItem.append(paraTag);
  bookmarkItem.append(deleteButton);
};
