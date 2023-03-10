const timelineSelector = "[data-testid=tweet]";
const tweetTextSelector = "[data-testid=tweetText]";
const impressionSelector = "[role=group] a[href$=analytics]";
const likeSelector = "[data-testid=like]";
const unlikeSelector = "[data-testid=unlike]";

const likeRatioId = "likeRatio";

const displayLikeRatio = (line: HTMLElement, ratio: number) => {
  // like 1%以上は良ツイートとしてハイライト
  const color = ratio > 0.01 ? "#ff0" : "#fff";
  const likePercentage = `${(ratio * 100).toFixed(1)}%`;

  const likeRatioEl = line.querySelector<HTMLElement>(
    `[data-testid=${likeRatioId}]`
  );
  if (likeRatioEl) {
    likeRatioEl.innerText = likePercentage;
    likeRatioEl.style.color = color;
    return;
  }

  const newEl = document.createElement("div");
  newEl.dataset.testid = likeRatioId;
  newEl.innerText = likePercentage;
  newEl.style.position = "absolute";
  newEl.style.right = "0";
  newEl.style.opacity = "0.5";
  newEl.style.fontSize = "large";
  newEl.style.fontWeight = "bold";
  newEl.style.color = color;

  line.appendChild(newEl);
};

const update = () => {
  const timeline = document.querySelectorAll<HTMLElement>(timelineSelector);

  timeline.forEach((line) => {
    const impressionEl = line.querySelector<HTMLElement>(impressionSelector);
    if (!impressionEl) return;

    // impressionの位置を左に追い出して目立たなくする
    const impressionParentEl = impressionEl.parentElement;
    if (impressionParentEl) {
      impressionParentEl.style.position = "absolute";
      impressionParentEl.style.transform = "translateX(-100%)";
      impressionParentEl.style.opacity = "0.2";
      impressionParentEl.style.wordBreak = "keep-all";
      impressionParentEl.style.pointerEvents = "none";
    }

    const likeEl =
      line.querySelector<HTMLElement>(likeSelector) ??
      line.querySelector<HTMLElement>(unlikeSelector);
    if (!likeEl) return;

    const impressionCount = getCount(impressionEl);
    const likeCount = getCount(likeEl);

    if (impressionCount < 1000) return;

    // like / impression の比率表示を追加
    displayLikeRatio(line, likeCount / impressionCount);

    const tweetTextEl = line.querySelector<HTMLElement>(tweetTextSelector);
    if (!tweetTextEl) return;

    if (impressionCount < 10000) {
      tweetTextEl.style.fontWeight = "500";
      tweetTextEl.style.color = "#ffffcc";
      // tweetText.style.fontSize = "large";
      return;
    }
    if (impressionCount < 100000) {
      tweetTextEl.style.fontWeight = "600";
      tweetTextEl.style.color = "#ffff66";
      // tweetText.style.fontSize = "x-large";
      return;
    }
    if (impressionCount < 1000000) {
      tweetTextEl.style.fontWeight = "700";
      tweetTextEl.style.color = "#ffff00";
      // tweetText.style.fontSize = "x-large";
      return;
    }
    tweetTextEl.style.fontWeight = "900";
    tweetTextEl.style.color = "#ffcc00";
    // tweetText.style.fontSize = "xx-large";
  });
};

const getCount = (el: HTMLElement): number => {
  const label = el.ariaLabel;

  // label先頭部分から数値を取得する（言語に依らず数値が先頭に表記されている前提）
  // e.g.)
  // aria-label="107056 件の表示。ツイートアナリティクスを表示"
  // aria-label="14427528 Views. View Tweet analytics"
  if (!label) return 0;
  const matched = label.match(/^\d+/);
  if (!matched) return 0;
  return Number(matched[0]);
};

new PerformanceObserver(() => {
  update();
}).observe({
  type: "longtask",
  buffered: true,
});

document.addEventListener("scroll", () => {
  update();
});
