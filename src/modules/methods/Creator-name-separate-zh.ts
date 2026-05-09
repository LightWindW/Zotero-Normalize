import { COMPOUND_SURNAMES } from "../../utils/chinese-names";

export async function separateNameZh() {
  // 获取当前选中的条目
  const items = Zotero.getActiveZoteroPane().getSelectedItems();

  for (const item of items) {
    if (!item.isRegularItem()) continue;

    const creators = item.getCreators();
    const newCreators: _ZoteroTypes.Item.Creator[] = [];

    for (const creator of creators) {
      // 仅处理 single field 作者（fieldMode = 1）
      if (creator.fieldMode === 1 && creator.lastName) {
        // 删除所有空格
        const fullName = creator.lastName.trim().replace(/\s+/g, "");

        let firstName = "";
        let lastName = "";

        // 如果姓名长度小于2，直接作为姓存储
        if (fullName.length < 2) {
          lastName = fullName;
          firstName = "";
        } else {
          // 检查是否包含复姓
          let isCompoundSurname = false;

          // 检查前两个字是否为复姓
          if (fullName.length >= 2) {
            const firstTwoChars = fullName.substring(0, 2);
            if (COMPOUND_SURNAMES.includes(firstTwoChars)) {
              lastName = firstTwoChars;
              firstName = fullName.substring(2);
              isCompoundSurname = true;
            }
          }

          // 如果不是复姓，第一个字为姓
          if (!isCompoundSurname) {
            lastName = fullName.substring(0, 1);
            firstName = fullName.substring(1);
          }
        }

        newCreators.push({
          creatorTypeID: creator.creatorTypeID, // 保持原有的作者类型ID
          firstName,
          lastName,
          fieldMode: 0, // 使用 two-field 模式
        });
      } else {
        // 已经是 two-field 或其他情况，保留原样
        newCreators.push(creator);
      }
    }

    item.setCreators(newCreators);
    await item.saveTx();
  }
}
