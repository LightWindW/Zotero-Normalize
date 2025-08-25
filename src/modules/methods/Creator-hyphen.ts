export async function CreatorHyphen() {
  const items =
    Zotero.getActiveZoteroPane().getSelectedItems() as Zotero.Item[];

  if (items.length === 0) {
    Zotero.alert(Zotero.getMainWindow(), "提示", "请先选择条目进行操作！");
    return;
  }

  let updatedCount = 0;

  for (const item of items) {
    if (!item.isRegularItem()) continue;

    const creators = item.getCreators();
    let hasChanges = false;

    const updatedCreators = creators.map((creator) => {
      if (creator.fieldMode === 0) {
        // 双栏模式：检查 firstName 和 lastName 中的连字符
        const newCreator = { ...creator };

        if (creator.firstName && creator.firstName.includes("-")) {
          newCreator.firstName = creator.firstName.replace(/-/g, "");
          hasChanges = true;
        }

        // if (creator.lastName && creator.lastName.includes("-")) {
        //   newCreator.lastName = creator.lastName.replace(/-/g, "");
        //   hasChanges = true;
        // }

        return newCreator;
      } else if (creator.fieldMode === 1) {
        // 单栏模式：处理 lastName 字段
        if (creator.lastName && creator.lastName.includes("-")) {
          hasChanges = true;

          if (creator.lastName.includes(" ")) {
            // 有空格的情况：按最后一个空格分离
            const fullName = creator.lastName.trim();
            const lastSpaceIndex = fullName.lastIndexOf(" ");

            if (lastSpaceIndex > 0) {
              const firstName = fullName.substring(0, lastSpaceIndex);
              const lastName = fullName.substring(lastSpaceIndex + 1);

              // 处理两部分的连字符
              const processedFirstName = firstName.replace(/-/g, "");
              const processedLastName = lastName.replace(/-/g, "");

              // 重新组合
              const newFullName = processedFirstName + " " + processedLastName;

              return {
                ...creator,
                lastName: newFullName,
              };
            }
          } else {
            // 没有空格的情况：直接处理连字符
            return {
              ...creator,
              lastName: creator.lastName.replace(/-/g, ""),
            };
          }
        }
      }

      return creator;
    });

    if (hasChanges) {
      try {
        item.setCreators(updatedCreators);
        await item.saveTx();
        updatedCount++;
        ztoolkit.log(`已更新条目: ${item.getDisplayTitle()}`);
      } catch (error) {
        ztoolkit.log(`更新条目失败: ${item.getDisplayTitle()}`, error);
      }
    }
  }

  // // 刷新界面
  // if (updatedCount > 0) {
  //   Zotero.getActiveZoteroPane().itemsView.refreshAndMaintainSelection();
  // }

  // ztoolkit.log(`连字符处理完成，共更新 ${updatedCount} 个条目的作者信息`);

  // Zotero.alert(
  //   Zotero.getMainWindow(),
  //   "操作完成",
  //   `成功处理 ${updatedCount} 个条目中的作者连字符`,
  // );
}
