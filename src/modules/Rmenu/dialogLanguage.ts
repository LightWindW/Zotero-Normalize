export async function dialogLanguage() {
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
