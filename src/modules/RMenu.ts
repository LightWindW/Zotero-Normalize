import { getLocaleID, getString } from "../utils/locale";
import type { MenuitemOptions } from "zotero-plugin-toolkit";
// import { isRegularItem } from "../utils/zotero";
import { SwitchFLName } from "./methods/Creator-name-switch";
import { separateNameEn } from "./methods/Creator-name-separate-en";
import { mergeNameEn } from "./methods/Creator-name-merge-en";
import { separateNameZh } from "./methods/Creator-name-separate-zh";
import { mergeNameZh } from "./methods/Creator-name-merge-zh";
import { CreatorOneLine } from "./methods/Creator-one-line";
import { CreatorHyphen } from "./methods/Creator-hyphen";
import { CreatorInput } from "./methods/Creator-input";
import { DateISO } from "./methods/Date-ISO";
import { ExtraClean } from "./methods/Extra-clean";
import { LanguageInput } from "./methods/Language-input";

//
export function RMenu(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) {
  // const menuIcon = `${rootURI}/content/icons/favicon.png`;
  function getMenuItem(menuPopup: string) {}

  const original = descriptor.value;
  descriptor.value = function (...args: any) {
    try {
      ztoolkit.log(`Calling example ${target.name}.${String(propertyKey)}`);
      return original.apply(this, args);
    } catch (e) {
      ztoolkit.log(`Error in example ${target.name}.${String(propertyKey)}`, e);
      throw e;
    }
  };
  return descriptor;
}

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
  static registerRightClickMenuPopup(win: Window) {
    //registerRightClickMenuPopup是自己取的名字
    const menuIcon = `${rootURI}/content/icons/favicon.png`;
    const menuIconsepmerge = `${rootURI}/content/icons/sepMerge.png`;
    const menuIconswitchFL = `${rootURI}/content/icons/switchFL.png`;
    const menuIconOneLine = `${rootURI}/content/icons/oneLine.png`;
    const menuIconhyphen = `${rootURI}/content/icons/hyphen.png`;
    const menuIconinput = `${rootURI}/content/icons/input.png`;
    ztoolkit.Menu.register(
      "item", //目标菜单id
      {
        tag: "menu",
        label: getString("menupopup-label"), //菜单上标签显示
        icon: menuIcon,
        children: [
          //子菜单
          {
            //第一个子菜单
            tag: "menu",
            label: getString("menuitem-submenulabel-1"), //子菜单标签显示的文字

            children: [
              //子菜单的子菜单
              {
                tag: "menu",
                label: getString("menuitem-submenulabel-1-1"), //子菜单的子菜单标签显示的文字
                icon: menuIconsepmerge,
                children: [
                  {
                    tag: "menuitem",
                    label: getString("menuitem-submenulabel-1-1-1"),
                    commandListener: mergeNameZh,
                  },
                  {
                    tag: "menuitem",
                    label: getString("menuitem-submenulabel-1-1-2"),
                    commandListener: separateNameZh,
                  },
                  {
                    tag: "menuseparator",
                  },
                  {
                    tag: "menuitem",
                    label: getString("menuitem-submenulabel-1-1-3"),
                    commandListener: mergeNameEn,
                  },
                  {
                    tag: "menuitem",
                    label: getString("menuitem-submenulabel-1-1-4"),
                    commandListener: separateNameEn,
                  },
                ],
              },
              {
                tag: "menuitem",
                label: getString("menuitem-submenulabel-1-2"),
                commandListener: SwitchFLName,
                icon: menuIconswitchFL,
              },
              {
                tag: "menuitem",
                label: getString("menuitem-submenulabel-1-3"),
                commandListener: async (ev) => {
                  const result = await InputFactory.dialogOneLine();
                  if (result) {
                    await CreatorOneLine(
                      result.separatorType,
                      result.columnType,
                      result.inputValue,
                    );
                  }
                },
                icon: menuIconOneLine,
              },
              {
                tag: "menuitem",
                label: getString("menuitem-submenulabel-1-4"),
                commandListener: CreatorHyphen,
                icon: menuIconhyphen,
              },
              {
                tag: "menuseparator",
              },
              {
                tag: "menuitem",
                label: getString("menuitem-submenulabel-1-5"),
                commandListener: async (ev) => {
                  const result = await InputFactory.dialogInput();
                  if (result) {
                    await CreatorInput(
                      result.columnType,
                      result.languageType,
                      result.inputValue,
                    );
                  }
                },

                icon: menuIconinput,
              },
            ],
          },
          {
            tag: "menuitem",
            label: getString("menuitem-submenulabel-2"),
            commandListener: DateISO, // 更新 Date 字段
          },

          {
            tag: "menuitem",
            label: getString("menuitem-submenulabel-3"),
            commandListener: async (ev) => {
              const result = await InputFactory.dialoglanguage();
              if (result) {
                await LanguageInput(result.languageType, result.inputValue);
              }
            },
          },

          {
            tag: "menuitem",
            label: getString("menuitem-submenulabel-4"),
            commandListener: ExtraClean, // 清空 Extra 字段
          },
          {
            tag: "menuseparator",
          },
          {
            tag: "menuitem",
            label: getString("menuitem-submenulabel-5"),
            commandListener: async (ev) => {
              await InputFactory.dialoghelp();
            },
          },
        ],
      },

      //这个会强制在itemmenu-addontemplate-test前面，需要注释
      // "before",
      // win.document?.querySelector(
      //   "#zotero-itemmenu-addontemplate-test",
      // ) as XUL.MenuItem,
    );
  }
}

export class InputFactory {
  @RMenu
  static async dialogInput() {
    const dialogData: { [key: string | number]: any } = {
      // inputValue: "test",
      columnType: "double",
      languageType: "2",
      // checkboxValue: true,
      loadCallback: () => {
        ztoolkit.log(dialogData, "Dialog Opened!");
      },
      unloadCallback: () => {
        ztoolkit.log(dialogData, "Dialog closed!");
      },
    };
    const dialogHelper = new ztoolkit.Dialog(10, 2)
      .addCell(0, 0, {
        tag: "h2",
        properties: { innerHTML: "选择单/双栏" },
      })

      .addCell(1, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-single", // 修改ID避免重复
        },
        properties: { innerHTML: "单栏：姓名合并" }, // 明确标签文本
      })
      .addCell(
        1,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-radio-single",
          attributes: {
            type: "radio",
            name: "column-type",
            value: "single",
          },
          properties: {
            checked: dialogData.columnType === "single",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.columnType = "single";
                }
              },
            },
          ],
        },
        false,
      )

      .addCell(2, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-double", // 修改ID避免重复
        },
        properties: { innerHTML: "双栏：姓名分开" }, // 明确标签文本
      })

      .addCell(
        2,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-radio-double",
          attributes: {
            type: "radio",
            name: "column-type",
            value: "double",
          },
          properties: {
            checked: dialogData.columnType === "double",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.columnType = "double";
                }
              },
            },
          ],
        },

        false,
      )

      .addCell(3, 0, {
        tag: "h2",
        properties: { innerHTML: "选择姓名前后关系" },
      })
      .addCell(4, 0, {
        tag: "label",
        namespace: "html",
        properties: {
          innerHTML:
            "注：中文姓名可忽略此选项，英文姓名需要明确姓名前后关系<br><br>",
        },
        styles: {
          textAlign: "left",
          width: "200%", // 通过CSS让它看起来占两列的宽度
          display: "block",
          gridColumn: "1 / 3", // 如果支持CSS Grid
        },
      })

      .addCell(5, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-zh", // 修改ID避免重复
        },
        properties: { innerHTML: "姓+名（姓前名后）" }, // 明确标签文本
      })
      .addCell(
        5,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-radio-1",
          attributes: {
            type: "radio",
            name: "language-type",
            value: "1",
          },
          properties: {
            checked: dialogData.languageType === "1",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.languageType = "1";
                }
              },
            },
          ],
        },
        false,
      )

      .addCell(6, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-en", // 修改ID避免重复
        },
        properties: { innerHTML: "名+姓（名前姓后）" }, // 明确标签文本
      })

      .addCell(
        6,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-radio-2",
          attributes: {
            type: "radio",
            name: "language-type",
            value: "2",
          },
          properties: {
            checked: dialogData.languageType === "2",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.languageType = "2";
                }
              },
            },
          ],
        },

        false,
      )
      .addCell(7, 0, {
        tag: "h2",
        properties: { innerHTML: "手动输入所有作者" },
      })

      .addCell(8, 0, {
        tag: "label",
        namespace: "html",
        properties: {
          innerHTML:
            "中文姓名不用分隔，英文姓和名之间用 空格 分隔<br>不同行分隔不同作者<br><br>",
        },
        styles: {
          textAlign: "left",
          width: "200%", // 通过CSS让它看起来占两列的宽度
          display: "block",
          gridColumn: "1 / 3", // 如果支持CSS Grid
        },
      })

      .addCell(
        9,
        0,
        {
          tag: "textarea", // 将 "input" 改为 "textarea"
          namespace: "html",
          id: "dialog-input",
          attributes: {
            "data-bind": "inputValue", // 绑定到 dialogData.inputValue
            "data-prop": "value", // 绑定到 value 属性
            rows: "4", // 设置行数（可选）
            cols: "40", // 设置列数（可选）
            placeholder: "输入作者...", // 提示文本（可选）
          },
          styles: {
            height: "120px", // 固定高度
            minHeight: "80px", // 最小高度
            resize: "vertical", // 允许垂直调整大小（可选）
          },
        },
        false,
      )

      .addButton("确认", "confirm")
      .addButton("取消", "cancel")

      .setDialogData(dialogData)
      .open("手动输入作者名"); //对话框标题
    addon.data.dialog = dialogHelper;
    await dialogData.unloadLock.promise;
    addon.data.dialog = undefined;
    // if (addon.data.alive)
    //   ztoolkit.getGlobal("alert")(
    //     `Close dialog with ${dialogData._lastButtonId}.\ncolumnType: ${dialogData.columnType}\nInput: ${dialogData.inputValue}.`,
    //   );
    ztoolkit.log(dialogData);
    // 新增：返回用户选择的数据
    return {
      columnType: dialogData.columnType,
      languageType: dialogData.languageType,
      inputValue: dialogData.inputValue,
    };
  }

  static async dialogOneLine() {
    const dialogData: { [key: string | number]: any } = {
      // inputValue: "test",
      columnType: "double", // 默认双栏
      // checkboxValue: true,
      loadCallback: () => {
        ztoolkit.log(dialogData, "Dialog Opened!");
      },
      unloadCallback: () => {
        ztoolkit.log(dialogData, "Dialog closed!");
      },
    };
    const dialogHelper = new ztoolkit.Dialog(6, 4)
      .addCell(0, 0, {
        tag: "td",
        attributes: { colspan: 7 },
        properties: {
          innerHTML: "选择作者分隔符",
        },
        styles: {
          fontSize: "1.2em",
          fontWeight: "bold",
          textAlign: "left",
          width: "100%", // 强制宽度
          minWidth: "300px", // 你可以根据需要调整
          boxSizing: "border-box", // 防止溢出
          display: "table-cell", // 保证是表格单元格
        },
      })

      .addCell(1, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-single", // 修改ID避免重复
        },
        properties: { innerHTML: "半角逗号 ," }, // 明确标签文本
        styles: {
          marginRight: "0px", // 0,1之间无间隔
          textAlign: "left", // 左对齐
        },
      })
      .addCell(
        1,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-radio-single",
          attributes: {
            type: "radio",
            name: "separator-type",
            value: "one",
          },
          properties: {
            checked: dialogData.separatorType === "one",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.separatorType = "one";
                }
              },
            },
          ],
          styles: {
            marginRight: "24px", // 3,4之间大间隔
            textAlign: "left", // 左对齐
          },
        },
        false,
      )

      .addCell(1, 2, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-double", // 修改ID避免重复
        },
        properties: { innerHTML: "|    半角分号 ;" }, // 明确标签文本
        styles: {
          marginRight: "0px", // 2,3之间无间隔
          textAlign: "left", // 左对齐
        },
      })
      .addCell(
        1,
        3,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-radio-double",
          attributes: {
            type: "radio",
            name: "separator-type",
            value: "two",
          },
          properties: {
            checked: dialogData.separatorType === "two",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.separatorType = "two";
                }
              },
            },
          ],
          styles: {
            // marginRight: "24px", // 3,4之间大间隔
            textAlign: "left", // 左对齐
          },
        },
        false,
      )

      .addCell(2, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-single2", // 修改ID避免重复
        },
        properties: { innerHTML: "全角逗号 ，" }, // 明确标签文本
        styles: {
          // width: "100px", // 确保标签宽度足够
          marginRight: "0px", // 0,1之间无间隔
          textAlign: "left", // 左对齐
        },
      })
      .addCell(
        2,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-radio-single2",
          attributes: {
            type: "radio",
            name: "separator-type",
            value: "three",
          },
          properties: {
            checked: dialogData.separatorType === "three",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.separatorType = "three";
                }
              },
            },
          ],
          styles: {
            marginRight: "24px", // 3,4之间大间隔
            textAlign: "left", // 左对齐
          },
        },
        false,
      )

      .addCell(2, 2, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-double2", // 修改ID避免重复
        },
        properties: { innerHTML: "|    全角分号 ；" }, // 明确标签文本
        styles: {
          marginRight: "0px", // 2,3之间无间隔
          textAlign: "left", // 左对齐
        },
      })
      .addCell(
        2,
        3,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-radio-double2",
          attributes: {
            type: "radio",
            name: "separator-type",
            value: "four",
          },
          properties: {
            checked: dialogData.separatorType === "four",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.separatorType = "four";
                }
              },
            },
          ],
          styles: {
            // marginRight: "24px", // 3,4之间大间隔
            textAlign: "left", // 左对齐
          },
        },
        false,
      )

      .addCell(3, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-other", // 修改ID避免重复
        },
        properties: { innerHTML: "其他：" }, // 明确标签文本
        styles: {
          marginRight: "0px", // 4,5之间无间隔
          textAlign: "left", // 左对齐
        },
      })

      .addCell(
        3,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-input",
          attributes: {
            "data-bind": "inputValue",
            "data-prop": "value",
            type: "text",
          },
          // 可选：可加宽输入框
          styles: {
            width: "100px",
          },
        },
        false,
      )

      .addCell(4, 0, {
        tag: "td",
        attributes: { colspan: 7 },
        properties: {
          innerHTML: "选择单/双栏",
        },
        styles: {
          fontSize: "1.2em",
          fontWeight: "bold",
          textAlign: "left",
          width: "100%", // 强制宽度
          minWidth: "300px", // 你可以根据需要调整
          boxSizing: "border-box", // 防止溢出
          display: "table-cell", // 保证是表格单元格
        },
      })

      .addCell(5, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-single", // 修改ID避免重复
        },
        properties: { innerHTML: "单栏：姓名合并" }, // 明确标签文本
        styles: {
          textAlign: "left", // 左对齐
        },
      })
      .addCell(
        5,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-radio-single",
          attributes: {
            type: "radio",
            name: "column-type",
            value: "single",
          },
          properties: {
            checked: dialogData.columnType === "single",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.columnType = "single";
                }
              },
            },
          ],
          styles: {
            marginRight: "24px", // 3,4之间大间隔
            textAlign: "left", // 左对齐
          },
        },
        false,
      )

      .addCell(5, 2, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-double", // 修改ID避免重复
        },
        properties: { innerHTML: "|    双栏：姓名分开" }, // 明确标签文本
        styles: {
          textAlign: "left", // 左对齐
        },
      })

      .addCell(
        5,
        3,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-radio-double",
          attributes: {
            type: "radio",
            name: "column-type",
            value: "double",
          },
          properties: {
            checked: dialogData.columnType === "double",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.columnType = "double";
                }
              },
            },
          ],
          styles: {
            marginRight: "0px", // 4,5之间无间隔
            textAlign: "left", // 左对齐
          },
        },

        false,
      )

      .addButton("确认", "confirm")
      .addButton("取消", "cancel")

      .setDialogData(dialogData)
      .open("所有作者在一行修改"); //对话框标题

    // 将 dialogHelper 存储到 addon.data.dialog 中
    addon.data.dialog = dialogHelper;
    await dialogData.unloadLock.promise;
    addon.data.dialog = undefined;
    // if (addon.data.alive)
    //   ztoolkit.getGlobal("alert")(
    //     `Close dialog with ${dialogData._lastButtonId}.\nSeparatorType: ${dialogData.separatorType}.\ncolumnType: ${dialogData.columnType}\nInput: ${dialogData.inputValue}.`,
    //   );
    ztoolkit.log(dialogData);
    // 新增：返回用户选择的数据
    return {
      separatorType: dialogData.separatorType,
      columnType: dialogData.columnType,
      inputValue: dialogData.inputValue,
    };
  }

  static async dialoglanguage() {
    const dialogData: { [key: string | number]: any } = {
      loadCallback: () => {
        ztoolkit.log(dialogData, "Dialog Opened!");
      },
      unloadCallback: () => {
        ztoolkit.log(dialogData, "Dialog closed!");
      },
    };
    const dialogHelper = new ztoolkit.Dialog(6, 6)
      .addCell(0, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-language-zh",
        },
        properties: { innerHTML: "zh" }, // 明确标签文本
      })
      .addCell(
        0,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-radio-zh",
          attributes: {
            type: "radio",
            name: "language-type",
            value: "zh",
          },
          properties: {
            checked: dialogData.languageType === "zh",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.languageType = "zh";
                }
              },
            },
          ],
        },
        false,
      )

      .addCell(0, 2, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-language-en",
        },
        properties: { innerHTML: "| en" }, // 明确标签文本
        styles: {
          minWidth: "30px",
        },
      })
      .addCell(
        0,
        3,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-radio-en",
          attributes: {
            type: "radio",
            name: "language-type",
            value: "en",
          },
          properties: {
            checked: dialogData.languageType === "en",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.languageType = "en";
                }
              },
            },
          ],
        },
        false,
      )

      .addCell(0, 4, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-language-other",
        },
        properties: { innerHTML: "| 其他" },
        styles: {
          minWidth: "40px",
        },
      })

      .addCell(
        0,
        5,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-input",
          attributes: {
            "data-bind": "inputValue",
            "data-prop": "value",
            type: "text",
          },
          // 可选：可加宽输入框
          styles: {
            width: "70px",
          },
        },
        false,
      )
      .addButton("确认", "confirm")
      .addButton("取消", "cancel")

      .setDialogData(dialogData)
      .open("批量手动修改语言"); //对话框标题

    // 将 dialogHelper 存储到 addon.data.dialog 中
    addon.data.dialog = dialogHelper;
    await dialogData.unloadLock.promise;
    addon.data.dialog = undefined;
    // if (addon.data.alive)
    //   ztoolkit.getGlobal("alert")(
    //     `Close dialog with ${dialogData._lastButtonId}.\nSeparatorType: ${dialogData.separatorType}.\ncolumnType: ${dialogData.columnType}\nInput: ${dialogData.inputValue}.`,
    //   );
    ztoolkit.log(dialogData);
    // 新增：返回用户选择的数据
    return {
      languageType: dialogData.languageType,
      inputValue: dialogData.inputValue,
    };
  }

  static async dialoghelp() {
    const dialogData: { [key: string | number]: any } = {
      loadCallback: () => {
        ztoolkit.log(dialogData, "Dialog Opened!");
      },
      unloadCallback: () => {
        ztoolkit.log(dialogData, "Dialog closed!");
      },
    };
    const dialogHelper = new ztoolkit.Dialog(6, 1)
      .addCell(0, 0, {
        tag: "h2",
        properties: { innerHTML: "使用说明" },
      })

      .addCell(1, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-single", // 修改ID避免重复
        },
        properties: {
          innerHTML:
            "插件功能旨在实现批量、手动修改条目数据。<br><br>主要功能包括：<br><br>-1. 作者栏错乱修改<br><br>&nbsp;&nbsp;&nbsp;&nbsp;-1.1 作者姓名拆分合并<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 请针对中文英文文献选择使用不同的处理方式<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;双栏模式姓前名后，单栏模式在中文里保持了姓前名后的阅读习惯，英文里保持名前姓后阅读习惯<br><br>&nbsp;&nbsp;&nbsp;&nbsp;-1.2 交换作者姓名功能（建议在双栏模式下使用，单栏模式则默认使用第一个空格分隔姓和名，中文自动识别常见姓） <br><br>&nbsp;&nbsp;&nbsp;&nbsp;-1.3 当所有作者处于同一行时进行修改 <br><br>&nbsp;&nbsp;&nbsp;&nbsp;-1.4 删除名里的短横线（建议在双栏模式下使用，单栏模式则默认使用最后一个空格分隔姓和名） <br><br>&nbsp;&nbsp;&nbsp;&nbsp;-1.5 手动输入所有作者，并自定义是双栏还是单栏<br><br>-2. 批量修改时间为ISO的YYYY-MM-DD格式<br><br>-3. 批量修改文献语言，也可以自定义<br><br>-4. 批量清空Extra字段，为了方便给条目进行注释",
        }, // 明确标签文本
      })

      .addButton("关闭", "cancel")

      .setDialogData(dialogData)
      .open("Normalize 使用说明"); //对话框标题

    // 将 dialogHelper 存储到 addon.data.dialog 中
    addon.data.dialog = dialogHelper;
    await dialogData.unloadLock.promise;
    addon.data.dialog = undefined;
  }
}
