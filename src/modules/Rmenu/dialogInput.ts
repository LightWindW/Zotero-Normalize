import { getString } from "../../utils/locale";

export async function dialogInput() {
    const dialogData: { [key: string | number]: any } = {
      // inputValue: "test",
      columnType: "double",
      languageType: "given-first",
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
        properties: { innerHTML: getString("dialog-input-column") },
      })

      .addCell(1, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox-single", // 修改ID避免重复
        },
        properties: { innerHTML: getString("dialog-input-column-single") },
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
        properties: { innerHTML: getString("dialog-input-column-double") },
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
        properties: { innerHTML: getString("dialog-input-name-order") },
      })
      .addCell(4, 0, {
        tag: "label",
        namespace: "html",
        properties: {
          innerHTML: getString("dialog-input-name-order-note"),
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
        properties: { innerHTML: getString("dialog-input-surname-first") },
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
            value: "surname-first",
          },
          properties: {
            checked: dialogData.languageType === "surname-first",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.languageType = "surname-first";
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
        properties: { innerHTML: getString("dialog-input-given-first") },
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
            value: "given-first",
          },
          properties: {
            checked: dialogData.languageType === "given-first",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.languageType = "given-first";
                }
              },
            },
          ],
        },

        false,
      )
      .addCell(7, 0, {
        tag: "h2",
        properties: { innerHTML: getString("dialog-input-enter-authors") },
      })

      .addCell(8, 0, {
        tag: "label",
        namespace: "html",
        properties: {
          innerHTML: getString("dialog-input-enter-authors-hint"),
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
            placeholder: getString("dialog-input-placeholder"),
          },
          styles: {
            height: "120px", // 固定高度
            minHeight: "80px", // 最小高度
            resize: "vertical", // 允许垂直调整大小（可选）
          },
        },
        false,
      )

      .addButton(getString("dialog-confirm"), "confirm")
      .addButton(getString("dialog-cancel"), "cancel")

      .setDialogData(dialogData)
      .open(getString("dialog-input-title"));
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
