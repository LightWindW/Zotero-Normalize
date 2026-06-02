import { getString, initLocale } from "./utils/locale";
import { registerPrefsScripts } from "./modules/preferenceScript";
import { createZToolkit } from "./utils/ztoolkit";

import { UIRMenu } from "./modules/Rmenu/UIRMenu";
import { dialogInput } from "./modules/Rmenu/dialogInput";
import { dialogOneLine } from "./modules/Rmenu/dialogOneLine";
// // 在 onMainWindowLoad 中添加
// import { initChineseNameDisplay } from "./modules/methods/Creator-zh-css";
// // 在 onMainWindowUnload 中添加清理
// import { stopChineseNameDisplay } from "./modules/methods/Creator-zh-css";

async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);

  initLocale();

  await Promise.all(
    Zotero.getMainWindows().map((win) => onMainWindowLoad(win)),
  );

  // Mark initialized as true to confirm plugin loading status
  // outside of the plugin (e.g. scaffold testing process)
  addon.data.initialized = true;
}

async function onMainWindowLoad(win: _ZoteroTypes.MainWindow): Promise<void> {
  // Create ztoolkit for every window
  addon.data.ztoolkit = createZToolkit();

  win.MozXULElement.insertFTLIfNeeded(
    `${addon.data.config.addonRef}-mainWindow.ftl`,
  );

  UIRMenu.registerRightClickMenuPopup(win);
}

async function onMainWindowUnload(win: Window): Promise<void> {
  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
}

function onShutdown(): void {
  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
  // Unregister MenuManager menu
  Zotero.MenuManager.unregisterMenu(
    `${addon.data.config.addonRef}-context-menu`,
  );
  // Remove addon object
  addon.data.alive = false;
  // @ts-expect-error - Plugin instance is not typed
  delete Zotero[addon.data.config.addonInstance];
}

async function onPrefsEvent(type: string, data: { [key: string]: any }) {
  switch (type) {
    case "load":
      registerPrefsScripts(data.window);
      break;
    default:
      return;
  }
}

function dialogCreatorInput(type: string) {
  switch (type) {
    case "dialogInput":
      dialogInput();
      break;
    case "dialogOneLine":
      dialogOneLine();
      break;
  }
}

export default {
  onStartup,
  onShutdown,
  onMainWindowLoad,
  onMainWindowUnload,
  onPrefsEvent,
  dialogCreatorInput,
};
