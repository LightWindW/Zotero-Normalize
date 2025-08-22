export async function CreatorOneLine(
  separatorType: string,
  columnType: string,
  inputValue: string,
) {
  const items =
    Zotero.getActiveZoteroPane().getSelectedItems() as Zotero.Item[];
  if (items.length === 0) {
    Zotero.alert(Zotero.getMainWindow(), "提示", "请先选择条目进行操作！");
    return;
  }

  // 确定分隔符
  let separator = ","; // 默认逗号
  if (separatorType === "one") {
    separator = ",";
  } else if (separatorType === "two") {
    separator = ";";
  } else if (separatorType === "three") {
    separator = "，";
  } else if (separatorType === "four") {
    separator = "；";
  } else if (inputValue && inputValue.trim()) {
    separator = inputValue.trim();
  }

  // 处理每个选中的条目
  for (const item of items) {
    if (!item.isRegularItem()) continue;

    // 获取现有作者
    const existingCreators = item.getCreators();
    if (existingCreators.length === 0) continue;

    // 将现有作者合并成一行字符串
    const authorString = existingCreators
      .map((creator) => {
        if (creator.fieldMode === 1) {
          // 单字段模式，只有 lastName
          return creator.lastName || "";
        } else {
          // 双字段模式，姓名组合
          const lastName = creator.lastName || "";
          const firstName = creator.firstName || "";
          return firstName ? `${lastName} ${firstName}` : lastName;
        }
      })
      .join(separator + " ");

    // 按分隔符重新分割作者
    const authorParts = authorString
      .split(separator)
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    // 根据 columnType 创建新的作者数组
    const newCreators = authorParts.map((authorPart) => {
      if (columnType === "single") {
        // 单栏模式：整个字符串作为 lastName，fieldMode=1
        return {
          lastName: authorPart,
          creatorType: "author",
          fieldMode: 1,
        };
      } else {
        // 双栏模式：空格分割姓名，fieldMode=0
        const nameParts = authorPart.split(/\s+/);
        const lastName = nameParts[0] || "";
        const firstName = nameParts.slice(1).join(" ");

        return {
          firstName: firstName,
          lastName: lastName,
          creatorType: "author",
          fieldMode: 0,
        };
      }
    });

    // 更新条目作者
    item.setCreators(newCreators);
    await item.saveTx();
  }

  // 刷新界面
  Zotero.getActiveZoteroPane().itemsView.refreshAndMaintainSelection();

  // ztoolkit.log(`处理完成，共更新 ${items.length} 个条目的作者信息`);
}
