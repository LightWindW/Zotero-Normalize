import {
  ALL_SURNAMES,
  SORTED_SURNAMES_DESC,
} from "../../utils/chinese-names";

export async function SwitchFLName() {
  const items =
    Zotero.getActiveZoteroPane().getSelectedItems() as Zotero.Item[];

  /**
   * 检测字符串是否包含中文
   */
  function isChinese(str: string): boolean {
    const chineseRegex = /[一-鿿]/;
    return chineseRegex.test(str);
  }

  /**
   * 查找中文姓氏在姓名中的位置（改进版）
   */
  function findChineseSurnamePosition(name: string): {
    surname: string;
    position: "first" | "last" | "none";
    givenName: string;
  } {
    const cleanName = name.replace(/\s+/g, ""); // 去除空格

    // 按长度降序检查姓氏（优先匹配复姓）
    for (const surname of SORTED_SURNAMES_DESC) {
      if (cleanName.startsWith(surname)) {
        const givenName = cleanName.substring(surname.length);
        return { surname, position: "first", givenName };
      }
    }

    // 检查姓在结尾的情况
    for (const surname of SORTED_SURNAMES_DESC) {
      if (cleanName.endsWith(surname)) {
        const givenName = cleanName.substring(
          0,
          cleanName.length - surname.length,
        );
        return { surname, position: "last", givenName };
      }
    }

    return { surname: "", position: "none", givenName: "" };
  }

  /**
   * 改进的中文姓名交换逻辑
   */
  function switchChineseName(fullName: string): string {
    const cleanName = fullName.replace(/\s+/g, "");

    // 尝试找到姓氏
    const result = findChineseSurnamePosition(cleanName);

    if (result.position !== "none") {
      // 找到了姓氏，进行交换
      if (result.position === "first") {
        // 原格式：姓+名 → 交换后：名+姓
        return result.givenName + result.surname;
      } else {
        // 原格式：名+姓 → 交换后：姓+名
        return result.surname + result.givenName;
      }
    } else {
      // 没有找到常见姓氏，尝试智能处理
      if (cleanName.length === 2) {
        // 两个字的情况，直接交换
        return cleanName.charAt(1) + cleanName.charAt(0);
      } else if (cleanName.length === 3) {
        // 三个字的情况，可能是：
        // 1. 单姓+双名：张三四 ↔ 三四张
        // 2. 双姓+单名：欧阳修 ↔ 修欧阳

        // 检查第一个字是否为姓
        const firstChar = cleanName.charAt(0);
        const lastChar = cleanName.charAt(2);

        if (ALL_SURNAMES.includes(firstChar)) {
          // 第一个字是姓：张三四 → 三四张
          return cleanName.substring(1) + firstChar;
        } else if (ALL_SURNAMES.includes(lastChar)) {
          // 最后一个字是姓：三四张 → 张三四
          return lastChar + cleanName.substring(0, 2);
        } else {
          // 都不是常见姓，按中间分割
          return cleanName.substring(1) + cleanName.charAt(0);
        }
      } else if (cleanName.length >= 4) {
        // 四个字及以上，检查前两个字是否为复姓
        const firstTwoChars = cleanName.substring(0, 2);
        const lastTwoChars = cleanName.substring(cleanName.length - 2);

        if (ALL_SURNAMES.includes(firstTwoChars)) {
          // 前两个字是复姓：欧阳志远 → 志远欧阳
          return cleanName.substring(2) + firstTwoChars;
        } else if (ALL_SURNAMES.includes(lastTwoChars)) {
          // 后两个字是复姓：志远欧阳 → 欧阳志远
          return lastTwoChars + cleanName.substring(0, cleanName.length - 2);
        } else {
          // 按第一个字分割
          return cleanName.substring(1) + cleanName.charAt(0);
        }
      }

      // 其他情况保持原样
      return cleanName;
    }
  }

  for (const item of items) {
    if (!item.isRegularItem()) continue;

    const creators = item.getCreators();
    const newCreators: _ZoteroTypes.Item.Creator[] = [];

    for (const creator of creators) {
      if (creator.fieldMode === 1) {
        // 单栏模式：判断中文还是英文
        if (creator.lastName && creator.lastName.trim()) {
          const fullName = creator.lastName.trim();

          if (isChinese(fullName)) {
            // 中文姓名处理（使用改进的逻辑）
            const switchedName = switchChineseName(fullName);

            newCreators.push({
              creatorTypeID: creator.creatorTypeID,
              firstName: "",
              lastName: switchedName,
              fieldMode: 1,
            });
          } else {
            // 英文姓名处理（保持原逻辑）
            const firstSpaceIndex = fullName.indexOf(" ");
            let firstName = "";
            let lastName = "";

            if (firstSpaceIndex > 0) {
              const firstPart = fullName.substring(0, firstSpaceIndex);
              const secondPart = fullName.substring(firstSpaceIndex + 1);
              firstName = firstPart;
              lastName = secondPart;
            } else {
              lastName = fullName;
            }

            const switchedName = lastName + (firstName ? " " + firstName : "");

            newCreators.push({
              creatorTypeID: creator.creatorTypeID,
              firstName: "",
              lastName: switchedName,
              fieldMode: 1,
            });
          }
        } else {
          newCreators.push(creator);
        }
      } else {
        // 双栏模式：直接交换firstName和lastName
        const temp = creator.firstName;
        newCreators.push({
          creatorTypeID: creator.creatorTypeID,
          firstName: creator.lastName,
          lastName: temp,
          fieldMode: 0,
        });
      }
    }

    item.setCreators(newCreators);
    await item.saveTx();
  }
}
