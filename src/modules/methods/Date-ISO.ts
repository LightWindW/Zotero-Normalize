export async function DateISO() {
  const items =
    Zotero.getActiveZoteroPane().getSelectedItems() as Zotero.Item[];
  if (items.length === 0) {
    Zotero.alert(Zotero.getMainWindow(), "提示", "请先选择条目进行操作！");
    return;
  }

  let updatedCount = 0;
  let noDateCount = 0;

  // 更新每个选中的条目的 Date 字段
  for (const item of items) {
    if (!item.isRegularItem()) continue;

    // 获取原有的日期字段
    const originalDate = item.getField("date") as string;

    if (!originalDate || originalDate.trim() === "") {
      // 没有日期，跳过此条目
      noDateCount++;
      continue;
    }

    try {
      let isoDate = "";
      const trimmedDate = originalDate.trim();

      // 检查是否为年月格式（斜杠分隔）
      const yearMonthSlashPattern = /^(\d{1,2})\/(\d{4})$|^(\d{4})\/(\d{1,2})$/;
      const yearMonthSlashMatch = trimmedDate.match(yearMonthSlashPattern);

      // 检查是否为年月格式（点号分隔）
      const yearMonthDotPattern = /^(\d{1,2})\.(\d{4})$|^(\d{4})\.(\d{1,2})$/;
      const yearMonthDotMatch = trimmedDate.match(yearMonthDotPattern);

      // 检查是否为完整日期格式（点号分隔）
      const fullDateDotPattern =
        /^(\d{1,2})\.(\d{1,2})\.(\d{4})$|^(\d{4})\.(\d{1,2})\.(\d{1,2})$/;
      const fullDateDotMatch = trimmedDate.match(fullDateDotPattern);

      if (yearMonthSlashMatch) {
        // 斜杠年月格式处理
        let year, month;

        if (yearMonthSlashMatch[1] && yearMonthSlashMatch[2]) {
          // 格式：MM/YYYY 或 M/YYYY
          month = yearMonthSlashMatch[1];
          year = yearMonthSlashMatch[2];
        } else {
          // 格式：YYYY/MM 或 YYYY/M
          year = yearMonthSlashMatch[3];
          month = yearMonthSlashMatch[4];
        }

        // 确保月份是两位数
        const paddedMonth = month.padStart(2, "0");
        isoDate = `${year}-${paddedMonth}`;

        ztoolkit.log(`斜杠年月格式处理: "${originalDate}" -> "${isoDate}"`);
      } else if (yearMonthDotMatch) {
        // 点号年月格式处理
        let year, month;

        if (yearMonthDotMatch[1] && yearMonthDotMatch[2]) {
          // 格式：MM.YYYY 或 M.YYYY → 转换为 YYYY-MM
          month = yearMonthDotMatch[1];
          year = yearMonthDotMatch[2];
        } else {
          // 格式：YYYY.MM 或 YYYY.M
          year = yearMonthDotMatch[3];
          month = yearMonthDotMatch[4];
        }

        // 确保月份是两位数
        const paddedMonth = month.padStart(2, "0");
        isoDate = `${year}-${paddedMonth}`;

        ztoolkit.log(`点号年月格式处理: "${originalDate}" -> "${isoDate}"`);
      } else if (fullDateDotMatch) {
        // 点号完整日期格式处理
        let year, month, day;

        if (fullDateDotMatch[1] && fullDateDotMatch[2] && fullDateDotMatch[3]) {
          // 格式：DD.MM.YYYY 或 D.M.YYYY
          day = fullDateDotMatch[1];
          month = fullDateDotMatch[2];
          year = fullDateDotMatch[3];
        } else {
          // 格式：YYYY.MM.DD 或 YYYY.M.D
          year = fullDateDotMatch[4];
          month = fullDateDotMatch[5];
          day = fullDateDotMatch[6];
        }

        // 确保月份和日期是两位数
        const paddedMonth = month.padStart(2, "0");
        const paddedDay = day.padStart(2, "0");
        isoDate = `${year}-${paddedMonth}-${paddedDay}`;

        ztoolkit.log(`点号完整日期格式处理: "${originalDate}" -> "${isoDate}"`);
      } else {
        // 尝试解析其他日期格式
        const parsedDate = new Date(originalDate);

        // 检查日期是否有效
        if (isNaN(parsedDate.getTime())) {
          ztoolkit.log(
            `条目 "${item.getDisplayTitle()}" 的日期格式无效: ${originalDate}`,
          );
          continue;
        }

        // 转换为ISO格式（只保留年月日）
        isoDate = parsedDate.toISOString().split("T")[0];
      }

      // 只有当格式不同时才更新
      if (originalDate !== isoDate) {
        item.setField("date", isoDate);
        await item.saveTx();
        updatedCount++;
        ztoolkit.log(`日期已更新: "${originalDate}" -> "${isoDate}"`);
      }
    } catch (error) {
      ztoolkit.log(`处理条目 "${item.getDisplayTitle()}" 的日期时出错:`, error);
    }
  }

  ztoolkit.log(
    `日期ISO格式化完成，共更新 ${updatedCount} 个条目，${noDateCount} 个条目无日期`,
  );
}
