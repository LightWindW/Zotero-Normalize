import {
  ALL_SURNAMES,
  SORTED_SURNAMES_DESC,
} from "../../utils/chinese-names";

export async function CreatorOneLine(
  separatorType: string,
  columnType: string,
  inputValue: string,
) {
  const items =
    Zotero.getActiveZoteroPane().getSelectedItems() as Zotero.Item[];
  if (items.length === 0) {
    Zotero.alert(Zotero.getMainWindow(), "提示", "请先选择条目进行操作！");
    return;
  }

  /**
   * 检测字符串是否包含中文
   */
  function isChinese(str: string): boolean {
    const chineseRegex = /[\u4e00-\u9fff]/;
    return chineseRegex.test(str);
  }

  /**
   * 查找中文姓氏并分离姓名
   */
  function parseChineseName(name: string): {
    firstName: string;
    lastName: string;
  } {
    const cleanName = name.replace(/\s+/g, ""); // 去除空格

    // 先检查复姓（从长到短）
    for (const surname of SORTED_SURNAMES_DESC) {
      if (cleanName.startsWith(surname)) {
        return {
          lastName: surname,
          firstName: cleanName.substring(surname.length),
        };
      }
    }

    // 没有找到常见姓氏，默认第一个字为姓
    if (cleanName.length >= 2) {
      return {
        lastName: cleanName.substring(0, 1),
        firstName: cleanName.substring(1),
      };
    } else {
      return {
        lastName: cleanName,
        firstName: "",
      };
    }
  }

  /**
   * 解析英文姓名（按最后一个空格分离）
   */
  function parseEnglishName(name: string): {
    firstName: string;
    lastName: string;
  } {
    const trimmedName = name.trim();
    const lastSpaceIndex = trimmedName.lastIndexOf(" ");

    if (lastSpaceIndex > 0) {
      return {
        firstName: trimmedName.substring(0, lastSpaceIndex),
        lastName: trimmedName.substring(lastSpaceIndex + 1),
      };
    } else {
      return {
        firstName: "",
        lastName: trimmedName,
      };
    }
  }

  // 确定分隔符
  let separator = ","; // 默认逗号
  if (separatorType === "comma") {
    separator = ",";
  } else if (separatorType === "semicolon") {
    separator = ";";
  } else if (separatorType === "comma-fullwidth") {
    separator = "，";
  } else if (separatorType === "semicolon-fullwidth") {
    separator = "；";
  } else if (inputValue && inputValue.trim()) {
    separator = inputValue.trim();
  }

  // 校验用户输入：必须有内容才能进行"一行修改"
  if (!inputValue || !inputValue.trim()) {
    Zotero.alert(
      Zotero.getMainWindow(),
      "提示",
      "请在输入框中填写作者，并使用所选分隔符隔开！",
    );
    return;
  }

  // 按用户选择的分隔符拆分输入（直接处理 inputValue，不依赖现有 creators）
  const authorParts = inputValue
    .split(separator)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (authorParts.length === 0) {
    Zotero.alert(
      Zotero.getMainWindow(),
      "提示",
      "未识别到有效作者，请检查分隔符与输入内容！",
    );
    return;
  }

  // 处理每个选中的条目
  for (const item of items) {
    if (!item.isRegularItem()) continue;

    // 根据 columnType 和语言类型创建新的作者数组
    const newCreators = authorParts.map((authorPart) => {
      if (columnType === "single") {
        // 单栏模式：直接放入 lastName，不管是中文还是英文
        return {
          lastName: authorPart,
          creatorType: "author",
          fieldMode: 1,
        };
      } else {
        // 双栏模式：根据语言类型分别处理
        if (isChinese(authorPart)) {
          // 中文：自动识别常用姓，姓放在 lastName，名放在 firstName
          const { firstName, lastName } = parseChineseName(authorPart);

          return {
            firstName: firstName,
            lastName: lastName,
            creatorType: "author",
            fieldMode: 0,
          };
        } else {
          // 英文：按最后一个空格分离，前面是名，后面是姓
          const { firstName, lastName } = parseEnglishName(authorPart);

          return {
            firstName: firstName,
            lastName: lastName,
            creatorType: "author",
            fieldMode: 0,
          };
        }
      }
    });

    // 更新条目作者
    item.setCreators(newCreators as any);
    await item.saveTx();
  }

  // 刷新界面
  // Zotero.getActiveZoteroPane().itemsView.refreshAndMaintainSelection();

  ztoolkit.log(`处理完成，共更新 ${items.length} 个条目的作者信息`);
}
