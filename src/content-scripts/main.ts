const timelineSelector = "[data-testid=tweet]";
const tweetTextSelector = "[data-testid=tweetText]";
const impressionSelector = "[role=group] a";

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

const update = () => {
  const timeline = Array.from(
    document.querySelectorAll<HTMLElement>(timelineSelector)
  );

  const lang = document.querySelector<HTMLHtmlElement>("html")?.lang;

  timeline.forEach((line) => {
    const impressionEl = line.querySelector<HTMLElement>(impressionSelector);
    if (!impressionEl) return;
    const impressionText = impressionEl.innerText;

    const count = getCount(impressionText, lang === "ja" ? "ja" : "en");
    if (count < 1000) return;
    const tweetTextEl = line.querySelector<HTMLElement>(tweetTextSelector);
    if (!tweetTextEl) return;

    if (count < 10000) {
      tweetTextEl.style.fontWeight = "500";
      tweetTextEl.style.color = "#ffffcc";
      // tweetText.style.fontSize = "large";
      return;
    }
    if (count < 100000) {
      tweetTextEl.style.fontWeight = "600";
      tweetTextEl.style.color = "#ffff66";
      // tweetText.style.fontSize = "x-large";
      return;
    }
    if (count < 1000000) {
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
