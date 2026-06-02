import { COMPOUND_SURNAMES } from "../../utils/chinese-names";

export async function CreatorInput(
  columnType: string,
  languageType: string,
  inputValue: string,
) {
  const items =
    Zotero.getActiveZoteroPane().getSelectedItems() as Zotero.Item[];
  if (items.length !== 1) {
    Zotero.alert(Zotero.getMainWindow(), "提示", "只能选择一个条目进行操作！");
    return;
  }
  const item = items[0];
  if (!item.isRegularItem()) return;

  /**
   * 检测字符串是否为中文
   */
  function isChinese(str: string): boolean {
    const chineseRegex = /[\u4e00-\u9fff]/;
    return chineseRegex.test(str.charAt(0));
  }

  /**
   * 检测字符串是否为英文字母
   */
  function isEnglish(str: string): boolean {
    const englishRegex = /[a-zA-Z]/;
    return englishRegex.test(str.charAt(0));
  }

  // 解析作者输入
  const lines = inputValue
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return;
  }

  // 检测第一行的语言类型作为整体判断
  const firstLine = lines[0];
  let detectedLanguage = "";

  if (isChinese(firstLine)) {
    detectedLanguage = "zh";
  } else if (isEnglish(firstLine)) {
    detectedLanguage = "en";
  } else {
    Zotero.alert(Zotero.getMainWindow(), "提示", "无法识别输入的语言类型！");
    return;
  }

  ztoolkit.log(`检测到语言类型: ${detectedLanguage}`);

  const creators = lines.map((line) => {
    if (detectedLanguage === "zh") {
      // 中文处理：不管 languageType 是什么，都按中文规则处理
      if (columnType === "single") {
        // 中文单栏：直接把姓名放入 lastName
        return {
          lastName: line.replace(/\s+/g, ""), // 删除空格
          creatorType: "author",
          fieldMode: 1,
        };
      } else {
        // 中文双栏：识别复姓，分离姓名
        let firstName = "";
        let lastName = "";

        // 删除所有空格
        const cleanName = line.replace(/\s+/g, "");

        if (cleanName.length < 2) {
          lastName = cleanName;
          firstName = "";
        } else {
          // 检查是否包含复姓
          let isCompoundSurname = false;

          if (cleanName.length >= 2) {
            const firstTwoChars = cleanName.substring(0, 2);
            if (COMPOUND_SURNAMES.includes(firstTwoChars)) {
              lastName = firstTwoChars;
              firstName = cleanName.substring(2);
              isCompoundSurname = true;
            }
          }

          // 如果不是复姓，第一个字为姓
          if (!isCompoundSurname) {
            lastName = cleanName.substring(0, 1);
            firstName = cleanName.substring(1);
          }
        }

        return {
          firstName: firstName,
          lastName: lastName,
          creatorType: "author",
          fieldMode: 0,
        };
      }
    } else {
      // 英文处理：根据 languageType 判断姓名前后关系
      if (columnType === "single") {
        // 英文单栏：直接存储完整姓名
        return {
          lastName: line,
          creatorType: "author",
          fieldMode: 1,
        };
      } else {
        // 英文双栏：根据 languageType 处理姓名顺序
        const nameParts = line.split(/\s+/);
        let firstName = "";
        let lastName = "";

        if (nameParts.length === 1) {
          // 只有一个词，默认作为姓
          lastName = nameParts[0];
          firstName = "";
        } else if (languageType === "surname-first") {
          // 姓在前，名在后（第一个空格分隔）
          lastName = nameParts[0]; // 第一个词作为姓
          firstName = nameParts.slice(1).join(" "); // 后面所有词作为名
        } else if (languageType === "given-first") {
          // 名在前，姓在后（最后一个空格分隔）
          lastName = nameParts.pop()!; // 最后一个词作为姓
          firstName = nameParts.join(" "); // 前面所有词作为名
        } else {
          // 默认处理：名在前，姓在后
          lastName = nameParts.pop()!;
          firstName = nameParts.join(" ");
        }

        return {
          firstName: firstName,
          lastName: lastName,
          creatorType: "author",
          fieldMode: 0,
        };
      }
    }
  });

  item.setCreators(creators as any);
  item.setField("language", detectedLanguage);
  await item.saveTx();

  ztoolkit.log(
    `作者信息已更新，检测语言: ${detectedLanguage}, 处理模式: ${columnType}, languageType: ${languageType}`,
  );
}
