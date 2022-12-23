const timelineSelector = "[data-testid=tweet]";
const tweetTextSelector = "[data-testid=tweetText]";
const impressionSelector = "[role=group] a";
const likeSelector = "[data-testid=like]";
const unlikeSelector = "[data-testid=unlike]";

const numberUnitMap = {
  ja: {
    text: "万億兆",
    base: 10000,
  },
  en: {
    text: "KMB",
    base: 1000,
  },
} as const;

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

  const langText = document.querySelector<HTMLHtmlElement>("html")?.lang;
  const lang = langText === "ja" ? "ja" : "en";

  timeline.forEach((line) => {
    const impressionEl = line.querySelector<HTMLElement>(impressionSelector);
    if (!impressionEl) return;
    const likeEl =
      line.querySelector<HTMLElement>(likeSelector) ??
      line.querySelector<HTMLElement>(unlikeSelector);
    if (!likeEl) return;

    const impressionCount = getCount(impressionEl.innerText, lang);
    const likeCount = getCount(likeEl.innerText, lang);

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

const getCount = (text: string, lang: "ja" | "en"): number => {
  const numberUnit = numberUnitMap[lang];

  const unitRegExp = new RegExp(
    `^(?<num>.*\\d)(?<unit>[${numberUnit.text}])?$`
  );

  const groups = text.match(unitRegExp)?.groups;
  if (!groups) return 0;

  const num = Number(String(groups.num).replace(/,/, ""));
  if (!groups.unit) return num;

  const unitNum = numberUnit.base ** (numberUnit.text.indexOf(groups.unit) + 1);
  return num * unitNum;
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
