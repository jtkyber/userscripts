// ==UserScript==
// @name         CleanX
// @version      0.0.6
// @description  Remove ads and hide unwanted UI elements on x.com. Includes a convenient custom settings menu.
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/jtkyber/userscripts/main/cleanx/dist/cleanx.user.js
// @updateURL    https://raw.githubusercontent.com/jtkyber/userscripts/main/cleanx/dist/cleanx.user.js
// @match        https://x.com/*
// @grant        GM.addStyle
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @run-at       document-start
// ==/UserScript==

(function() {
	"use strict";
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	function hide(el) {
		el.style.setProperty("display", "none", "important");
		el.style.setProperty("width", "0", "important");
		el.style.setProperty("height", "0", "important");
		el.style.setProperty("padding", "0", "important");
	}
	async function HideNavItem(item, settings) {
		switch (item.ariaLabel?.toLowerCase()) {
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
			case "profile": if (settings.nav.hideProfile) hide(item);
		}
	}
	function waitForElement(selector) {
		return new Promise((resolve) => {
			if (document.querySelector(selector)) return resolve(document.querySelector(selector));
			const observer = new MutationObserver((_mutations) => {
				if (document.querySelector(selector)) {
					observer.disconnect();
					resolve(document.querySelector(selector));
				}
			});
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
	}
	function watchUrlChange(callback) {
		let lastUrl = location.href;
		const fire = () => {
			if (location.href !== lastUrl) {
				lastUrl = location.href;
				callback(location.href);
			}
		};
		const origPush = history.pushState;
		history.pushState = function(...args) {
			origPush.apply(this, args);
			fire();
		};
		const origReplace = history.replaceState;
		history.replaceState = function(...args) {
			origReplace.apply(this, args);
			fire();
		};
		window.addEventListener("popstate", fire);
	}
	var style_default = "@media (prefers-color-scheme: dark) {\n}\n\n.settings {\n  z-index: 1000;\n  position: fixed;\n  right: 6rem;\n  bottom: 0.75rem;\n  height: 55px;\n  width: max-content;\n  background-color: rgba(35, 154, 239, 0.65);\n  box-shadow:\n    0 0 15px rgba(255, 255, 255, 0.2),\n    0 0 3px 1px rgba(255, 255, 255, 0.15);\n  outline: none;\n  border: 1px solid rgba(255, 255, 255, 0.3);\n  border-radius: 1rem;\n  color: white;\n  font-weight: 600;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  font-family: TwitterChirp;\n  backdrop-filter: blur(12px);\n  transition: opacity 0.1s ease-out;\n\n  &:hover {\n    opacity: 0.8;\n  }\n}\n\n.menu {\n  opacity: 0;\n  pointer-events: none;\n  z-index: 999;\n  position: fixed;\n  left: 50%;\n  top: 0;\n  transform: translateX(-50%);\n  width: 15rem;\n  height: max-content;\n  background-color: rgba(35, 154, 239, 0.65);\n  padding: 1rem;\n  border-radius: 1rem;\n  list-style: none;\n  backdrop-filter: blur(12px);\n  border: 1px solid rgba(255, 255, 255, 0.3);\n  font-family: TwitterChirp;\n  transition: opacity 0.15s ease-out;\n  display: flex;\n  flex-flow: column nowrap;\n  gap: 0.3rem;\n\n  h2 {\n    font-size: medium;\n    text-align: center;\n    font-weight: 800;\n    margin: 0;\n    margin-bottom: 0.5rem;\n    color: rgba(255, 255, 255, 0.8);\n  }\n\n  .nav-chunk {\n    padding: 0;\n    display: flex;\n    flex-flow: column nowrap;\n    gap: 0.3rem;\n\n    &:has(> li.chunk-title > input:checked) {\n      .indented {\n        display: none;\n      }\n    }\n\n    li {\n      display: flex;\n      flex-flow: row nowrap;\n      gap: 1rem;\n      justify-content: space-between;\n      user-select: none;\n      font-weight: 600;\n\n      &.chunk-title {\n        width: 100%;\n\n        label {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          margin: 0;\n          user-select: none;\n          cursor: pointer;\n        }\n        input {\n          display: none;\n        }\n        span {\n          margin-right: 5px;\n        }\n      }\n\n      &.indented {\n        margin-left: 1rem;\n      }\n\n      label {\n        font-weight: 400;\n        cursor: pointer;\n        width: 100%;\n      }\n      input {\n        cursor: pointer;\n      }\n    }\n  }\n\n  &.show {\n    opacity: 1;\n    pointer-events: all;\n  }\n}\n";
	var require_html = __commonJSMin(((exports) => {
		var ESCAPED_REGEX = /[<"'&]/;
		var CAMEL_REGEX = /[a-z][A-Z]/;
		function isUpper(input, index) {
			const code = input.charCodeAt(index);
			return code >= 65 && code <= 90;
		}
		function toKebabCase(camel) {
			if (!CAMEL_REGEX.test(camel)) return camel;
			const length = camel.length;
			let start = 0, end = 0, kebab = "", prev = true, curr = isUpper(camel, 0), next;
			for (; end < length; end++) {
				next = isUpper(camel, end + 1);
				if (!prev && curr && !next) {
					kebab += camel.slice(start, end) + "-" + camel[end].toLowerCase();
					start = end + 1;
				}
				prev = curr;
				curr = next;
			}
			kebab += camel.slice(start, end);
			return kebab;
		}
		function escape(strings, ...values) {
			const stringsLength = strings.length, valuesLength = values.length;
			let index = 0, result = "";
			for (; index < stringsLength; index++) {
				result += strings[index];
				if (index < valuesLength) result += values[index];
			}
			return escapeHtml(result);
		}
		var escapeHtml = function(value) {
			if (typeof value !== "string") value = value.toString();
			if (!ESCAPED_REGEX.test(value)) return value;
			const length = value.length;
			let escaped = "", start = 0, end = 0;
			for (; end < length; end++) switch (value[end]) {
				case "&":
					escaped += value.slice(start, end) + "&amp;";
					start = end + 1;
					continue;
				case "<":
					escaped += value.slice(start, end) + "&lt;";
					start = end + 1;
					continue;
				case "\"":
					escaped += value.slice(start, end) + "&#34;";
					start = end + 1;
					continue;
				case "'":
					escaped += value.slice(start, end) + "&#39;";
					start = end + 1;
					continue;
			}
			escaped += value.slice(start, end);
			return escaped;
		};
		if (typeof Bun !== "undefined") escapeHtml = Bun.escapeHTML;
		function isVoidElement(tag) {
			return tag === "meta" || tag === "link" || tag === "img" || tag === "br" || tag === "input" || tag === "hr" || tag === "area" || tag === "base" || tag === "col" || tag === "command" || tag === "embed" || tag === "keygen" || tag === "param" || tag === "source" || tag === "track" || tag === "wbr";
		}
		function styleToString(style) {
			if (typeof style === "string") {
				let end = style.indexOf("\"");
				if (end === -1) return style;
				const length = style.length;
				let escaped = "", start = 0;
				for (; end < length; end++) if (style[end] === "\"") {
					escaped += style.slice(start, end) + "&#34;";
					start = end + 1;
				}
				escaped += style.slice(start, end);
				return escaped;
			}
			const keys = Object.keys(style), length = keys.length;
			let key, value, end, start, index = 0, result = "";
			for (; index < length; index++) {
				key = keys[index];
				value = style[key];
				if (value === null || value === void 0) continue;
				result += toKebabCase(key) + ":";
				if (typeof value !== "string") {
					result += value.toString() + ";";
					continue;
				}
				end = value.indexOf("\"");
				if (end === -1) {
					result += value + ";";
					continue;
				}
				const length = value.length;
				start = 0;
				for (; end < length; end++) if (value[end] === "\"") {
					result += value.slice(start, end) + "&#34;";
					start = end + 1;
				}
				result += value.slice(start, end) + ";";
			}
			return result;
		}
		function attributesToString(attributes) {
			const keys = Object.keys(attributes);
			const length = keys.length;
			let key, value, type, end, start, classItems, valueLength, result = "", index = 0;
			for (; index < length; index++) {
				key = keys[index];
				if (key === "children" || key === "safe" || key === "of") continue;
				value = attributes[key];
				if (value === null || value === void 0) continue;
				if (key === "className") {
					if (attributes.class !== void 0) continue;
					key = "class";
				} else if (key === "class" && Array.isArray(value)) {
					classItems = value;
					valueLength = value.length;
					value = "";
					for (let i = 0; i < valueLength; i++) if (classItems[i] && classItems[i].length > 0) {
						if (value) value += " " + classItems[i].trim();
						else value += classItems[i].trim();
					}
					if (value.length === 0) continue;
				} else if (key === "style") {
					result += " style=\"" + styleToString(value) + "\"";
					continue;
				} else if (key === "attrs") {
					if (typeof value === "string") result += " " + value;
					else result += attributesToString(value);
					continue;
				}
				type = typeof value;
				if (type === "boolean") {
					if (value) result += " " + key;
					continue;
				}
				result += " " + key;
				if (type !== "string") {
					if (type !== "object") {
						result += "=\"" + value.toString() + "\"";
						continue;
					}
					if (value instanceof Date) {
						result += "=\"" + value.toISOString() + "\"";
						continue;
					}
					value = value.toString();
				}
				end = value.indexOf("\"");
				if (end === -1) {
					result += "=\"" + value + "\"";
					continue;
				}
				result += "=\"";
				valueLength = value.length;
				start = 0;
				for (; end < valueLength; end++) if (value[end] === "\"") {
					result += value.slice(start, end) + "&#34;";
					start = end + 1;
				}
				result += value.slice(start, end) + "\"";
			}
			return result;
		}
		function contentsToString(contents, escape) {
			let length = contents.length;
			let result = "";
			for (let index = 0; index < length; index++) {
				const content = contents[index];
				switch (typeof content) {
					case "string":
					case "number":
					case "bigint":
						result += content;
						continue;
					case "boolean": continue;
				}
				if (!content) continue;
				if (Array.isArray(content)) {
					contents.splice(index--, 1, ...content);
					length += content.length - 1;
					continue;
				}
				if (typeof content.then === "function") return Promise.all(contents.slice(index)).then(function resolveContents(resolved) {
					resolved.unshift(result);
					return contentsToString(resolved, escape);
				});
				throw new Error("Objects are not valid as a KitaJSX child");
			}
			if (escape === true) return escapeHtml(result);
			return result;
		}
		function contentToString(content, safe) {
			switch (typeof content) {
				case "string": return safe ? escapeHtml(content) : content;
				case "number":
				case "bigint": return content.toString();
				case "boolean": return "";
			}
			if (!content) return "";
			if (Array.isArray(content)) return contentsToString(content, safe);
			if (typeof content.then === "function") return content.then(function resolveContent(resolved) {
				return contentToString(resolved, safe);
			});
			throw new Error("Objects are not valid as a KitaJSX child");
		}
		function createElement(name, attrs, ...children) {
			const hasAttrs = attrs !== null;
			if (typeof name === "function") {
				if (!hasAttrs) return name({ children: children.length > 1 ? children : children[0] });
				attrs.children = children.length > 1 ? children : children[0];
				return name(attrs);
			}
			if (hasAttrs && name === "tag") name = attrs.of;
			const attributes = hasAttrs ? attributesToString(attrs) : "";
			if (children.length === 0) return isVoidElement(name) ? "<" + name + attributes + "/>" : "<" + name + attributes + "></" + name + ">";
			const contents = contentsToString(children, hasAttrs && attrs.safe);
			if (typeof contents === "string") return "<" + name + attributes + ">" + contents + "</" + name + ">";
			return contents.then(function resolveContents(contents) {
				return "<" + name + attributes + ">" + contents + "</" + name + ">";
			});
		}
		function Fragment(props) {
			return contentsToString([props.children]);
		}
		exports.escape = escape;
		exports.e = escape;
		exports.escapeHtml = escapeHtml;
		exports.isVoidElement = isVoidElement;
		exports.attributesToString = attributesToString;
		exports.toKebabCase = toKebabCase;
		exports.isUpper = isUpper;
		exports.styleToString = styleToString;
		exports.createElement = createElement;
		exports.h = createElement;
		exports.contentsToString = contentsToString;
		exports.contentToString = contentToString;
		exports.Fragment = Fragment;
		exports.Html = { ...exports };
	}));
	var import_jsx_runtime = __commonJSMin(((exports) => {
		var { Fragment, attributesToString, isVoidElement, contentsToString, contentToString } = require_html();
		function jsx(name, attrs) {
			if (typeof name === "function") return name(attrs);
			if (name === "tag") name = attrs.of;
			const attributes = attributesToString(attrs);
			if (attrs.children === void 0) return isVoidElement(name) ? "<" + name + attributes + "/>" : "<" + name + attributes + "></" + name + ">";
			const contents = contentToString(attrs.children, attrs.safe);
			if (contents instanceof Promise) return contents.then(function resolveContents(child) {
				return "<" + name + attributes + ">" + child + "</" + name + ">";
			});
			return "<" + name + attributes + ">" + contents + "</" + name + ">";
		}
		function jsxs(name, attrs) {
			if (typeof name === "function") return name(attrs);
			if (name === "tag") name = attrs.of;
			const attributes = attributesToString(attrs);
			if (attrs.children.length === 0) return isVoidElement(name) ? "<" + name + attributes + "/>" : "<" + name + attributes + "></" + name + ">";
			const contents = contentsToString(attrs.children, attrs.safe);
			if (contents instanceof Promise) return contents.then(function resolveContents(child) {
				return "<" + name + attributes + ">" + child + "</" + name + ">";
			});
			return "<" + name + attributes + ">" + contents + "</" + name + ">";
		}
		exports.jsx = jsx;
		exports.jsxs = jsxs;
	}))();
	var Settings = class {
		active = false;
		hideAds = false;
		sections = {
			expanded: false,
			hideRightColumn: false,
			hideLeftColumn: false,
			hideComposeBlock: false
		};
		timelines = {
			expanded: false,
			hideForYou: false,
			hideAdder: false
		};
		nav = {
			expanded: false,
			hideHome: false,
			hideExplore: false,
			hideNotifications: false,
			hideFollow: false,
			hideChat: false,
			hideGrok: false,
			hideHistory: false,
			hideStudio: false,
			hideProfile: false,
			hidePremium: false,
			hideMore: false
		};
		misc = {
			expanded: false,
			hidePostBtn: false,
			hideGrokBtn: false,
			hideChatBtn: false
		};
		updateStorage = async (e) => {
			const target = e.target;
			switch (target.id) {
				case "hideAds":
					await GM.setValue("hideAds", target.checked);
					location.reload();
					break;
				case "expandSectionSettings":
					await GM.setValue("expandSectionSettings", target.checked);
					break;
				case "hideRightColumn":
					await GM.setValue("hideRightColumn", target.checked);
					location.reload();
					break;
				case "hideLeftColumn":
					await GM.setValue("hideLeftColumn", target.checked);
					location.reload();
					break;
				case "hideComposeBlock":
					await GM.setValue("hideComposeBlock", target.checked);
					location.reload();
					break;
				case "expandTimelineSettings":
					await GM.setValue("expandTimelineSettings", target.checked);
					break;
				case "hideTimelineForYou":
					await GM.setValue("hideTimelineForYou", target.checked);
					location.reload();
					break;
				case "hideTimelineAdder":
					await GM.setValue("hideTimelineAdder", target.checked);
					location.reload();
					break;
				case "expandNavSettings":
					await GM.setValue("expandNavSettings", target.checked);
					break;
				case "hideNavHome":
					await GM.setValue("hideNavHome", target.checked);
					location.reload();
					break;
				case "hideNavExplore":
					await GM.setValue("hideNavExplore", target.checked);
					location.reload();
					break;
				case "hideNavNotifications":
					await GM.setValue("hideNavNotifications", target.checked);
					location.reload();
					break;
				case "hideNavFollow":
					await GM.setValue("hideNavFollow", target.checked);
					location.reload();
					break;
				case "hideNavChat":
					await GM.setValue("hideNavChat", target.checked);
					location.reload();
					break;
				case "hideNavGrok":
					await GM.setValue("hideNavGrok", target.checked);
					location.reload();
					break;
				case "hideNavHistory":
					await GM.setValue("hideNavHistory", target.checked);
					location.reload();
					break;
				case "hideNavStudio":
					await GM.setValue("hideNavStudio", target.checked);
					location.reload();
					break;
				case "hideNavPremium":
					await GM.setValue("hideNavPremium", target.checked);
					location.reload();
					break;
				case "hideNavProfile":
					await GM.setValue("hideNavProfile", target.checked);
					location.reload();
					break;
				case "hideNavMore":
					await GM.setValue("hideNavMore", target.checked);
					location.reload();
					break;
				case "expandMiscSettings":
					await GM.setValue("expandMiscSettings", target.checked);
					break;
				case "hidePostBtn":
					await GM.setValue("hidePostBtn", target.checked);
					location.reload();
					break;
				case "hideGrokBtn":
					await GM.setValue("hideGrokBtn", target.checked);
					location.reload();
					break;
				case "hideChatBtn":
					await GM.setValue("hideChatBtn", target.checked);
					location.reload();
			}
		};
		buildUI = async () => {
			const html = await waitForElement("html");
			if (!html) return;
			const settingsBtn = (0, import_jsx_runtime.jsx)("button", {
				class: "settings",
				children: "CleanX"
			});
			html.insertAdjacentHTML("beforeend", settingsBtn);
			GM.addStyle(style_default);
			const settingsMenu = (0, import_jsx_runtime.jsxs)("menu", {
				class: "menu",
				children: [
					(0, import_jsx_runtime.jsx)("h2", { children: "CleanX Settings" }),
					(0, import_jsx_runtime.jsx)("ul", {
						class: "nav-chunk",
						children: (0, import_jsx_runtime.jsxs)("li", { children: [(0, import_jsx_runtime.jsx)("label", {
							for: "hideAds",
							children: "Hide Ads"
						}), (0, import_jsx_runtime.jsx)("input", {
							id: "hideAds",
							type: "checkbox",
							checked: this.hideAds
						})] })
					}),
					(0, import_jsx_runtime.jsxs)("ul", {
						class: "nav-chunk",
						children: [
							(0, import_jsx_runtime.jsxs)("li", {
								class: "chunk-title",
								children: [(0, import_jsx_runtime.jsxs)("label", {
									for: "expandSectionSettings",
									children: ["Hide Sections ", (0, import_jsx_runtime.jsx)("span", { children: "⏷" })]
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "expandSectionSettings",
									type: "checkbox",
									checked: this.sections.expanded
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideLeftColumn",
									children: "Hide Left Column"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideLeftColumn",
									type: "checkbox",
									checked: this.sections.hideLeftColumn
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideRightColumn",
									children: "Hide Right Column"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideRightColumn",
									type: "checkbox",
									checked: this.sections.hideRightColumn
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideComposeBlock",
									children: "Hide Compose Block"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideComposeBlock",
									type: "checkbox",
									checked: this.sections.hideComposeBlock
								})]
							})
						]
					}),
					(0, import_jsx_runtime.jsxs)("ul", {
						class: "nav-chunk",
						children: [
							(0, import_jsx_runtime.jsxs)("li", {
								class: "chunk-title",
								children: [(0, import_jsx_runtime.jsxs)("label", {
									for: "expandTimelineSettings",
									children: ["Hide Timelines ", (0, import_jsx_runtime.jsx)("span", { children: "⏷" })]
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "expandTimelineSettings",
									type: "checkbox",
									checked: this.timelines.expanded
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideTimelineForYou",
									children: "For You"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideTimelineForYou",
									type: "checkbox",
									checked: this.timelines.hideForYou
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideTimelineAdder",
									children: "Adder"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideTimelineAdder",
									type: "checkbox",
									checked: this.timelines.hideAdder
								})]
							})
						]
					}),
					(0, import_jsx_runtime.jsxs)("ul", {
						class: "nav-chunk",
						children: [
							(0, import_jsx_runtime.jsxs)("li", {
								class: "chunk-title",
								children: [(0, import_jsx_runtime.jsxs)("label", {
									for: "expandNavSettings",
									children: ["Hide Nav Items ", (0, import_jsx_runtime.jsx)("span", { children: "⏷" })]
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "expandNavSettings",
									type: "checkbox",
									checked: this.nav.expanded
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideNavHome",
									children: "Home"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideNavHome",
									type: "checkbox",
									checked: this.nav.hideHome
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideNavExplore",
									children: "Explore"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideNavExplore",
									type: "checkbox",
									checked: this.nav.hideExplore
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideNavNotifications",
									children: "Notifications"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideNavNotifications",
									type: "checkbox",
									checked: this.nav.hideNotifications
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideNavFollow",
									children: "Follow"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideNavFollow",
									type: "checkbox",
									checked: this.nav.hideFollow
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideNavChat",
									children: "Chat"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideNavChat",
									type: "checkbox",
									checked: this.nav.hideChat
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideNavGrok",
									children: "Grok"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideNavGrok",
									type: "checkbox",
									checked: this.nav.hideGrok
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideNavHistory",
									children: "History"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideNavHistory",
									type: "checkbox",
									checked: this.nav.hideHistory
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideNavStudio",
									children: "Creator Studio"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideNavStudio",
									type: "checkbox",
									checked: this.nav.hideStudio
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideNavPremium",
									children: "Premium"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideNavPremium",
									type: "checkbox",
									checked: this.nav.hidePremium
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideNavProfile",
									children: "Profile"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideNavProfile",
									type: "checkbox",
									checked: this.nav.hideProfile
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideNavMore",
									children: "More"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideNavMore",
									type: "checkbox",
									checked: this.nav.hideMore
								})]
							})
						]
					}),
					(0, import_jsx_runtime.jsxs)("ul", {
						class: "nav-chunk",
						children: [
							(0, import_jsx_runtime.jsxs)("li", {
								class: "chunk-title",
								children: [(0, import_jsx_runtime.jsxs)("label", {
									for: "expandMiscSettings",
									children: ["Hide Misc. ", (0, import_jsx_runtime.jsx)("span", { children: "⏷" })]
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "expandMiscSettings",
									type: "checkbox",
									checked: this.misc.expanded
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hidePostBtn",
									children: "Post Button"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hidePostBtn",
									type: "checkbox",
									checked: this.misc.hidePostBtn
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideGrokBtn",
									children: "Grok Button"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideGrokBtn",
									type: "checkbox",
									checked: this.misc.hideGrokBtn
								})]
							}),
							(0, import_jsx_runtime.jsxs)("li", {
								class: "indented",
								children: [(0, import_jsx_runtime.jsx)("label", {
									for: "hideChatBtn",
									children: "Chat Button"
								}), (0, import_jsx_runtime.jsx)("input", {
									id: "hideChatBtn",
									type: "checkbox",
									checked: this.misc.hideChatBtn
								})]
							})
						]
					})
				]
			});
			html.insertAdjacentHTML("beforeend", settingsMenu);
			GM.addStyle(style_default);
			const settingsBtnEl = document.querySelector(".settings");
			const settingsMenuEl = document.querySelector(".menu");
			if (this.active) settingsMenuEl?.classList.add("show");
			settingsBtnEl?.addEventListener("click", async () => {
				this.active = !this.active;
				if (this.active) {
					settingsMenuEl?.classList.add("show");
					await GM.setValue("showMenu", true);
				} else {
					settingsMenuEl?.classList.remove("show");
					await GM.setValue("showMenu", false);
				}
			});
			settingsMenuEl?.addEventListener("change", async (e) => {
				this.updateStorage(e);
			});
		};
		init = async () => {
			this.active = await GM.getValue("showMenu", this.active);
			this.hideAds = await GM.getValue("hideAds", this.hideAds);
			this.sections.expanded = await GM.getValue("expandSectionSettings", this.sections.expanded);
			this.sections.hideRightColumn = await GM.getValue("hideRightColumn", this.sections.hideRightColumn);
			this.sections.hideLeftColumn = await GM.getValue("hideLeftColumn", this.sections.hideLeftColumn);
			this.sections.hideComposeBlock = await GM.getValue("hideComposeBlock", this.sections.hideComposeBlock);
			this.timelines.expanded = await GM.getValue("expandTimelineSettings", this.timelines.expanded);
			this.timelines.hideForYou = await GM.getValue("hideTimelineForYou", this.timelines.hideForYou);
			this.timelines.hideAdder = await GM.getValue("hideTimelineAdder", this.timelines.hideAdder);
			this.nav.expanded = await GM.getValue("expandNavSettings", this.nav.expanded);
			this.nav.hideHome = await GM.getValue("hideNavHome", this.nav.hideHome);
			this.nav.hideExplore = await GM.getValue("hideNavExplore", this.nav.hideExplore);
			this.nav.hideNotifications = await GM.getValue("hideNavNotifications", this.nav.hideNotifications);
			this.nav.hideFollow = await GM.getValue("hideNavFollow", this.nav.hideFollow);
			this.nav.hideChat = await GM.getValue("hideNavChat", this.nav.hideChat);
			this.nav.hideGrok = await GM.getValue("hideNavGrok", this.nav.hideGrok);
			this.nav.hideHistory = await GM.getValue("hideNavHistory", this.nav.hideHistory);
			this.nav.hideStudio = await GM.getValue("hideNavStudio", this.nav.hideStudio);
			this.nav.hidePremium = await GM.getValue("hideNavPremium", this.nav.hidePremium);
			this.nav.hideProfile = await GM.getValue("hideNavProfile", this.nav.hideProfile);
			this.nav.hideMore = await GM.getValue("hideNavMore", this.nav.hideMore);
			this.misc.expanded = await GM.getValue("expandMiscSettings", this.misc.expanded);
			this.misc.hidePostBtn = await GM.getValue("hidePostBtn", this.misc.hidePostBtn);
			this.misc.hideGrokBtn = await GM.getValue("hideGrokBtn", this.misc.hideGrokBtn);
			this.misc.hideChatBtn = await GM.getValue("hideChatBtn", this.misc.hideChatBtn);
			await this.buildUI();
		};
	};
	var selectors = {
		article: "main article",
		ad: "main article > div > div > div:nth-child(2) > div:nth-child(2) > div:first-child > div > div:nth-child(2) > div > div:first-child > span",
		rightColumn: "main div[data-testid=\"sidebarColumn\"]",
		primaryColumn: "main div[data-testid=\"primaryColumn\"]",
		leftColumn: "header[role=\"banner\"]",
		main: "main",
		composeBlock: "main div[aria-label=\"Home timeline\"] > div:nth-child(3)",
		timelineForYou: "main div[aria-label=\"Home timeline\"] > div:nth-child(1) nav div[role=\"tablist\"] > div:first-child",
		timelineFollowing: "main div[aria-label=\"Home timeline\"] > div:nth-child(1) nav div[role=\"tablist\"] > div:nth-child(2) > div:first-child",
		timelineAdder: "main div[aria-label=\"Home timeline\"] > div:nth-child(1) button[aria-label=\"Manage timelines\"]",
		navItem: "header nav[aria-label=\"Primary\"] a",
		navItemMore: "button[data-testid=\"AppTabBar_More_Menu",
		postButton: "header a[aria-label=\"Post\"]",
		grokButton: "#react-root > div > div > div#layers > div > div:first-child",
		chatButton: "#react-root > div > div > div#layers > div > div:nth-child(2)"
	};
	var clean = (settings) => {
		Object.keys(selectors).forEach((key) => {
			const selectorKey = key;
			const selector = selectors[key];
			const elements = document.querySelectorAll(selector);
			for (const el of elements) {
				if (!(el instanceof HTMLElement)) continue;
				switch (selectorKey) {
					case "article":
						if (settings.hideAds) {
							if (el.querySelector(selectors.ad)?.innerText.toLowerCase() === "ad") hide(el);
						}
						break;
					case "rightColumn":
						if (settings.sections.hideRightColumn) hide(el);
						break;
					case "primaryColumn":
						if (settings.sections.hideRightColumn) el.style.setProperty("max-width", "100%", "important");
						break;
					case "leftColumn":
						if (settings.sections.hideLeftColumn) hide(el);
						break;
					case "main":
						if (settings.sections.hideLeftColumn) el.style.setProperty("align-items", "center", "important");
						break;
					case "composeBlock":
						if (settings.sections.hideComposeBlock) hide(el);
						break;
					case "timelineForYou":
						if (settings.timelines.hideForYou) hide(el);
						break;
					case "timelineFollowing":
						if (settings.timelines.hideForYou && el.ariaSelected === "false") el.click();
						break;
					case "timelineAdder":
						if (settings.timelines.hideAdder) hide(el);
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
					case "chatButton": if (settings.misc.hideChatBtn) hide(el);
				}
			}
		});
	};
	var cb = (mutations, settings) => {
		for (const mutation of mutations) for (const node of mutation.addedNodes) if (node.nodeType === Node.ELEMENT_NODE) clean(settings);
	};
	document.addEventListener("DOMContentLoaded", async () => {
		const settings = new Settings();
		await settings.init();
		watchUrlChange((url) => {
			if (url.includes("https://x.com/home")) clean(settings);
		});
		clean(settings);
		new MutationObserver((m) => cb(m, settings)).observe(document.body, {
			childList: true,
			subtree: true
		});
	});
})();
