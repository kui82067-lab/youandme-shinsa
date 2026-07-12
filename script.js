const PHONE_NUMBER = ""; // 실제 예약 전화번호를 입력하세요. 예: 01012345678

const phoneLinks = document.querySelectorAll(".js-phone");
const toast = document.querySelector(".toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

phoneLinks.forEach((link) => {
  if (PHONE_NUMBER) {
    link.href = `tel:${PHONE_NUMBER}`;
  } else {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("예약 전화번호 입력 후 전화 연결이 활성화됩니다.");
    });
  }
});

const track = document.querySelector(".gallery-track");
const cards = [...document.querySelectorAll(".gallery-card")];
const progress = document.querySelector(".gallery-progress span");
const prev = document.querySelector(".gallery-arrow.prev");
const next = document.querySelector(".gallery-arrow.next");

function cardStep() {
  return cards[0].getBoundingClientRect().width + 24;
}

function updateProgress() {
  const max = track.scrollWidth - track.clientWidth;
  const ratio = max > 0 ? track.scrollLeft / max : 0;
  progress.style.width = `${11.11 + ratio * 88.89}%`;
}

prev.addEventListener("click", () => track.scrollBy({ left: -cardStep(), behavior: "smooth" }));
next.addEventListener("click", () => track.scrollBy({ left: cardStep(), behavior: "smooth" }));
track.addEventListener("scroll", updateProgress, { passive: true });

track.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
    event.preventDefault();
    track.scrollLeft += event.deltaY;
  }
}, { passive: false });

let dragging = false;
let startX = 0;
let startScroll = 0;

track.addEventListener("pointerdown", (event) => {
  dragging = true;
  startX = event.clientX;
  startScroll = track.scrollLeft;
  track.classList.add("is-dragging");
  track.setPointerCapture(event.pointerId);
});

track.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  track.scrollLeft = startScroll - (event.clientX - startX) * 1.15;
});

function endDrag() {
  dragging = false;
  track.classList.remove("is-dragging");
}

track.addEventListener("pointerup", endDrag);
track.addEventListener("pointercancel", endDrag);
track.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") next.click();
  if (event.key === "ArrowLeft") prev.click();
});

document.addEventListener("contextmenu", (event) => {
  if (event.target.closest("img")) event.preventDefault();
});

document.addEventListener("dragstart", (event) => {
  if (event.target.closest("img")) event.preventDefault();
});

updateProgress();
