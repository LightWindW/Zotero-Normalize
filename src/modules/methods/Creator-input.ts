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

  // 常见的中文复姓列表
  const compoundSurnames = [
    "欧阳",
    "太史",
    "端木",
    "上官",
    "司马",
    "东方",
    "独孤",
    "南宫",
    "万俟",
    "闻人",
    "夏侯",
    "诸葛",
    "尉迟",
    "公羊",
    "赫连",
    "澹台",
    "皇甫",
    "宗政",
    "濮阳",
    "公冶",
    "太叔",
    "申屠",
    "公孙",
    "慕容",
    "仲孙",
    "钟离",
    "长孙",
    "宇文",
    "司徒",
    "鲜于",
    "司空",
    "闾丘",
    "子车",
    "亓官",
    "司寇",
    "巫马",
    "公西",
    "颛孙",
    "壤驷",
    "公良",
    "漆雕",
    "乐正",
    "宰父",
    "谷梁",
    "拓跋",
    "夹谷",
    "轩辕",
    "令狐",
    "段干",
    "百里",
    "呼延",
    "东郭",
    "南门",
    "羊舌",
    "微生",
    "公户",
    "公玉",
    "公仪",
    "梁丘",
    "公仲",
    "公上",
    "公门",
    "公山",
    "公坚",
    "左丘",
    "公伯",
    "西门",
    "公祖",
    "第五",
    "公乘",
    "贯丘",
    "公皙",
    "南荣",
    "东里",
    "海西",
    "淳于",
    "单于",
    "田丘",
    "公羽",
    "锺离",
  ];

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
    Zotero.alert(Zotero.getMainWindow(), "提示", "请输入作者信息！");
    return;
  }

  // 检测第一行的语言类型作为整体判断
  const firstLine = lines[0];
  let detectedLanguage = "";

  if (isChinese(firstLine)) {
    detectedLanguage = "zh";
    // 设置条目语言为中文
    item.setField("language", "zh");
  } else if (isEnglish(firstLine)) {
    detectedLanguage = "en";
    // 保持传入的 languageType，或默认设置为 en
    item.setField("language", "en");
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
            if (compoundSurnames.includes(firstTwoChars)) {
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
        } else if (languageType === "1") {
          // languageType = 1：姓在前，名在后（第一个空格分隔）
          lastName = nameParts[0]; // 第一个词作为姓
          firstName = nameParts.slice(1).join(" "); // 后面所有词作为名
        } else if (languageType === "2") {
          // languageType = 2：名在前，姓在后（最后一个空格分隔）
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

  item.setCreators(creators);
  await item.saveTx();

  ztoolkit.log(
    `作者信息已更新，检测语言: ${detectedLanguage}, 处理模式: ${columnType}, languageType: ${languageType}`,
  );
}
