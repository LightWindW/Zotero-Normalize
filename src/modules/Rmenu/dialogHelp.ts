import { getString } from "../../utils/locale";

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
      properties: { innerHTML: getString("dialog-help-heading") },
    })

    .addCell(1, 0, {
      tag: "label",
      namespace: "html",
      attributes: {
        for: "dialog-checkbox-single", // 修改ID避免重复
      },
      properties: {
        innerHTML: getString("dialog-help-content"),
      },
    })

    .addButton(getString("dialog-close"), "cancel")

    .setDialogData(dialogData)
    .open(getString("dialog-help-title"));

  // 将 dialogHelper 存储到 addon.data.dialog 中
  addon.data.dialog = dialogHelper;
  await dialogData.unloadLock.promise;
  addon.data.dialog = undefined;
}

