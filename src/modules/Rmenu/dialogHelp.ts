export async function dialogHelp() {
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

