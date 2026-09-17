import type Settings from "../settings";
import hide from "./hide_element";

export default async function HideNavItem(
  item: HTMLElement,
  settings: Settings,
) {
  const type = item.ariaLabel;

  switch (type?.toLowerCase()) {
    case "home":
      if (settings.nav.hideHome) hide(item);
      break;
    case "search and explore":
      if (settings.nav.hideExplore) hide(item);
      break;
    case "notifications":
      if (settings.nav.hideNotifications) hide(item);
      break;
    case "follow":
      if (settings.nav.hideFollow) hide(item);
      break;
    case "direct messages":
      if (settings.nav.hideChat) hide(item);
      break;
    case "grok":
      if (settings.nav.hideGrok) hide(item);
      break;
    case "history":
      if (settings.nav.hideHistory) hide(item);
      break;
    case "creator studio":
      if (settings.nav.hideStudio) hide(item);
      break;
    case "premium":
      if (settings.nav.hidePremium) hide(item);
      break;
    case "profile":
      if (settings.nav.hideProfile) hide(item);
      break;
  }
}
