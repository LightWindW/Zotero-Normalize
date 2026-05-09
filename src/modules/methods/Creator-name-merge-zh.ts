export async function mergeNameZh() {
  // 获取当前选中的条目
  const items = Zotero.getActiveZoteroPane().getSelectedItems();

  for (const item of items) {
    if (!item.isRegularItem()) continue;

    const creators = item.getCreators();
    const newCreators: _ZoteroTypes.Item.Creator[] = [];

    for (const creator of creators) {
      // 已经是单栏，直接保留（防御性分支，避免把 lastName 当姓再次合并）
      if (creator.fieldMode === 1) {
        newCreators.push(creator);
        continue;
      }

      // 姓在前，名在后，无空格
      const firstName = (creator.firstName ?? "").trim();
      const lastName = (creator.lastName ?? "").trim();
      const fullName = lastName + firstName;

      newCreators.push({
        creatorTypeID: creator.creatorTypeID, // 保持原有的作者类型ID
        firstName: "",
        lastName: fullName, // 合并后的全名存储在 lastName 字段（姓名，无空格）
        fieldMode: 1, // 1 = 单栏模式（将合并的姓名存储在一个字段中）
      });
    }

    item.setCreators(newCreators); // 设置新的作者列表
    await item.saveTx(); // 保存条目更改
  }
}
