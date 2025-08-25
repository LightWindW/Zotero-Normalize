export async function LanguageInput(languageType: string, inputValue: string) {
  const items =
    Zotero.getActiveZoteroPane().getSelectedItems() as Zotero.Item[];
  if (items.length === 0) {
    Zotero.alert(Zotero.getMainWindow(), "提示", "请先选择条目进行操作！");
    return;
  }

  // 确定要设置的语言值
  let languageValue = languageType; // 默认使用 languageType
  if (inputValue && inputValue.trim()) {
    languageValue = inputValue.trim(); // 如果 inputValue 有值，优先使用
  }

  // 处理每个选中的条目
  let updatedCount = 0;
  for (const item of items) {
    if (!item.isRegularItem()) continue;

    try {
      // 设置语言字段
      item.setField("language", languageValue);
      await item.saveTx();
      updatedCount++;
    } catch (error) {
      ztoolkit.log(
        `更新条目 ${item.getDisplayTitle()} 的语言字段时出错:`,
        error,
      );
    }
  }

  // 刷新界面
  //   Zotero.getActiveZoteroPane().itemsView.refreshAndMaintainSelection();
}
