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

  // 常见中文姓氏列表
  const chineseSurnames = [
    // 常见单字姓
    "李",
    "王",
    "张",
    "刘",
    "陈",
    "杨",
    "赵",
    "黄",
    "周",
    "吴",
    "徐",
    "孙",
    "胡",
    "朱",
    "高",
    "林",
    "何",
    "郭",
    "马",
    "罗",
    "梁",
    "宋",
    "郑",
    "谢",
    "韩",
    "唐",
    "冯",
    "于",
    "董",
    "萧",
    "程",
    "曹",
    "袁",
    "邓",
    "许",
    "傅",
    "沈",
    "曾",
    "彭",
    "吕",
    "苏",
    "卢",
    "蒋",
    "蔡",
    "贾",
    "丁",
    "魏",
    "薛",
    "叶",
    "阎",
    "余",
    "潘",
    "杜",
    "戴",
    "夏",
    "钟",
    "汪",
    "田",
    "任",
    "姜",
    "范",
    "方",
    "石",
    "姚",
    "谭",
    "廖",
    "邹",
    "熊",
    "金",
    "陆",
    "郝",
    "孔",
    "白",
    "崔",
    "康",
    "毛",
    "邱",
    "秦",
    "江",
    "史",
    "顾",
    "侯",
    "邵",
    "孟",
    "龙",
    "万",
    "段",
    "章",
    "钱",
    "汤",
    "尹",
    "黎",
    "易",
    "常",
    "武",
    "乔",
    "贺",
    "赖",
    "龚",
    "文",
    "庞",
    "樊",
    "兰",
    "殷",
    "施",
    "陶",
    "洪",
    "翟",
    "安",
    "颜",
    "倪",
    "严",
    "牛",
    "温",
    "芦",
    "季",
    "俞",
    "章",
    "鲁",
    "葛",
    "伍",
    "韦",
    "申",
    "尤",
    "毕",
    "聂",
    "丛",
    "焦",
    "向",
    "柳",
    "邢",
    "路",
    "岳",
    "齐",
    "沿",
    "梅",
    "莫",
    "庄",
    "辛",
    "管",
    "祝",
    "左",
    "涂",
    "谷",
    "冷",

    // 常见复姓
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
    const sortedSurnames = chineseSurnames.sort((a, b) => b.length - a.length);

    for (const surname of sortedSurnames) {
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
  if (separatorType === "one") {
    separator = ",";
  } else if (separatorType === "two") {
    separator = ";";
  } else if (separatorType === "three") {
    separator = "，";
  } else if (separatorType === "four") {
    separator = "；";
  } else if (inputValue && inputValue.trim()) {
    separator = inputValue.trim();
  }

  // 处理每个选中的条目
  for (const item of items) {
    if (!item.isRegularItem()) continue;

    // 获取现有作者
    const existingCreators = item.getCreators();
    if (existingCreators.length === 0) continue;

    // 将现有作者合并成一行字符串
    const authorString = existingCreators
      .map((creator) => {
        if (creator.fieldMode === 1) {
          // 单字段模式，只有 lastName
          return creator.lastName || "";
        } else {
          // 双字段模式，姓名组合
          const lastName = creator.lastName || "";
          const firstName = creator.firstName || "";
          return firstName ? `${lastName} ${firstName}` : lastName;
        }
      })
      .join(separator + " ");

    // 按分隔符重新分割作者
    const authorParts = authorString
      .split(separator)
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

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
    item.setCreators(newCreators);
    await item.saveTx();
  }

  // 刷新界面
  // Zotero.getActiveZoteroPane().itemsView.refreshAndMaintainSelection();

  ztoolkit.log(`处理完成，共更新 ${items.length} 个条目的作者信息`);
}
