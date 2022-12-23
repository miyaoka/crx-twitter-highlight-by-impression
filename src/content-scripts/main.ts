const timelineSelector = "[data-testid=tweet]";
const tweetTextSelector = "[data-testid=tweetText]";
const impressionSelector = "[role=group] a";
const likeSelector = "[data-testid=like]";
const unlikeSelector = "[data-testid=unlike]";

const likeRatioId = "likeRatio";

const displayLikeRatio = (line: HTMLElement, ratio: number) => {
  const likePercentage = `${(ratio * 100).toFixed(1)}%`;
  const likeRatioEl = line.querySelector<HTMLElement>(
    `[data-testid=${likeRatioId}]`
  );
  if (likeRatioEl) {
    likeRatioEl.innerText = likePercentage;
    return;
  }

  const newEl = document.createElement("div");
  newEl.dataset.testid = likeRatioId;
  newEl.innerText = likePercentage;
  newEl.style.position = "absolute";
  newEl.style.right = "0";
  newEl.style.opacity = "0.5";
  newEl.style.color = "#fff";
  newEl.style.fontSize = "large";
  newEl.style.fontWeight = "bold";
  line.appendChild(newEl);
};

const update = () => {
  const timeline = Array.from(
    document.querySelectorAll<HTMLElement>(timelineSelector)
  );

  timeline.forEach((line) => {
    const impressionEl = line.querySelector<HTMLElement>(impressionSelector);
    if (!impressionEl) return;
    const likeEl =
      line.querySelector<HTMLElement>(likeSelector) ??
      line.querySelector<HTMLElement>(unlikeSelector);
    if (!likeEl) return;

    const impressionCount = getCount(impressionEl);
    const likeCount = getCount(likeEl);

    if (impressionCount > 0) {
      displayLikeRatio(line, likeCount / impressionCount);
    }

    if (impressionCount < 1000) return;

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
