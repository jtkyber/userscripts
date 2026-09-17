import { waitForElement } from "./utils";
import styles from "./style.css?raw";

export default class Settings {
  private active: boolean = false;
  hideAds: boolean = false;
  sections: {
    expanded: boolean;
    hideRightColumn: boolean;
    hideLeftColumn: boolean;
    hideComposeBlock: boolean;
  } = {
    expanded: false,
    hideRightColumn: false,
    hideLeftColumn: false,
    hideComposeBlock: false,
  };

  timelines: {
    expanded: boolean;
    hideForYou: boolean;
    hideAdder: boolean;
  } = {
    expanded: false,
    hideForYou: false,
    hideAdder: false,
  };

  nav: {
    expanded: boolean;
    hideHome: boolean;
    hideExplore: boolean;
    hideNotifications: boolean;
    hideFollow: boolean;
    hideChat: boolean;
    hideGrok: boolean;
    hideHistory: boolean;
    hideStudio: boolean;
    hidePremium: boolean;
    hideProfile: boolean;
    hideMore: boolean;
  } = {
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
    hideMore: false,
  };

  misc: {
    expanded: boolean;
    hidePostBtn: boolean;
    hideGrokBtn: boolean;
    hideChatBtn: boolean;
  } = {
    expanded: false,
    hidePostBtn: false,
    hideGrokBtn: false,
    hideChatBtn: false,
  };

  private updateStorage = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const id = target.id;

    switch (id) {
      // Ads
      case "hideAds":
        await GM.setValue("hideAds", target.checked);
        location.reload();
        break;
      // Sections
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
      // Timelines
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
      // Nav
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
      // Misc
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
        break;
    }
  };

  private buildUI = async () => {
    const html = await waitForElement("html");
    if (!html) return;

    // Add CleanX button
    const settingsBtn: JSX.Element = (
      <button class="settings">CleanX</button>
    ) as string;
    html.insertAdjacentHTML("beforeend", settingsBtn);
    GM.addStyle(styles);

    // Add CleanX menu
    const settingsMenu: JSX.Element = (
      <menu class="menu">
        <h2>CleanX Settings</h2>

        {/* Ads */}
        <ul class="nav-chunk">
          <li>
            <label for="hideAds">Hide Ads</label>
            <input id="hideAds" type="checkbox" checked={this.hideAds} />
          </li>
        </ul>

        {/* Section */}
        <ul class="nav-chunk">
          <li class="chunk-title">
            <label for="expandSectionSettings">
              Hide Sections <span>⏷</span>
            </label>
            <input
              id="expandSectionSettings"
              type="checkbox"
              checked={this.sections.expanded}
            />
          </li>

          <li class="indented">
            <label for="hideLeftColumn">Hide Left Column</label>
            <input
              id="hideLeftColumn"
              type="checkbox"
              checked={this.sections.hideLeftColumn}
            />
          </li>
          <li class="indented">
            <label for="hideRightColumn">Hide Right Column</label>
            <input
              id="hideRightColumn"
              type="checkbox"
              checked={this.sections.hideRightColumn}
            />
          </li>
          <li class="indented">
            <label for="hideComposeBlock">Hide Compose Block</label>
            <input
              id="hideComposeBlock"
              type="checkbox"
              checked={this.sections.hideComposeBlock}
            />
          </li>
        </ul>

        {/* Timelines */}
        <ul class="nav-chunk">
          <li class="chunk-title">
            <label for="expandTimelineSettings">
              Hide Timelines <span>⏷</span>
            </label>
            <input
              id="expandTimelineSettings"
              type="checkbox"
              checked={this.timelines.expanded}
            />
          </li>

          <li class="indented">
            <label for="hideTimelineForYou">For You</label>
            <input
              id="hideTimelineForYou"
              type="checkbox"
              checked={this.timelines.hideForYou}
            />
          </li>
          <li class="indented">
            <label for="hideTimelineAdder">Adder</label>
            <input
              id="hideTimelineAdder"
              type="checkbox"
              checked={this.timelines.hideAdder}
            />
          </li>
        </ul>

        {/* Nav */}
        <ul class="nav-chunk">
          <li class="chunk-title">
            <label for="expandNavSettings">
              Hide Nav Items <span>⏷</span>
            </label>
            <input
              id="expandNavSettings"
              type="checkbox"
              checked={this.nav.expanded}
            />
          </li>

          <li class="indented">
            <label for="hideNavHome">Home</label>
            <input
              id="hideNavHome"
              type="checkbox"
              checked={this.nav.hideHome}
            />
          </li>
          <li class="indented">
            <label for="hideNavExplore">Explore</label>
            <input
              id="hideNavExplore"
              type="checkbox"
              checked={this.nav.hideExplore}
            />
          </li>
          <li class="indented">
            <label for="hideNavNotifications">Notifications</label>
            <input
              id="hideNavNotifications"
              type="checkbox"
              checked={this.nav.hideNotifications}
            />
          </li>
          <li class="indented">
            <label for="hideNavFollow">Follow</label>
            <input
              id="hideNavFollow"
              type="checkbox"
              checked={this.nav.hideFollow}
            />
          </li>
          <li class="indented">
            <label for="hideNavChat">Chat</label>
            <input
              id="hideNavChat"
              type="checkbox"
              checked={this.nav.hideChat}
            />
          </li>
          <li class="indented">
            <label for="hideNavGrok">Grok</label>
            <input
              id="hideNavGrok"
              type="checkbox"
              checked={this.nav.hideGrok}
            />
          </li>
          <li class="indented">
            <label for="hideNavHistory">History</label>
            <input
              id="hideNavHistory"
              type="checkbox"
              checked={this.nav.hideHistory}
            />
          </li>
          <li class="indented">
            <label for="hideNavStudio">Creator Studio</label>
            <input
              id="hideNavStudio"
              type="checkbox"
              checked={this.nav.hideStudio}
            />
          </li>
          <li class="indented">
            <label for="hideNavPremium">Premium</label>
            <input
              id="hideNavPremium"
              type="checkbox"
              checked={this.nav.hidePremium}
            />
          </li>
          <li class="indented">
            <label for="hideNavProfile">Profile</label>
            <input
              id="hideNavProfile"
              type="checkbox"
              checked={this.nav.hideProfile}
            />
          </li>
          <li class="indented">
            <label for="hideNavMore">More</label>
            <input
              id="hideNavMore"
              type="checkbox"
              checked={this.nav.hideMore}
            />
          </li>
        </ul>

        {/* Misc */}
        <ul class="nav-chunk">
          <li class="chunk-title">
            <label for="expandMiscSettings">
              Hide Misc. <span>⏷</span>
            </label>
            <input
              id="expandMiscSettings"
              type="checkbox"
              checked={this.misc.expanded}
            />
          </li>

          <li class="indented">
            <label for="hidePostBtn">Post Button</label>
            <input
              id="hidePostBtn"
              type="checkbox"
              checked={this.misc.hidePostBtn}
            />
          </li>
          <li class="indented">
            <label for="hideGrokBtn">Grok Button</label>
            <input
              id="hideGrokBtn"
              type="checkbox"
              checked={this.misc.hideGrokBtn}
            />
          </li>
          <li class="indented">
            <label for="hideChatBtn">Chat Button</label>
            <input
              id="hideChatBtn"
              type="checkbox"
              checked={this.misc.hideChatBtn}
            />
          </li>
        </ul>
      </menu>
    ) as string;
    html.insertAdjacentHTML("beforeend", settingsMenu);
    GM.addStyle(styles);

    const settingsBtnEl = document.querySelector(".settings") as HTMLElement;
    const settingsMenuEl = document.querySelector(".menu");
    if (this.active) settingsMenuEl?.classList.add("show");

    // Handle CleanX button click
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
    // Set properties from storage
    this.active = await GM.getValue<boolean>("showMenu", this.active);

    // Ads
    this.hideAds = await GM.getValue<boolean>("hideAds", this.hideAds);

    // Sections
    this.sections.expanded = await GM.getValue<boolean>(
      "expandSectionSettings",
      this.sections.expanded,
    );
    this.sections.hideRightColumn = await GM.getValue<boolean>(
      "hideRightColumn",
      this.sections.hideRightColumn,
    );
    this.sections.hideLeftColumn = await GM.getValue<boolean>(
      "hideLeftColumn",
      this.sections.hideLeftColumn,
    );
    this.sections.hideComposeBlock = await GM.getValue<boolean>(
      "hideComposeBlock",
      this.sections.hideComposeBlock,
    );

    // Timelines
    this.timelines.expanded = await GM.getValue<boolean>(
      "expandTimelineSettings",
      this.timelines.expanded,
    );
    this.timelines.hideForYou = await GM.getValue<boolean>(
      "hideTimelineForYou",
      this.timelines.hideForYou,
    );
    this.timelines.hideAdder = await GM.getValue<boolean>(
      "hideTimelineAdder",
      this.timelines.hideAdder,
    );
    // Nav
    this.nav.expanded = await GM.getValue<boolean>(
      "expandNavSettings",
      this.nav.expanded,
    );
    this.nav.hideHome = await GM.getValue<boolean>(
      "hideNavHome",
      this.nav.hideHome,
    );
    this.nav.hideExplore = await GM.getValue<boolean>(
      "hideNavExplore",
      this.nav.hideExplore,
    );
    this.nav.hideNotifications = await GM.getValue<boolean>(
      "hideNavNotifications",
      this.nav.hideNotifications,
    );
    this.nav.hideFollow = await GM.getValue<boolean>(
      "hideNavFollow",
      this.nav.hideFollow,
    );
    this.nav.hideChat = await GM.getValue<boolean>(
      "hideNavChat",
      this.nav.hideChat,
    );
    this.nav.hideGrok = await GM.getValue<boolean>(
      "hideNavGrok",
      this.nav.hideGrok,
    );
    this.nav.hideHistory = await GM.getValue<boolean>(
      "hideNavHistory",
      this.nav.hideHistory,
    );
    this.nav.hideStudio = await GM.getValue<boolean>(
      "hideNavStudio",
      this.nav.hideStudio,
    );
    this.nav.hidePremium = await GM.getValue<boolean>(
      "hideNavPremium",
      this.nav.hidePremium,
    );
    this.nav.hideProfile = await GM.getValue<boolean>(
      "hideNavProfile",
      this.nav.hideProfile,
    );
    this.nav.hideMore = await GM.getValue<boolean>(
      "hideNavMore",
      this.nav.hideMore,
    );
    // Misc
    this.misc.expanded = await GM.getValue<boolean>(
      "expandMiscSettings",
      this.misc.expanded,
    );
    this.misc.hidePostBtn = await GM.getValue<boolean>(
      "hidePostBtn",
      this.misc.hidePostBtn,
    );
    this.misc.hideGrokBtn = await GM.getValue<boolean>(
      "hideGrokBtn",
      this.misc.hideGrokBtn,
    );
    this.misc.hideChatBtn = await GM.getValue<boolean>(
      "hideChatBtn",
      this.misc.hideChatBtn,
    );

    await this.buildUI();
  };
}
