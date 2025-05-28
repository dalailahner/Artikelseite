import Sortable from "sortablejs/modular/sortable.core.esm";

/////////
// EVENTS

// LOAD
window.addEventListener("DOMContentLoaded", (event) => {
  positionTooltips(".glossarTooltip", ".glossarTooltipIndicator");
});

// RESIZE
window.addEventListener("resize", (event) => {
  setReadingProgress(".readingProgress", ".articleText");
  positionTooltips(".glossarTooltip", ".glossarTooltipIndicator");
});

// SCROLL
let lastScrollPos = 0;
document.addEventListener("scroll", (event) => {
  if (lastScrollPos < window.scrollY) document.querySelector(".mainHeader").classList.add("hide");
  if (lastScrollPos > window.scrollY) document.querySelector(".mainHeader").classList.remove("hide");
  lastScrollPos = window.scrollY;
  setReadingProgress(".readingProgress", ".articleText");
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
 * sets the scaleX transform of the target element based on the position of the measured element in the viewport.
 * @param {string} targetElSelector - selector for element that gets scaled.
 * @param {string} measuredElSelector - selector for measured element.
 * @example
 * setReadingProgress(".progressBar", ".articleBody");
 */
function setReadingProgress(targetElSelector, measuredElSelector) {
  if (typeof targetElSelector !== "string" || targetElSelector.length === 0) {
    console.error("targetElSelector of setReadingProgress() is not a string or empty");
    return;
  }
  if (typeof measuredElSelector !== "string" || measuredElSelector.length === 0) {
    console.error("measuredElSelector of setReadingProgress() is not a string or empty");
    return;
  }
  const targetEl = document?.querySelector(targetElSelector);
  const measuredEl = document?.querySelector(measuredElSelector);
  if (targetEl && measuredEl) {
    const halfWindowHeight = window.innerHeight >> 1;
    const measuredElRect = measuredEl.getBoundingClientRect();
    const progress = Math.min(Math.max((measuredElRect.top * -1 + halfWindowHeight) / measuredElRect.height, 0), 1);
    targetEl.style.transform = `scaleX(${progress})`;
  } else {
    console.warn("selectors in setReadingProgress() couldn't find any elements");
  }
}
