import hide from "./actions/hide_element";
import HideNavItem from "./actions/hide_nav_item";
import Settings from "./settings";

interface Selectors {
  article: string;
  ad: string;
  rightColumn: string;
  primaryColumn: string;
  feedContainer: string;
  leftColumn: string;
  main: string;
  composeBlock: string;
  timelineForYou: string;
  timelineFollowing: string;
  timelineAdder: string;
  navItem: string;
  navItemMore: string;
  postButton: string;
  grokButton: string;
  chatButton: string;
}
type SelectorKey = keyof Selectors;

const selectors: Selectors = {
  article: "main article",
  ad: "main article > div > div > div:nth-child(2) > div:nth-child(2) > div:first-child > div > div:nth-child(2) > div > div:first-child > span",
  rightColumn: 'main div[data-testid="sidebarColumn"]',
  primaryColumn: 'main div[data-testid="primaryColumn"]',
  feedContainer:
    'main div[data-testid="primaryColumn"] div[aria-label="Home timeline"] div:nth-child(5)',
  leftColumn: 'header[role="banner"]',
  main: "main",
  composeBlock: 'main div[aria-label="Home timeline"] > div:nth-child(3)',
  timelineForYou:
    'main div[aria-label="Home timeline"] > div:nth-child(1) nav div[role="tablist"] > div:first-child',
  timelineFollowing:
    'main div[aria-label="Home timeline"] > div:nth-child(1) nav div[role="tablist"] > div:nth-child(2) > div:first-child',
  timelineAdder:
    'main div[aria-label="Home timeline"] > div:nth-child(1) button[aria-label="Manage timelines"]',
  navItem: 'header nav[aria-label="Primary"] a',
  navItemMore: 'button[data-testid="AppTabBar_More_Menu',
  postButton: 'header a[aria-label="Post"]',
  grokButton: "#react-root > div > div > div#layers > div > div:first-child",
  chatButton: "#react-root > div > div > div#layers > div > div:nth-child(2)",
} as const;

const clean = (settings: Settings) => {
  Object.keys(selectors).forEach((key) => {
    const selectorKey = key as SelectorKey;
    const selector = selectors[key as SelectorKey];
    const elements = document.querySelectorAll(selector);

    for (const el of elements) {
      if (!(el instanceof HTMLElement)) continue;

      switch (selectorKey) {
        case "article":
          if (settings.hideAds) {
            const adSpan = el.querySelector(selectors.ad) as HTMLElement;
            const isAd = adSpan?.innerText.toLowerCase() === "ad";
            if (isAd) hide(el);
          }
          break;
        case "rightColumn":
          if (settings.sections.hideRightColumn) hide(el);
          break;
        case "primaryColumn":
          if (settings.sections.hideRightColumn) {
            el.style.setProperty("max-width", "100%", "important");
          }
          break;
        case "feedContainer":
          if (settings.sections.hideRightColumn) {
            el.style.setProperty("max-width", "100%", "important");
          }
          break;
        case "leftColumn":
          if (settings.sections.hideLeftColumn) hide(el);
          break;
        case "main":
          if (settings.sections.hideLeftColumn) {
            el.style.setProperty("align-items", "center", "important");
          }
          break;
        case "composeBlock":
          if (
            location.pathname === "/home" &&
            settings.sections.hideComposeBlock
          )
            hide(el);
          break;
        case "timelineForYou":
          if (location.pathname === "/home" && settings.timelines.hideForYou)
            hide(el);
          break;
        case "timelineFollowing":
          if (
            location.pathname === "/home" &&
            settings.timelines.hideForYou &&
            (el as HTMLElement).ariaSelected === "false"
          ) {
            (el as HTMLElement).click();
          }
          break;
        case "timelineAdder":
          if (location.pathname === "/home" && settings.timelines.hideAdder)
            hide(el);
          break;
        case "navItem":
          HideNavItem(el, settings);
          break;
        case "navItemMore":
          if (settings.nav.hideMore) hide(el);
          break;
        case "postButton":
          if (settings.misc.hidePostBtn) hide(el);
          break;
        case "grokButton":
          if (settings.misc.hideGrokBtn) hide(el);
          break;
        case "chatButton":
          if (settings.misc.hideChatBtn) hide(el);
          break;
      }
    }
  });
};

const cb = (mutations: MutationRecord[], settings: Settings) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        clean(settings);
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const settings = new Settings();
  await settings.init();

  clean(settings);

  const observer = new MutationObserver((m: MutationRecord[]) =>
    cb(m, settings),
  );
  observer.observe(document.body, { childList: true, subtree: true });
});
