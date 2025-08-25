export function mergeNameEn() {
  // 获取当前选中的条目
  const items = Zotero.getActiveZoteroPane().getSelectedItems();

  for (const item of items) {
    if (!item.isRegularItem()) continue;

    const creators = item.getCreators();
    const newCreators: {
      creatorTypeID: number;
      lastName: string;
      fieldMode: number;
    }[] = [];

    for (const creator of creators) {
      // 将名放在姓前面进行合并
      const fullName =
        creator.firstName && creator.firstName.trim()
          ? `${creator.firstName.trim()} ${creator.lastName.trim()}` // 名 + 空格 + 姓
          : creator.lastName.trim(); // 如果没有名，只保留姓

      newCreators.push({
        creatorTypeID: creator.creatorTypeID, // 保持原有的作者类型ID
        lastName: fullName, // 合并后的全名存储在 lastName 字段
        fieldMode: 1, // 1 = 单栏模式（将合并的姓名存储在一个字段中）
      });
    }

    item.setCreators(newCreators); // 设置新的作者列表
    item.saveTx(); // 保存条目更改
  }
}
