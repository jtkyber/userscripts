import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "CleanX",
        match: ["https://x.com/*"],
        downloadURL:
          "https://raw.githubusercontent.com/jtkyber/userscripts/cleanx/main/dist/cleanx.user.js",
        updateURL:
          "https://raw.githubusercontent.com/jtkyber/userscripts/cleanx/main/dist/cleanx.user.js",
        grant: ["GM.getValue", "GM.setValue", "GM.registerMenuCommand"],
      },
    }),
  ],
});
