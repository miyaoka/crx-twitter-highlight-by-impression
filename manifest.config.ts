import { defineManifest } from "@crxjs/vite-plugin";
import { version } from "./package.json";

export default defineManifest(() => {
  return {
    manifest_version: 3,
    version,
    default_locale: "en",
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    icons: {
      "16": "icons/icon.png",
      "48": "icons/icon.png",
      "128": "icons/icon.png",
    },
    action: {
      default_popup: "popup.html",
    },
    content_scripts: [
      {
        matches: ["http://*/*", "https://*/*"],
        js: ["./src/content-scripts/main.ts"],
      },
    ],
  };
});
