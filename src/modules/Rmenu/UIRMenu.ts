import { getString } from "../../utils/locale";
import { SwitchFLName } from "../methods/Creator-name-switch";
import { separateNameEn } from "../methods/Creator-name-separate-en";
import { mergeNameEn } from "../methods/Creator-name-merge-en";
import { separateNameZh } from "../methods/Creator-name-separate-zh";
import { mergeNameZh } from "../methods/Creator-name-merge-zh";
import { CreatorOneLine } from "../methods/Creator-one-line";
import { CreatorHyphen } from "../methods/Creator-hyphen";
import { CreatorInput } from "../methods/Creator-input";
import { DateISO } from "../methods/Date-ISO";
import { ExtraClean } from "../methods/Extra-clean";
import { LanguageInput } from "../methods/Language-input";
import { RMenu } from "./RMenu";
import { dialogInput } from "./dialogInput";
import { dialogOneLine } from "./dialogOneLine";
import { dialogLanguage } from "./dialogLanguage";
import { dialogHelp } from "./dialogHelp";

export class UIRMenu {
  // @RMenu
  // static registerStyleSheet(win: _ZoteroTypes.MainWindow) {
  //   const doc = win.document;
  //   const styles = ztoolkit.UI.createElement(doc, "link", {
  //     properties: {
  //       type: "text/css",
  //       rel: "stylesheet",
  //       href: `chrome://${addon.data.config.addonRef}/content/zoteroPane.css`,
  //     },
  //   });
  //   doc.documentElement?.appendChild(styles);
  //   doc.getElementById("zotero-item-pane-content")?.classList.add("makeItRed");
  // }

  // @RMenu
  // static registerRightClickMenuItem() {
  //   const menuIcon = `chrome://${addon.data.config.addonRef}/content/icons/favicon@0.5x.png`;
  //   // item menuitem with icon
  //   ztoolkit.Menu.register("item", {
  //     tag: "menuitem",
  //     id: "zotero-itemmenu-addontemplate-test",
  //     label: getString("menuitem-label"),
  //     commandListener: (ev) => addon.hooks.onDialogEvents("dialogExample"),
  //     icon: menuIcon,
  //   });
  // }

  @RMenu
  static registerRightClickMenuPopup(_win: Window) {
    const menuIcon = `${rootURI}/content/icons/favicon.png`;
    const menuIconsepmerge = `${rootURI}/content/icons/sepMerge.png`;
    const menuIconswitchFL = `${rootURI}/content/icons/switchFL.png`;
    const menuIconOneLine = `${rootURI}/content/icons/oneLine.png`;
    const menuIconhyphen = `${rootURI}/content/icons/hyphen.png`;
    const menuIconinput = `${rootURI}/content/icons/input.png`;

    const menuID = `${addon.data.config.addonRef}-context-menu`;

    Zotero.MenuManager.registerMenu({
      menuID,
      pluginID: addon.data.config.addonID,
      target: "main/library/item",
      menus: [
        {
          menuType: "submenu",
          icon: menuIcon,
          onShowing: (event, context) => {
            context.menuElem.setAttribute(
              "label",
              getString("menupopup-label"),
            );
          },
          menus: [
            {
              menuType: "submenu",
              onShowing: (event, context) => {
                context.menuElem.setAttribute(
                  "label",
                  getString("menuitem-submenulabel-1"),
                );
              },
              menus: [
                {
                  menuType: "submenu",
                  icon: menuIconsepmerge,
                  onShowing: (event, context) => {
                    context.menuElem.setAttribute(
                      "label",
                      getString("menuitem-submenulabel-1-1"),
                    );
                  },
                  menus: [
                    {
                      menuType: "menuitem",
                      onShowing: (event, context) => {
                        context.menuElem.setAttribute(
                          "label",
                          getString("menuitem-submenulabel-1-1-1"),
                        );
                      },
                      onCommand: () => mergeNameZh(),
                    },
                    {
                      menuType: "menuitem",
                      onShowing: (event, context) => {
                        context.menuElem.setAttribute(
                          "label",
                          getString("menuitem-submenulabel-1-1-2"),
                        );
                      },
                      onCommand: () => separateNameZh(),
                    },
                    {
                      menuType: "separator",
                    },
                    {
                      menuType: "menuitem",
                      onShowing: (event, context) => {
                        context.menuElem.setAttribute(
                          "label",
                          getString("menuitem-submenulabel-1-1-3"),
                        );
                      },
                      onCommand: () => mergeNameEn(),
                    },
                    {
                      menuType: "menuitem",
                      onShowing: (event, context) => {
                        context.menuElem.setAttribute(
                          "label",
                          getString("menuitem-submenulabel-1-1-4"),
                        );
                      },
                      onCommand: () => separateNameEn(),
                    },
                  ],
                },
                {
                  menuType: "menuitem",
                  icon: menuIconswitchFL,
                  onShowing: (event, context) => {
                    context.menuElem.setAttribute(
                      "label",
                      getString("menuitem-submenulabel-1-2"),
                    );
                  },
                  onCommand: () => SwitchFLName(),
                },
                {
                  menuType: "menuitem",
                  icon: menuIconOneLine,
                  onShowing: (event, context) => {
                    context.menuElem.setAttribute(
                      "label",
                      getString("menuitem-submenulabel-1-3"),
                    );
                  },
                  onCommand: async () => {
                    const result = await dialogOneLine();
                    if (result) {
                      await CreatorOneLine(
                        result.separatorType,
                        result.columnType,
                        result.inputValue,
                      );
                    }
                  },
                },
                {
                  menuType: "menuitem",
                  icon: menuIconhyphen,
                  onShowing: (event, context) => {
                    context.menuElem.setAttribute(
                      "label",
                      getString("menuitem-submenulabel-1-4"),
                    );
                  },
                  onCommand: () => CreatorHyphen(),
                },
                {
                  menuType: "separator",
                },
                {
                  menuType: "menuitem",
                  icon: menuIconinput,
                  onShowing: (event, context) => {
                    context.menuElem.setAttribute(
                      "label",
                      getString("menuitem-submenulabel-1-5"),
                    );
                  },
                  onCommand: async () => {
                    const result = await dialogInput();
                    if (result) {
                      await CreatorInput(
                        result.columnType,
                        result.languageType,
                        result.inputValue,
                      );
                    }
                  },
                },
              ],
            },
            {
              menuType: "menuitem",
              onShowing: (event, context) => {
                context.menuElem.setAttribute(
                  "label",
                  getString("menuitem-submenulabel-2"),
                );
              },
              onCommand: () => DateISO(),
            },
            {
              menuType: "menuitem",
              onShowing: (event, context) => {
                context.menuElem.setAttribute(
                  "label",
                  getString("menuitem-submenulabel-3"),
                );
              },
              onCommand: async () => {
                const result = await dialogLanguage();
                if (result) {
                  await LanguageInput(result.languageType, result.inputValue);
                }
              },
            },
            {
              menuType: "menuitem",
              onShowing: (event, context) => {
                context.menuElem.setAttribute(
                  "label",
                  getString("menuitem-submenulabel-4"),
                );
              },
              onCommand: () => ExtraClean(),
            },
            {
              menuType: "separator",
            },
            {
              menuType: "menuitem",
              onShowing: (event, context) => {
                context.menuElem.setAttribute(
                  "label",
                  getString("menuitem-submenulabel-5"),
                );
              },
              onCommand: async () => {
                await dialogHelp();
              },
            },
          ],
        },
      ],
    });
  }
}
