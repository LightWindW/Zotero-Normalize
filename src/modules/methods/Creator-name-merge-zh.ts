export function mergeNameZh() {
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
      // 将姓放在前面，名放在后面进行合并，中间没有空格
      let fullName = "";

      if (creator.lastName && creator.lastName.trim()) {
        fullName = creator.lastName.trim(); // 姓在前

        if (creator.firstName && creator.firstName.trim()) {
          fullName += creator.firstName.trim(); // 名在后，无空格
        }
      } else if (creator.firstName && creator.firstName.trim()) {
        // 如果没有姓，只有名
        fullName = creator.firstName.trim();
      }

      newCreators.push({
        creatorTypeID: creator.creatorTypeID, // 保持原有的作者类型ID
        lastName: fullName, // 合并后的全名存储在 lastName 字段（姓名，无空格）
        fieldMode: 1, // 1 = 单栏模式（将合并的姓名存储在一个字段中）
      });
    }

    item.setCreators(newCreators); // 设置新的作者列表
    item.saveTx(); // 保存条目更改
  }
}
