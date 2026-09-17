export function waitForElement(selector: string): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((_mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
export function watchUrlChange(callback: (url: string) => void) {
  let lastUrl = location.href;

  const fire = () => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      callback(location.href);
    }
  };

  const origPush = history.pushState;
  history.pushState = function (...args) {
    origPush.apply(this, args);
    fire();
  };

  const origReplace = history.replaceState;
  history.replaceState = function (...args) {
    origReplace.apply(this, args);
    fire();
  };

  window.addEventListener("popstate", fire);
}
