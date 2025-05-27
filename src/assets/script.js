import Sortable from "sortablejs/modular/sortable.core.esm";

/////////
// EVENTS

// LOAD
window.addEventListener("DOMContentLoaded", (event) => {
  positionTooltips(".glossarTooltip", ".glossarTooltipIndicator");
});

// RESIZE
window.addEventListener("resize", (event) => {
  setReadingProgress(".readingProgress", "h1.articleHeadline ~ .articleBody");
  positionTooltips(".glossarTooltip", ".glossarTooltipIndicator");
});

// SCROLL
let lastScrollPos = 0;
document.addEventListener("scroll", (event) => {
  if (lastScrollPos < window.scrollY) document.querySelector(".mainHeader").classList.add("hide");
  if (lastScrollPos > window.scrollY) document.querySelector(".mainHeader").classList.remove("hide");
  lastScrollPos = window.scrollY;
  setReadingProgress(".readingProgress", "h1.articleHeadline ~ .articleBody");
});

// ACCOUNT BUTTON
const accountMenuEditBtn = document.querySelector(".accountMenuEditBtn");

accountMenuEditBtn.addEventListener("click", (event) => {
  const inEditMode = event.currentTarget.closest(".accountMenu").dataset.edit === "true";
  event.currentTarget.closest(".accountMenu").dataset.edit = !inEditMode;
});

accountMenuEditBtn.addEventListener(
  "click",
  (event) => {
    Sortable.create(document.querySelector(".accountMenuSortable"), {
      animation: 150,
      easing: "cubic-bezier(0.87, 0, 0.13, 1)",
      handle: ".accountMenuItemHandle",
      draggable: ".accountMenuItem",
      ghostClass: "sortableGhost",
    });
  },
  { once: true },
);

// FOLLOW AUTHOR BUTTON
document.querySelector(".followAuthorBtn").addEventListener("click", (event) => {
  const isFollowing = event.currentTarget.dataset?.followed === "true";
  event.currentTarget.dataset.followed = !isFollowing;
  event.currentTarget.innerText = isFollowing ? "Folgen" : "gefolgt";
});

// TOOLBAR CLASS TOGGLE
for (const btn of document.querySelectorAll(".toolbarBtn")) {
  btn.addEventListener("click", (ev) => {
    if (ev.currentTarget.classList.contains("share")) {
      // use native device share if mobile/tablet
      if (navigator.userAgent.includes("Mobi") || window.matchMedia("(pointer: coarse)").matches) {
        navigator.share({
          title: "SCHWIMMA OIDA",
          text: "Artikel auf Salzburger Nachrichten",
          url: "https://www.opengraph.xyz/url/https%3A%2F%2Fwww.sn.at%2Fleben%2Fgesundheit%2Fschwimmen-die-vielseitigen-vorteile-koerper-seele-159201952",
        });
        return;
      }
    }

    if (!ev.currentTarget.classList.contains("shareLink")) {
      ev.currentTarget.classList.toggle("active");
    }
  });
}

// GLOSSAR AUDIO BTN
for (const btn of document.querySelectorAll(".glossarAudioBtn")) {
  btn.addEventListener("click", (event) => {
    event.currentTarget.querySelector("audio").play();
  });
}

// COMMENT MODAL
const commentModal = document.querySelector("#commentModal");
document.querySelector("#showCommentModalBtn").addEventListener("click", (ev) => {
  commentModal.showModal();
});
document.querySelector("#commentModalCloseBtn").addEventListener("click", (ev) => {
  commentModal.close();
});

////////////
// FUNCTIONS

// TOOLTIP
/**
 * horizontally offsets the tooltips if they are outside of the body.
 * @param {string} tooltip - selector for tooltip elements.
 * @param {string} indicator - selector for indicator element. (has do be a child of tooltip)
 * @example
 * positionTooltips(".tooltip", ".tooltipIndicator");
 */
function positionTooltips(tooltip = ".glossarTooltip", indicator = ".glossarTooltipIndicator") {
  if (document.querySelectorAll(tooltip)?.length > 0) {
    for (const tooltipEL of document.querySelectorAll(tooltip)) {
      const indicatorEL = tooltipEL.querySelector(indicator);

      tooltipEL.style.transform = "translateX(-50%)";
      indicatorEL.style.transform = "translateX(-50%)";

      const tooltipRect = tooltipEL.getBoundingClientRect();

      if (tooltipRect.left < 0) {
        const offset = Math.abs(tooltipRect.left) + document.body.clientWidth * 0.05;
        tooltipEL.style.transform = `translateX(calc(-50% + ${offset}px))`;
        indicatorEL.style.transform = `translateX(calc(-50% - ${offset}px))`;
      }
      if (tooltipRect.right > document.body.clientWidth) {
        const offset = tooltipRect.right - document.body.clientWidth + document.body.clientWidth * 0.05;
        tooltipEL.style.transform = `translateX(calc(-50% - ${offset}px))`;
        indicatorEL.style.transform = `translateX(calc(-50% + ${offset}px))`;
      }
    }
  } else {
    console.warn(`positionTooltips() can't find any elements with selector "${tooltip}"`);
  }
}
// READING PROGRESS BAR
/**
 * sets the scaleX transform on a div based on the position of a measured element in the viewport.
 * @param {string} targetEl - selector for element that gets the scaleX transform.
 * @param {string} measuredEl - selector for measured element.
 * @example
 * setReadingProgress(".progressBar", ".articleBodyText");
 */
function setReadingProgress(targetEl = ".readingProgress", measuredEl = "h1.articleHeadline ~ .articleBody") {
  const readingProgressEl = document?.querySelector(targetEl);
  const articleBodyEl = document?.querySelector(measuredEl);
  if (readingProgressEl && articleBodyEl) {
    const halfWindowHeight = window.innerHeight >> 1;
    const articleBodyRect = articleBodyEl.getBoundingClientRect();
    const progress = Math.min(Math.max((articleBodyRect.top * -1 + halfWindowHeight) / (articleBodyRect.height - halfWindowHeight), 0), 1);
    readingProgressEl.style.transform = `scaleX(${progress})`;
  }
}
