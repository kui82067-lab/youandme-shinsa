const PHONE_NUMBER = ""; // 실제 예약 전화번호를 입력하세요. 예: 01012345678

const priceDate = document.querySelector("#price-date");
if (priceDate) {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const datePart = (type) => parts.find((part) => part.type === type)?.value || "";
  priceDate.textContent = `${datePart("year")}.${datePart("month")}.${datePart("day")}`;
}

const businessData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://xn--hg3b95obmb.com/#business",
  name: "신사 유앤미",
  alternateName: ["유앤미 가라오케", "SHINSA YOU & ME"],
  url: "https://xn--hg3b95obmb.com/",
  image: [
    "https://xn--hg3b95obmb.com/assets/entrance.webp",
    "https://xn--hg3b95obmb.com/assets/signboard.jfif",
    "https://xn--hg3b95obmb.com/assets/room-02.png"
  ],
  description: "강남권 신사역 인근 서초구 잠원동에서 예약제로 운영되는 유앤미 가라오케. 67개의 프라이빗 룸으로 1인 방문부터 단체 회식까지 이용 가능합니다.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "잠원동 18-9",
    addressLocality: "서초구",
    addressRegion: "서울특별시",
    addressCountry: "KR"
  },
  areaServed: { "@type": "City", name: "서울" },
  sameAs: ["https://open.kakao.com/o/sMEzm3Ci", "https://t.me/UNME2027"],
  priceRange: "₩₩₩",
  currenciesAccepted: "KRW"
};
const structuredData = document.createElement("script");
structuredData.type = "application/ld+json";
structuredData.textContent = JSON.stringify(businessData);
document.head.appendChild(structuredData);

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

const introSection = document.querySelector(".intro");
if (introSection) {
  introSection.insertAdjacentHTML("afterend", `
    <section class="karaoke-story"><div class="wrap karaoke-grid">
      <div><p class="overline">KARAOKE EXPERIENCE</p><h2>노래와 음악,<br>좋은 술이 함께하는 시간</h2></div>
      <div class="karaoke-copy"><p>강남권 신사역 인근의 유앤미는 독립된 룸에서 노래와 음악을 즐기며, 고급 양주와 함께 여유로운 시간을 보낼 수 있는 프라이빗 가라오케입니다. 서초구 잠원동에서 1인 방문부터 친구 모임, 비즈니스와 단체 회식까지 목적과 인원에 맞는 공간을 예약제로 안내합니다.</p><ul><li><b>PRIVATE KARAOKE</b><span>다른 일행과 분리된 독립형 프라이빗 룸</span></li><li><b>PREMIUM SPIRITS</b><span>모임의 분위기에 어울리는 고급 양주 구성</span></li><li><b>LIVE DJ</b><span>분위기와 흐름을 더하는 상주 DJ 퍼포먼스</span></li><li><b>FOR EVERY GROUP</b><span>1인 방문부터 비즈니스와 단체 회식까지</span></li></ul></div>
    </div></section>`);
}

const track = document.querySelector(".gallery-track");
const cards = [...document.querySelectorAll(".gallery-card")];
const progress = document.querySelector(".gallery-progress span");
const prev = document.querySelector(".gallery-arrow.prev");
const next = document.querySelector(".gallery-arrow.next");

function cardStep() {
  const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
  return cards[0].getBoundingClientRect().width + gap;
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

const firstCaption = cards[0]?.querySelector("figcaption");
if (firstCaption) {
  firstCaption.querySelector("em").textContent = "MAIN ENTRANCE";
  firstCaption.querySelector("strong").textContent = "정문 입구";
}
