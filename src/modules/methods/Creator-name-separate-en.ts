export function separateNameEn() {
  // 获取当前选中的条目
  const items = Zotero.getActiveZoteroPane().getSelectedItems();

  for (const item of items) {
    if (!item.isRegularItem()) continue;

    const creators = item.getCreators();
    const newCreators: Zotero.Creator[] = [];

    for (const creator of creators) {
      // 仅处理 single field 作者（fieldMode = 1）
      if (creator.fieldMode === 1 && creator.lastName) {
        const nameParts = creator.lastName.trim().split(/\s+/); // 按空格拆分名字

        let firstName = "";
        let lastName = "";

        if (nameParts.length === 1) {
          // 只有一个词，就默认放姓氏，名字留空
          lastName = nameParts[0];
        } else {
          // 英文习惯：前面是名（firstName），最后一个词是姓（lastName）
          lastName = nameParts.pop()!; // 最后一个词作为姓
          firstName = nameParts.join(" "); // 前面所有词作为名
        }

        newCreators.push({
          creatorTypeID: creator.creatorTypeID, // 保持原有的作者类型ID
          firstName,
          lastName,
          fieldMode: 0, // 使用 two-field 模式
        });
      } else {
        // 已经是 two-field，保留原样
        newCreators.push(creator);
      }
    }

    item.setCreators(newCreators);
    item.saveTx();
  }
}
