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
