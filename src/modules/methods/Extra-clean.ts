export async function ExtraClean() {
  const items =
    Zotero.getActiveZoteroPane().getSelectedItems() as Zotero.Item[];
  if (items.length === 0) {
    Zotero.alert(Zotero.getMainWindow(), "提示", "请先选择条目进行操作！");
    return;
  }

  // 清空每个选中的条目的 Extra 字段
  for (const item of items) {
    if (!item.isRegularItem()) continue;

    item.setField("extra", "");
    await item.saveTx();
  }

  // Zotero 8/9 中 itemsView.refreshAndMaintainSelection 已不存在，
  // saveTx() 触发的 Notifier 会自动刷新界面
}
