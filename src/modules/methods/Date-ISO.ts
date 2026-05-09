export async function DateISO() {
  const items =
    Zotero.getActiveZoteroPane().getSelectedItems() as Zotero.Item[];
  if (items.length === 0) {
    Zotero.alert(Zotero.getMainWindow(), "提示", "请先选择条目进行操作！");
    return;
  }

  let updatedCount = 0;
  let noDateCount = 0;
  let skipCount = 0;

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

      // 显式格式：YYYY/MM/DD 或 YYYY/M/D
      const slashDatePattern = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
      const slashDateMatch = trimmedDate.match(slashDatePattern);

      // 显式格式：YYYYMMDD
      const compactPattern = /^(\d{4})(\d{2})(\d{2})$/;
      const compactMatch = trimmedDate.match(compactPattern);

      if (yearMonthSlashMatch) {
        // 斜杠年月格式处理
        let year, month;

        if (yearMonthSlashMatch[1] && yearMonthSlashMatch[2]) {
          month = yearMonthSlashMatch[1];
          year = yearMonthSlashMatch[2];
        } else {
          year = yearMonthSlashMatch[3];
          month = yearMonthSlashMatch[4];
        }

        const paddedMonth = month.padStart(2, "0");
        isoDate = `${year}-${paddedMonth}`;
      } else if (yearMonthDotMatch) {
        // 点号年月格式处理
        let year, month;

        if (yearMonthDotMatch[1] && yearMonthDotMatch[2]) {
          month = yearMonthDotMatch[1];
          year = yearMonthDotMatch[2];
        } else {
          year = yearMonthDotMatch[3];
          month = yearMonthDotMatch[4];
        }

        const paddedMonth = month.padStart(2, "0");
        isoDate = `${year}-${paddedMonth}`;
      } else if (fullDateDotMatch) {
        // 点号完整日期格式处理
        let year, month, day;

        if (fullDateDotMatch[1] && fullDateDotMatch[2] && fullDateDotMatch[3]) {
          day = fullDateDotMatch[1];
          month = fullDateDotMatch[2];
          year = fullDateDotMatch[3];
        } else {
          year = fullDateDotMatch[4];
          month = fullDateDotMatch[5];
          day = fullDateDotMatch[6];
        }

        const paddedMonth = month.padStart(2, "0");
        const paddedDay = day.padStart(2, "0");
        isoDate = `${year}-${paddedMonth}-${paddedDay}`;
      } else if (slashDateMatch) {
        const year = slashDateMatch[1];
        const month = slashDateMatch[2].padStart(2, "0");
        const day = slashDateMatch[3].padStart(2, "0");
        isoDate = `${year}-${month}-${day}`;
      } else if (compactMatch) {
        const year = compactMatch[1];
        const month = compactMatch[2];
        const day = compactMatch[3];
        isoDate = `${year}-${month}-${day}`;
      } else {
        // 已经是 ISO 格式（YYYY-MM-DD）则跳过
        const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
        if (isoPattern.test(trimmedDate)) {
          continue;
        }

        // 尝试解析其他日期格式（含美式日期）
        const parsedDate = new Date(originalDate);

        if (isNaN(parsedDate.getTime())) {
          ztoolkit.log(
            `条目 "${item.getDisplayTitle()}" 的日期格式无效: ${originalDate}`,
          );
          skipCount++;
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
      skipCount++;
    }
  }

  // 使用 ProgressWindow 反馈结果
  new ztoolkit.ProgressWindow("日期格式化完成", {
    closeOnClick: true,
    closeTime: -1,
  })
    .createLine({
      text: `已更新 ${updatedCount} 个条目，无日期 ${noDateCount} 个，跳过 ${skipCount} 个`,
      type: "success",
      progress: 100,
    })
    .show();

  ztoolkit.log(
    `日期ISO格式化完成，共更新 ${updatedCount} 个条目，无日期 ${noDateCount} 个，跳过 ${skipCount} 个`,
  );
}
