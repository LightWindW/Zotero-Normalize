export async function dialogOneLine() {
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
            value: "comma",
          },
          properties: {
            checked: dialogData.separatorType === "comma",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.separatorType = "comma";
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
            value: "semicolon",
          },
          properties: {
            checked: dialogData.separatorType === "semicolon",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.separatorType = "semicolon";
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
            value: "comma-fullwidth",
          },
          properties: {
            checked: dialogData.separatorType === "comma-fullwidth",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.separatorType = "comma-fullwidth";
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
            value: "semicolon-fullwidth",
          },
          properties: {
            checked: dialogData.separatorType === "semicolon-fullwidth",
          },
          listeners: [
            {
              type: "change",
              listener: function (e) {
                if ((e.target as HTMLInputElement).checked) {
                  dialogData.separatorType = "semicolon-fullwidth";
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
