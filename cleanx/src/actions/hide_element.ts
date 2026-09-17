export default function hide(el: HTMLElement) {
  el.style.setProperty("display", "none", "important");
  el.style.setProperty("width", "0", "important");
  el.style.setProperty("height", "0", "important");
  el.style.setProperty("padding", "0", "important");
}
